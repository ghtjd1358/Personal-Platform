/**
 * Media Optimization Script
 * - PNG/JPG → WebP 변환
 * - 이미지 압축 및 리사이징
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const QUALITY = 80; // WebP 품질 (0-100)

async function optimizeImage(inputPath, outputPath, options = {}) {
  const stats = fs.statSync(inputPath);
  const originalSize = stats.size;

  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // 최대 너비 제한 (필요시)
  let pipeline = image;
  if (options.maxWidth && metadata.width > options.maxWidth) {
    pipeline = pipeline.resize(options.maxWidth);
  }

  // WebP로 변환
  await pipeline
    .webp({ quality: options.quality || QUALITY })
    .toFile(outputPath);

  const newStats = fs.statSync(outputPath);
  const newSize = newStats.size;
  const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

  return {
    original: originalSize,
    optimized: newSize,
    reduction: `${reduction}%`,
    originalKB: (originalSize / 1024).toFixed(1),
    optimizedKB: (newSize / 1024).toFixed(1)
  };
}

async function main() {
  console.log('🚀 MFA Portfolio - Media Optimization\n');
  console.log('='.repeat(50));

  const results = [];

  // Blog - cloude.png
  const blogImagePath = path.join(__dirname, '../apps/blog/public/cloude.png');
  const blogImageOutput = path.join(__dirname, '../apps/blog/public/cloude.webp');

  if (fs.existsSync(blogImagePath)) {
    console.log('\n📸 Processing: blog/cloude.png');
    const result = await optimizeImage(blogImagePath, blogImageOutput, { quality: 85 });
    console.log(`   Original:  ${result.originalKB} KB`);
    console.log(`   Optimized: ${result.optimizedKB} KB`);
    console.log(`   Reduction: ${result.reduction}`);
    results.push({ file: 'blog/cloude.png → webp', ...result });
  }

  // Resume - dorundorun.png (가장 큰 이미지)
  const resumeImagePath = path.join(__dirname, '../apps/resume/src/assets/images/project/dorundorun.png');
  const resumeImageOutput = path.join(__dirname, '../apps/resume/src/assets/images/project/dorundorun.webp');

  if (fs.existsSync(resumeImagePath)) {
    console.log('\n📸 Processing: resume/dorundorun.png');
    const result = await optimizeImage(resumeImagePath, resumeImageOutput, { quality: 85 });
    console.log(`   Original:  ${result.originalKB} KB`);
    console.log(`   Optimized: ${result.optimizedKB} KB`);
    console.log(`   Reduction: ${result.reduction}`);
    results.push({ file: 'resume/dorundorun.png → webp', ...result });
  }

  // Resume - hero images
  const heroImages = ['react.png', 'optimization.png', 'teamwork.png'];
  for (const heroImage of heroImages) {
    const heroPath = path.join(__dirname, '../apps/resume/src/assets/images/hero', heroImage);
    const heroOutput = heroPath.replace('.png', '.webp');

    if (fs.existsSync(heroPath)) {
      console.log(`\n📸 Processing: resume/hero/${heroImage}`);
      const result = await optimizeImage(heroPath, heroOutput, { quality: 85 });
      console.log(`   Original:  ${result.originalKB} KB`);
      console.log(`   Optimized: ${result.optimizedKB} KB`);
      console.log(`   Reduction: ${result.reduction}`);
      results.push({ file: `resume/hero/${heroImage} → webp`, ...result });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Optimization Summary\n');

  let totalOriginal = 0;
  let totalOptimized = 0;

  results.forEach(r => {
    totalOriginal += r.original;
    totalOptimized += r.optimized;
  });

  const totalReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);

  console.log(`   Total Original:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total Optimized: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total Saved:     ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB (${totalReduction}%)`);
  console.log('\n✅ Optimization complete!');
  console.log('\n⚠️  Note: Update image imports to use .webp files');
  console.log('    Video optimization requires ffmpeg (not automated)\n');

  return results;
}

main().catch(console.error);
