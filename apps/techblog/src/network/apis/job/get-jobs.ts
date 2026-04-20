/**
 * Get Jobs API
 *
 * Fetches job listings with optional search and filtering
 */

import { Job } from '@/types/job';
import {
  ApiResponse,
  PageListResponse,
  getSupabase,
  successResponse,
  errorResponse,
  createPaginationMeta,
} from '../common';

/**
 * Job search parameters
 */
export interface JobSearchParams {
  /** Search query (company, position, skills) */
  search?: string;
  /** Filter by location (e.g., "서울", "경기") */
  location?: string;
  /** Filter by skill */
  skill?: string;
  /** Page number (1-indexed) */
  page?: number;
  /** Items per page */
  limit?: number;
}

/**
 * Get jobs with search and filtering
 *
 * @example
 * ```ts
 * const result = await getJobs({ search: '프론트엔드', location: '서울', page: 1 });
 * if (result.success) {
 *   console.log(result.data?.data); // Job[]
 * }
 * ```
 */
export async function getJobs(
  params: JobSearchParams = {}
): Promise<ApiResponse<PageListResponse<Job>>> {
  try {
    const supabase = getSupabase();
    const { search, location, skill, page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' });

    // Search filter (company, position, or skills)
    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      query = query.or(
        `company.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%`
      );
    }

    // Location filter
    if (location && location !== '전체') {
      query = query.ilike('location', `%${location}%`);
    }

    // Skill filter (array contains)
    if (skill && skill !== '전체') {
      query = query.contains('skills', [skill]);
    }

    // Pagination and ordering
    query = query
      .order('deadline', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return errorResponse(error.message);
    }

    // Transform data to match Job interface
    const jobs: Job[] = (data || []).map(transformJob);

    return successResponse(createPaginationMeta(jobs, count || 0, page, limit));
  } catch (err) {
    return errorResponse('채용공고 목록을 불러오는데 실패했습니다.');
  }
}

/**
 * Get all unique locations from jobs
 */
export async function getJobLocations(): Promise<ApiResponse<string[]>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('jobs')
      .select('location');

    if (error) {
      return errorResponse(error.message);
    }

    // Extract unique base locations (first part before space)
    const locations = [...new Set(
      (data || [])
        .map(job => job.location?.split(' ')[0])
        .filter(Boolean)
    )];

    return successResponse(['전체', ...locations.sort()]);
  } catch (err) {
    return errorResponse('지역 목록을 불러오는데 실패했습니다.');
  }
}

/**
 * Get all unique skills from jobs
 */
export async function getJobSkills(): Promise<ApiResponse<string[]>> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('jobs')
      .select('skills');

    if (error) {
      return errorResponse(error.message);
    }

    // Extract unique skills
    const allSkills = (data || []).flatMap(job => job.skills || []);
    const uniqueSkills = [...new Set(allSkills)].slice(0, 15);

    return successResponse(['전체', ...uniqueSkills]);
  } catch (err) {
    return errorResponse('기술 스택 목록을 불러오는데 실패했습니다.');
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
