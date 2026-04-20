/**
 * Get Bookmarks API
 *
 * Fetches user's bookmarked jobs
 */

import { Job, JobBookmark } from '@/types/job';
import {
  ApiResponse,
  getSupabase,
  successResponse,
  errorResponse,
  getCurrentUserId,
} from '../common';

/**
 * Bookmark with job data
 */
export interface BookmarkWithJob {
  id: string;
  jobId: string;
  job: Job;
  createdAt: string;
}

/**
 * Get all bookmarks for the current user
 *
 * @example
 * ```ts
 * const result = await getBookmarks();
 * if (result.success) {
 *   const bookmarkedJobIds = result.data?.map(b => b.jobId);
 * }
 * ```
 */
export async function getBookmarks(): Promise<ApiResponse<BookmarkWithJob[]>> {
  try {
    const supabase = getSupabase();
    const userId = await getCurrentUserId();

    if (!userId) {
      return errorResponse('로그인이 필요합니다.');
    }

    const { data, error } = await supabase
      .from('job_bookmarks')
      .select(`
        id,
        job_id,
        created_at,
        job:jobs(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return errorResponse(error.message);
    }

    const bookmarks: BookmarkWithJob[] = (data || [])
      .filter(item => item.job) // Filter out bookmarks with deleted jobs
      .map(item => ({
        id: item.id,
        jobId: item.job_id,
        job: transformJob(item.job),
        createdAt: item.created_at,
      }));

    return successResponse(bookmarks);
  } catch (err) {
    return errorResponse('북마크 목록을 불러오는데 실패했습니다.');
  }
}

/**
 * Get bookmarked job IDs only (lighter query)
 */
export async function getBookmarkIds(): Promise<ApiResponse<string[]>> {
  try {
    const supabase = getSupabase();
    const userId = await getCurrentUserId();

    if (!userId) {
      // Return empty array if not logged in (allow guest browsing)
      return successResponse([]);
    }

    const { data, error } = await supabase
      .from('job_bookmarks')
      .select('job_id')
      .eq('user_id', userId);

    if (error) {
      return errorResponse(error.message);
    }

    const jobIds = (data || []).map(item => item.job_id);
    return successResponse(jobIds);
  } catch (err) {
    return errorResponse('북마크 목록을 불러오는데 실패했습니다.');
  }
}

/**
 * Transform database row to Job interface
 */
function transformJob(row: Record<string, unknown>): Job {
  return {
    id: row.id as string,
    company: row.company as string,
    position: row.position as string,
    location: row.location as string || '',
    salary: row.salary as string || '',
    deadline: row.deadline as string || '',
    skills: (row.skills as string[]) || [],
    description: row.description as string || '',
    companyInfo: (row.company_info as Job['companyInfo']) || {
      industry: '',
      employees: '',
      founded: '',
    },
    jobUrl: row.job_url as string,
    postedAt: row.posted_at as string || '',
  };
}
