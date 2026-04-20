/**
 * Toggle Bookmark API
 *
 * Add or remove a job bookmark
 */

import {
  ApiResponse,
  getSupabase,
  successResponse,
  errorResponse,
  getCurrentUserId,
} from '../common';

/**
 * Toggle result
 */
export interface ToggleBookmarkResult {
  jobId: string;
  isBookmarked: boolean;
}

/**
 * Toggle bookmark for a job
 * If bookmarked, removes it. If not bookmarked, adds it.
 *
 * @example
 * ```ts
 * const result = await toggleBookmark('job-uuid');
 * if (result.success) {
 *   console.log(result.data?.isBookmarked); // true or false
 * }
 * ```
 */
export async function toggleBookmark(
  jobId: string
): Promise<ApiResponse<ToggleBookmarkResult>> {
  try {
    const supabase = getSupabase();
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse('로그인이 필요합니다.');
    }

    // Check if bookmark exists
    const { data: existing } = await supabase
      .from('job_bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (existing) {
      // Remove bookmark
      const { error } = await supabase
        .from('job_bookmarks')
        .delete()
        .eq('id', existing.id);

      if (error) {
        return errorResponse(error.message);
      }

      return successResponse({ jobId, isBookmarked: false });
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('job_bookmarks')
        .insert({
          user_id: userId,
          job_id: jobId,
        });

      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          return successResponse({ jobId, isBookmarked: true });
        }
        return errorResponse(error.message);
      }

      return successResponse({ jobId, isBookmarked: true });
    }
  } catch (err) {
    return errorResponse('북마크 처리 중 오류가 발생했습니다.');
  }
}

/**
 * Add bookmark (explicit add)
 */
export async function addBookmark(jobId: string): Promise<ApiResponse<void>> {
  try {
    const supabase = getSupabase();
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse('로그인이 필요합니다.');
    }

    const { error } = await supabase
      .from('job_bookmarks')
      .upsert({
        user_id: userId,
        job_id: jobId,
      }, {
        onConflict: 'user_id,job_id',
      });

    if (error) {
      return errorResponse(error.message);
    }

    return successResponse(undefined);
  } catch (err) {
    return errorResponse('북마크 추가 중 오류가 발생했습니다.');
  }
}

/**
 * Remove bookmark (explicit remove)
 */
export async function removeBookmark(jobId: string): Promise<ApiResponse<void>> {
  try {
    const supabase = getSupabase();
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse('로그인이 필요합니다.');
    }

    const { error } = await supabase
      .from('job_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', jobId);

    if (error) {
      return errorResponse(error.message);
    }

    return successResponse(undefined);
  } catch (err) {
    return errorResponse('북마크 삭제 중 오류가 발생했습니다.');
  }
}
