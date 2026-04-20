import { getSupabase, ApiResponse } from '@/network/apis/common';
import { PostDetail, TagDetail } from './types';

/** 포스트-태그 조인 결과 타입 */
interface PostTagJoin {
  tag: TagDetail | null;
}

/**
 * 블로그 게시글 상세 정보를 조회합니다.
 */
export async function getPostDetail(
  idOrSlug: string,
  bySlug = false,
  incrementView = true
): Promise<ApiResponse<PostDetail>> {
  try {
    const supabase = getSupabase();
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles(id, name, avatar_url)
      `);

    if (bySlug) {
      query = query.eq('slug', idOrSlug);
    } else {
      query = query.eq('id', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) {
      return { success: false, error: error.message };
    }

    // 조회수 증가
    if (incrementView) {
      const newViewCount = (data.view_count || 0) + 1;
      await supabase
        .from('blog_posts')
        .update({ view_count: newViewCount })
        .eq('id', data.id);

      data.view_count = newViewCount;
    }

    // 태그 조회
    const { data: postTags } = await supabase
      .from('blog_post_tags')
      .select(`
        tag:blog_tags(id, name, slug)
      `)
      .eq('post_id', data.id);

    return {
      success: true,
      data: {
        ...data,
        tags: postTags?.map((pt: PostTagJoin) => pt.tag).filter(Boolean) || [],
      },
    };
  } catch (err) {
    return { success: false, error: '게시글 조회 중 오류가 발생했습니다.' };
  }
}
