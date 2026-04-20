/**
 * Update Calendar Event API
 *
 * Updates an existing calendar event
 */

import { CalendarEvent } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface UpdateEventInput {
  title?: string;
  date?: string;
  type?: 'interview' | 'deadline' | 'applied';
  applicationId?: string;
  color?: string;
}

/**
 * Update a calendar event
 *
 * @example
 * ```ts
 * const result = await updateCalendarEvent('event-1', {
 *   date: '2024-02-25',
 *   title: '네이버 2차 면접'
 * });
 * ```
 */
export async function updateCalendarEvent(
  eventId: string,
  input: UpdateEventInput
): Promise<ApiResponse<CalendarEvent>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.date !== undefined) updateData.date = input.date;
    if (input.type !== undefined) updateData.type = input.type;
    if (input.applicationId !== undefined) updateData.application_id = input.applicationId;
    if (input.color !== undefined) updateData.color = input.color;

    const { data, error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', eventId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('updateCalendarEvent error:', error);
      return errorResponse(error.message);
    }

    if (!data) {
      return errorResponse('일정을 찾을 수 없습니다');
    }

    const event: CalendarEvent = {
      id: data.id,
      title: data.title,
      date: data.date,
      type: data.type as 'interview' | 'deadline' | 'applied',
      applicationId: data.application_id,
      color: data.color,
    };

    return successResponse(event);
  } catch (err) {
    console.error('updateCalendarEvent exception:', err);
    return errorResponse('일정 수정에 실패했습니다');
  }
}
