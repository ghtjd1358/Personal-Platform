/**
 * Delete Note API
 *
 * Deletes a note
 */

import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

/**
 * Delete a note
 *
 * @example
 * ```ts
 * const result = await deleteNote('note-1');
 * if (result.success) {
 *   console.log('Note deleted');
 * }
 * ```
 */
export async function deleteNote(
  noteId: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { error } = await supabase
      .from('job_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) {
      console.error('deleteNote error:', error);
      return errorResponse(error.message);
    }

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('deleteNote exception:', err);
    return errorResponse('노트 삭제에 실패했습니다');
  }
}
