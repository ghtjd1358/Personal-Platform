/**
 * useJobBookmarks Hook
 *
 * Manages job bookmark state with optimistic updates
 */

import { useState, useEffect, useCallback } from 'react';
import { getBookmarkIds, toggleBookmark } from '@/network/apis';

interface UseJobBookmarksReturn {
  bookmarks: string[];
  isLoading: boolean;
  error: string | null;
  isBookmarked: (jobId: string) => boolean;
  toggle: (jobId: string) => Promise<void>;
  refetch: () => void;
}

/**
 * Hook for managing job bookmarks
 *
 * @example
 * ```tsx
 * const { bookmarks, isBookmarked, toggle } = useJobBookmarks();
 *
 * <button onClick={() => toggle(job.id)}>
 *   {isBookmarked(job.id) ? '북마크 해제' : '북마크'}
 * </button>
 * ```
 */
export function useJobBookmarks(): UseJobBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getBookmarkIds();

      if (result.success && result.data) {
        setBookmarks(result.data);
      } else {
        // If not logged in or API fails, use empty array
        setBookmarks([]);
      }
    } catch {
      setBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const isBookmarked = useCallback(
    (jobId: string) => bookmarks.includes(jobId),
    [bookmarks]
  );

  const toggle = useCallback(async (jobId: string) => {
    // Optimistic update
    const wasBookmarked = bookmarks.includes(jobId);
    setBookmarks(prev =>
      wasBookmarked
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );

    try {
      const result = await toggleBookmark(jobId);

      if (!result.success) {
        // Revert on error
        setBookmarks(prev =>
          wasBookmarked
            ? [...prev, jobId]
            : prev.filter(id => id !== jobId)
        );
        setError(result.error || '북마크 처리 실패');
      }
    } catch {
      // Revert on error
      setBookmarks(prev =>
        wasBookmarked
          ? [...prev, jobId]
          : prev.filter(id => id !== jobId)
      );
      setError('북마크 처리 중 오류 발생');
    }
  }, [bookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    isBookmarked,
    toggle,
    refetch: fetchBookmarks,
  };
}

export default useJobBookmarks;
