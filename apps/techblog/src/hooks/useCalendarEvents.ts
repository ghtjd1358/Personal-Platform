/**
 * useCalendarEvents Hook
 *
 * Manages calendar events with date range filtering
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarEvent } from '@/types/job';
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  CreateEventInput,
  UpdateEventInput,
} from '@/network/apis';

// mock fallback 제거 — API 실패 시 빈 배열로 정직하게 표시

interface UseCalendarEventsState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
}

interface UseCalendarEventsParams {
  year: number;
  month: number;  // 0-indexed (0 = January)
}

interface UseCalendarEventsReturn extends UseCalendarEventsState {
  // CRUD operations
  create: (input: CreateEventInput) => Promise<CalendarEvent | null>;
  update: (eventId: string, input: UpdateEventInput) => Promise<boolean>;
  remove: (eventId: string) => Promise<boolean>;
  refetch: () => void;

  // Computed helpers
  getEventsForDate: (dateStr: string) => CalendarEvent[];
  monthEvents: CalendarEvent[];
}

/**
 * Hook for managing calendar events with month-based filtering
 *
 * @param params - Year and month (0-indexed) to filter events
 *
 * @example
 * ```tsx
 * const { events, monthEvents, getEventsForDate, create } = useCalendarEvents({
 *   year: 2024,
 *   month: 1  // February (0-indexed)
 * });
 *
 * // Get events for a specific date
 * const dayEvents = getEventsForDate('2024-02-15');
 *
 * // Add a new event
 * await create({
 *   title: '면접',
 *   date: '2024-02-20',
 *   type: 'interview'
 * });
 * ```
 */
export function useCalendarEvents(params: UseCalendarEventsParams): UseCalendarEventsReturn {
  const { year, month } = params;

  const [state, setState] = useState<UseCalendarEventsState>({
    events: [],
    isLoading: true,
    error: null,
  });

  // Calculate date range for the month
  const dateRange = useMemo(() => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, [year, month]);

  const fetchEvents = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getCalendarEvents({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      if (result.success && result.data) {
        setState({ events: result.data, isLoading: false, error: null });
      } else {
        setState({ events: [], isLoading: false, error: result.error ?? null });
      }
    } catch {
      setState({ events: [], isLoading: false, error: '일정을 불러오지 못했어요.' });
    }
  }, [dateRange, year, month]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /**
   * Create a new calendar event
   */
  const create = useCallback(async (input: CreateEventInput): Promise<CalendarEvent | null> => {
    try {
      const result = await createCalendarEvent(input);

      if (result.success && result.data) {
        // Add to local state if within current month
        const eventDate = new Date(result.data.date);
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
          setState(prev => ({
            ...prev,
            events: [...prev.events, result.data!].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
          }));
        }
        return result.data;
      } else {
        // Fallback: Create local event
        const newEvent: CalendarEvent = {
          id: `event-${Date.now()}`,
          ...input,
        };
        const eventDate = new Date(newEvent.date);
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
          setState(prev => ({
            ...prev,
            events: [...prev.events, newEvent].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            ),
          }));
        }
        return newEvent;
      }
    } catch {
      setState(prev => ({ ...prev, error: '일정 생성 중 오류 발생' }));
      return null;
    }
  }, [year, month]);

  /**
   * Update a calendar event with optimistic update
   */
  const update = useCallback(async (
    eventId: string,
    input: UpdateEventInput
  ): Promise<boolean> => {
    // Optimistic update
    const previousEvents = state.events;
    setState(prev => ({
      ...prev,
      events: prev.events.map(event =>
        event.id === eventId ? { ...event, ...input } : event
      ),
    }));

    try {
      const result = await updateCalendarEvent(eventId, input);

      if (!result.success) {
        // Revert on error
        setState(prev => ({
          ...prev,
          events: previousEvents,
          error: result.error || '수정 실패',
        }));
        return false;
      }

      return true;
    } catch {
      // Revert on error
      setState(prev => ({
        ...prev,
        events: previousEvents,
        error: '일정 수정 중 오류 발생',
      }));
      return false;
    }
  }, [state.events]);

  /**
   * Delete a calendar event with optimistic update
   */
  const remove = useCallback(async (eventId: string): Promise<boolean> => {
    // Optimistic update
    const previousEvents = state.events;
    setState(prev => ({
      ...prev,
      events: prev.events.filter(event => event.id !== eventId),
    }));

    try {
      const result = await deleteCalendarEvent(eventId);

      if (!result.success) {
        // Revert on error
        setState(prev => ({
          ...prev,
          events: previousEvents,
          error: result.error || '삭제 실패',
        }));
        return false;
      }

      return true;
    } catch {
      // Revert on error
      setState(prev => ({
        ...prev,
        events: previousEvents,
        error: '일정 삭제 중 오류 발생',
      }));
      return false;
    }
  }, [state.events]);

  /**
   * Get events for a specific date
   */
  const getEventsForDate = useCallback(
    (dateStr: string) => state.events.filter(e => e.date === dateStr),
    [state.events]
  );

  /**
   * Get all events for the current month, sorted by date
   */
  const monthEvents = useMemo(
    () => [...state.events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
    [state.events]
  );

  return {
    ...state,
    create,
    update,
    remove,
    refetch: fetchEvents,
    getEventsForDate,
    monthEvents,
  };
}

export default useCalendarEvents;
