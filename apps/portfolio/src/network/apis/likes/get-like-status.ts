import { getSupabase, ApiResponse } from '../common';
import { LikeStatus } from './types';

/**
 * 포트폴리오의 좋아요 상태를 조회합니다.
 * - 현재 사용자의 좋아요 여부
 * - 전체 좋아요 수
 */
export async function getLikeStatus(
  portfolioId: string,
  userId?: string | null
): Promise<ApiResponse<LikeStatus>> {
  try {
    const supabase = getSupabase();

    // 1. 포트폴리오의 like_count 조회
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select('like_count')
      .eq('id', portfolioId)
      .single();

    if (portfolioError) {
      return { success: false, error: portfolioError.message };
    }

    // 2. 현재 사용자의 좋아요 여부 확인
    let isLiked = false;
    if (userId) {
      const { data: likeRecord } = await supabase
        .from('portfolio_likes')
        .select('id')
        .eq('portfolio_id', portfolioId)
        .eq('user_id', userId)
        .maybeSingle();

      isLiked = !!likeRecord;
    }

    return {
      success: true,
      data: {
        isLiked,
        likeCount: portfolio?.like_count || 0,
      },
    };
  } catch (err) {
    console.error('Error getting like status:', err);
    return {
      success: false,
      error: '좋아요 상태 조회 중 오류가 발생했습니다.',
    };
  }
}
