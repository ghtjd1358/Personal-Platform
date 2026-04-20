/**
 * Delete Application API
 *
 * Deletes a job application and its related notes
 */

import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

/**
 * Delete a job application
 *
 * Notes related to this application will be automatically deleted
 * via ON DELETE CASCADE in the database schema.
 *
 * @example
 * ```ts
 * const result = await deleteApplication('app-1');
 * if (result.success) {
 *   console.log('Application deleted');
 * }
 * ```
 */
export async function deleteApplication(
  applicationId: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', applicationId)
      .eq('user_id', user.id);

    if (error) {
      console.error('deleteApplication error:', error);
      return errorResponse(error.message);
    }

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('deleteApplication exception:', err);
    return errorResponse('지원 현황 삭제에 실패했습니다');
  }
}
