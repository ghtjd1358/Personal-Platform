import { getSupabase, ApiResponse, PageListResponse } from '@/network/apis/common';
import { PostSummary, PostSearchCondition } from './types';

// 블로그 시작일 (운영일수 계산용)
const BLOG_START_DATE = new Date('2026-02-09');

// 기본 상태값
const DEFAULT_POST_STATUS = 'published' as const;

export interface PostsWithStats extends PageListResponse<PostSummary> {
  stats: {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    daysRunning: number;
  };
}

/**
 * 블로그 게시글 목록을 조회합니다.
 */
export async function getPosts(
  params: PostSearchCondition = {}
): Promise<ApiResponse<PostsWithStats>> {
  try {
    const supabase = getSupabase();
    const { page = 1, limit = 10, status, isFeatured, search, userId, tagId, categoryId } = params;
    const offset = (page - 1) * limit;

    // 태그 정보를 JOIN으로 한 번에 조회 (N+1 쿼리 방지)
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_tags(
          tag:blog_tags(id, name, slug)
        )
      `, { count: 'exact' });

    // 필터 적용
    if (status) {
      query = query.eq('status', status);
    } else {
      query = query.eq('status', DEFAULT_POST_STATUS);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (isFeatured !== undefined) {
      query = query.eq('is_featured', isFeatured);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 정렬 및 페이지네이션
    query = query
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    // JOIN으로 가져온 태그 데이터를 변환 (N+1 쿼리 제거됨)
    interface PostWithJoinedTags {
      blog_post_tags?: Array<{ tag: { id: string; name: string; slug: string } | null }>;
      [key: string]: unknown;
    }

    const postsWithTags = (data || []).map((post: PostWithJoinedTags) => {
      const { blog_post_tags, ...restPost } = post;
      return {
        ...restPost,
        tags: blog_post_tags?.map((pt) => pt.tag).filter(Boolean) || [],
      };
    });

    // 전체 통계 조회 (published만)
    const { data: allPosts } = await supabase
      .from('blog_posts')
      .select('view_count, like_count')
      .eq('status', DEFAULT_POST_STATUS);

    const totalPosts = allPosts?.length || 0;
    const totalViews = allPosts?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;
    const totalLikes = allPosts?.reduce((sum, p) => sum + (p.like_count || 0), 0) || 0;
    const daysRunning = Math.floor((Date.now() - BLOG_START_DATE.getTime()) / (1000 * 60 * 60 * 24));

    return {
      success: true,
      data: {
        data: postsWithTags,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
        stats: { totalPosts, totalViews, totalLikes, daysRunning },
      },
    };
  } catch (err) {
    return { success: false, error: '게시글 목록 조회 중 오류가 발생했습니다.' };
  }
}
