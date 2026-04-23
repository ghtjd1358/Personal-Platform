/**
 * Techblog remote — API hook barrel.
 * 모든 API 호출은 여기 훅을 통해서. techblog API 는 ApiResponse<T> 래핑 shape.
 */

// application
export { useFetchApplications } from './useFetchApplications';
export { useFetchApplicationById } from './useFetchApplicationById';
export { useCreateApplication } from './useCreateApplication';
export { useUpdateApplication } from './useUpdateApplication';
export { useUpdateApplicationStatus } from './useUpdateApplicationStatus';
export { useUpdateApplicationResult } from './useUpdateApplicationResult';
export { useDeleteApplication } from './useDeleteApplication';

// bookmark
export { useFetchBookmarks } from './useFetchBookmarks';
export { useFetchBookmarkIds } from './useFetchBookmarkIds';
export { useToggleBookmark } from './useToggleBookmark';
export { useAddBookmark } from './useAddBookmark';
export { useRemoveBookmark } from './useRemoveBookmark';

// calendar
export { useFetchCalendarEvents } from './useFetchCalendarEvents';
export { useFetchCalendarEventById } from './useFetchCalendarEventById';
export { useCreateCalendarEvent } from './useCreateCalendarEvent';
export { useUpdateCalendarEvent } from './useUpdateCalendarEvent';
export { useDeleteCalendarEvent } from './useDeleteCalendarEvent';

// job
export { useFetchJobs } from './useFetchJobs';
export { useFetchJobDetail } from './useFetchJobDetail';
export { useFetchJobLocations } from './useFetchJobLocations';
export { useFetchJobSkills } from './useFetchJobSkills';

// note
export { useFetchNotesByApplicationId } from './useFetchNotesByApplicationId';
export { useFetchNoteById } from './useFetchNoteById';
export { useCreateNote } from './useCreateNote';
export { useUpdateNote } from './useUpdateNote';
export { useDeleteNote } from './useDeleteNote';
