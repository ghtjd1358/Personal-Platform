/**
 * Get Calendar Events API
 *
 * Fetches calendar events with optional date range filtering
 */

import { CalendarEvent } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface GetEventsParams {
  startDate?: string;  // YYYY-MM-DD
  endDate?: string;    // YYYY-MM-DD
  type?: 'interview' | 'deadline' | 'applied';
}

/**
 * Get calendar events with optional date range filter
 *
 * @example
 * ```ts
 * // Get events for a specific month
 * const result = await getCalendarEvents({
 *   startDate: '2024-02-01',
 *   endDate: '2024-02-29'
 * });
 * ```
 */
export async function getCalendarEvents(
  params: GetEventsParams = {}
): Promise<ApiResponse<CalendarEvent[]>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { startDate, endDate, type } = params;

    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    // Apply date range filter
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    // Apply type filter
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('getCalendarEvents error:', error);
      return errorResponse(error.message);
    }

    const events: CalendarEvent[] = (data || []).map(row => ({
      id: row.id,
      title: row.title,
      date: row.date,
      type: row.type as 'interview' | 'deadline' | 'applied',
      applicationId: row.application_id,
      color: row.color,
    }));

    return successResponse(events);
  } catch (err) {
    console.error('getCalendarEvents exception:', err);
    return errorResponse('일정을 불러오는데 실패했습니다');
  }
}

/**
 * Get a single event by ID
 */
export async function getCalendarEventById(
  eventId: string
): Promise<ApiResponse<CalendarEvent>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('getCalendarEventById error:', error);
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
    console.error('getCalendarEventById exception:', err);
    return errorResponse('일정을 불러오는데 실패했습니다');
  }
}
