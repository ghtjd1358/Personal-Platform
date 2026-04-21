/**
 * Velog CDN 이미지 → Supabase Storage 마이그레이션 스크립트
 *
 * 실행 전:
 * 1. SUPABASE_SERVICE_ROLE_KEY를 아래에 입력 (Supabase Dashboard → Settings → API)
 * 2. node apps/blog/scripts/migrate-velog-images.js
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const path = require('path');
const crypto = require('crypto');

const SUPABASE_URL = 'https://ujhlgylnauzluttvmcrz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';
const BUCKET = 'images';
const FOLDER = 'blog';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${url} (${res.statusCode})`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractVelogImages(content) {
  const regex = /https:\/\/velog\.velcdn\.com\/images\/[^\s"'<>]+/g;
  return [...new Set(content.match(regex) || [])];
}

function getExtFromContentType(contentType, url) {
  if (contentType?.includes('png')) return 'png';
  if (contentType?.includes('gif')) return 'gif';
  if (contentType?.includes('webp')) return 'webp';
  const urlExt = path.extname(url.split('?')[0]);
  return urlExt ? urlExt.slice(1) : 'jpg';
}

async function uploadToSupabase(buffer, contentType, filename) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(`${FOLDER}/${filename}`, buffer, {
      contentType,
      upsert: true,
    });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${filename}`);
  return publicUrl;
}

async function migrate() {
  if (SUPABASE_SERVICE_ROLE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY를 입력해주세요!');
    process.exit(1);
  }

  console.log('📋 Velog 이미지 포함 포스트 조회 중...');
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, content')
    .ilike('content', '%velog.velcdn.com%');

  if (error) throw error;
  console.log(`✅ ${posts.length}개 포스트 발견\n`);

  const urlMap = {}; // velogUrl → supabaseUrl 캐시 (중복 이미지 방지)
  let totalImages = 0;
  let successCount = 0;
  let failCount = 0;

  for (const post of posts) {
    const velogUrls = extractVelogImages(post.content);
    if (velogUrls.length === 0) continue;

    console.log(`\n📝 [${post.title}] - 이미지 ${velogUrls.length}개`);
    let newContent = post.content;

    for (const velogUrl of velogUrls) {
      totalImages++;

      // 이미 처리한 URL은 캐시 사용
      if (urlMap[velogUrl]) {
        newContent = newContent.replaceAll(velogUrl, urlMap[velogUrl]);
        console.log(`  ♻️  캐시 사용: ${velogUrl.slice(-40)}`);
        successCount++;
        continue;
      }

      try {
        const { buffer, contentType } = await downloadImage(velogUrl);
        const hash = crypto.createHash('md5').update(velogUrl).digest('hex').slice(0, 8);
        const ext = getExtFromContentType(contentType, velogUrl);
        const filename = `velog_${hash}.${ext}`;

        const supabaseUrl = await uploadToSupabase(buffer, contentType || 'image/jpeg', filename);
        urlMap[velogUrl] = supabaseUrl;
        newContent = newContent.replaceAll(velogUrl, supabaseUrl);
        console.log(`  ✅ 업로드 완료: ${filename}`);
        successCount++;
      } catch (err) {
        console.error(`  ❌ 실패: ${velogUrl.slice(-40)} → ${err.message}`);
        failCount++;
      }
    }

    // content 업데이트
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ content: newContent, updated_at: new Date().toISOString() })
      .eq('id', post.id);

    if (updateError) {
      console.error(`  ❌ DB 업데이트 실패: ${updateError.message}`);
    } else {
      console.log(`  💾 DB 업데이트 완료`);
    }
  }

  console.log('\n==============================');
  console.log(`✅ 완료: ${successCount}/${totalImages}개 성공`);
  if (failCount > 0) console.log(`❌ 실패: ${failCount}개`);
  console.log('==============================');
}

migrate().catch(console.error);
