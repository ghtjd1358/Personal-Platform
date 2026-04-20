/**
 * Create Calendar Event API
 *
 * Creates a new calendar event
 */

import { CalendarEvent } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface CreateEventInput {
  title: string;
  date: string;  // YYYY-MM-DD
  type: 'interview' | 'deadline' | 'applied';
  applicationId?: string;
  color?: string;
}

/**
 * Create a new calendar event
 *
 * @example
 * ```ts
 * const result = await createCalendarEvent({
 *   title: '네이버 1차 면접',
 *   date: '2024-02-20',
 *   type: 'interview',
 *   applicationId: 'app-1',
 *   color: '#03C75A'
 * });
 * ```
 */
export async function createCalendarEvent(
  input: CreateEventInput
): Promise<ApiResponse<CalendarEvent>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const insertData = {
      user_id: user.id,
      title: input.title,
      date: input.date,
      type: input.type,
      application_id: input.applicationId || null,
      color: input.color || null,
    };

    const { data, error } = await supabase
      .from('calendar_events')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('createCalendarEvent error:', error);
      return errorResponse(error.message);
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
    console.error('createCalendarEvent exception:', err);
    return errorResponse('일정 생성에 실패했습니다');
  }
}
