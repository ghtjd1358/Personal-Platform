import { getSupabase, ApiResponse } from '../common';
import { ToggleLikeResult } from './types';

/**
 * 포트폴리오 좋아요를 토글합니다.
 * - 좋아요가 없으면 추가
 * - 좋아요가 있으면 삭제
 */
export async function toggleLike(
  portfolioId: string,
  userId: string
): Promise<ApiResponse<ToggleLikeResult>> {
  try {
    const supabase = getSupabase();

    // 1. 현재 좋아요 상태 확인
    const { data: existingLike } = await supabase
      .from('portfolio_likes')
      .select('id')
      .eq('portfolio_id', portfolioId)
      .eq('user_id', userId)
      .maybeSingle();

    let isLiked: boolean;

    if (existingLike) {
      // 2a. 좋아요 삭제
      const { error: deleteError } = await supabase
        .from('portfolio_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        return { success: false, error: deleteError.message };
      }
      isLiked = false;
    } else {
      // 2b. 좋아요 추가
      const { error: insertError } = await supabase
        .from('portfolio_likes')
        .insert({
          portfolio_id: portfolioId,
          user_id: userId,
        });

      if (insertError) {
        return { success: false, error: insertError.message };
      }
      isLiked = true;
    }

    // 3. 업데이트된 like_count 조회
    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('like_count')
      .eq('id', portfolioId)
      .single();

    return {
      success: true,
      data: {
        isLiked,
        likeCount: portfolio?.like_count || 0,
      },
    };
  } catch (err) {
    console.error('Error toggling like:', err);
    return {
      success: false,
      error: '좋아요 처리 중 오류가 발생했습니다.',
    };
  }
}
