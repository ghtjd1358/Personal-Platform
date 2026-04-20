/**
 * Delete Calendar Event API
 *
 * Deletes a calendar event
 */

import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

/**
 * Delete a calendar event
 *
 * @example
 * ```ts
 * const result = await deleteCalendarEvent('event-1');
 * if (result.success) {
 *   console.log('Event deleted');
 * }
 * ```
 */
export async function deleteCalendarEvent(
  eventId: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId)
      .eq('user_id', user.id);

    if (error) {
      console.error('deleteCalendarEvent error:', error);
      return errorResponse(error.message);
    }

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('deleteCalendarEvent exception:', err);
    return errorResponse('일정 삭제에 실패했습니다');
  }
}
