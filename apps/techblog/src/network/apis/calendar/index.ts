/**
 * Calendar Event API Module
 *
 * CRUD operations for calendar events
 */

export {
  getCalendarEvents,
  getCalendarEventById,
  type GetEventsParams,
} from './get-events';

export {
  createCalendarEvent,
  type CreateEventInput,
} from './create-event';

export {
  updateCalendarEvent,
  type UpdateEventInput,
} from './update-event';

export { deleteCalendarEvent } from './delete-event';
