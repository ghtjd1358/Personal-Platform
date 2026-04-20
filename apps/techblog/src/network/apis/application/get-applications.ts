/**
 * Get Applications API
 *
 * Fetches user's job applications with optional job data
 */

import { JobApplication, ApplicationStatus, ApplicationSource } from '@/types/job';
import { ApiResponse, PageListResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface ApplicationSearchParams {
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

interface ApplicationWithNotesCount extends JobApplication {
  notesCount?: number;
}

/**
 * Get user's job applications with pagination
 *
 * @example
 * ```ts
 * const result = await getApplications({ status: 'interview', page: 1 });
 * if (result.success) {
 *   console.log(result.data.data); // JobApplication[]
 * }
 * ```
 */
export async function getApplications(
  params: ApplicationSearchParams = {}
): Promise<ApiResponse<PageListResponse<ApplicationWithNotesCount>>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { status, page = 1, limit = 50 } = params;
    const offset = (page - 1) * limit;

    // Build query with notes count
    let query = supabase
      .from('job_applications')
      .select(`
        *,
        notes:job_notes(count)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('getApplications error:', error);
      return errorResponse(error.message);
    }

    // Transform data to match frontend types
    const applications: ApplicationWithNotesCount[] = (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      jobId: row.job_id,
      companyName: row.company_name,
      position: row.position,
      jobUrl: row.job_url,
      status: row.status as ApplicationStatus,
      result: row.result,
      appliedAt: row.applied_at,
      interviewAt: row.interview_at,
      salaryRange: row.salary_range,
      location: row.location,
      source: row.source as ApplicationSource,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      notesCount: row.notes?.[0]?.count || 0,
    }));

    const total = count || 0;

    return successResponse({
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('getApplications exception:', err);
    return errorResponse('지원 현황을 불러오는데 실패했습니다');
  }
}

/**
 * Get a single application by ID
 */
export async function getApplicationById(
  applicationId: string
): Promise<ApiResponse<ApplicationWithNotesCount>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        notes:job_notes(count)
      `)
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('getApplicationById error:', error);
      return errorResponse(error.message);
    }

    if (!data) {
      return errorResponse('지원 현황을 찾을 수 없습니다');
    }

    const application: ApplicationWithNotesCount = {
      id: data.id,
      userId: data.user_id,
      jobId: data.job_id,
      companyName: data.company_name,
      position: data.position,
      jobUrl: data.job_url,
      status: data.status as ApplicationStatus,
      result: data.result,
      appliedAt: data.applied_at,
      interviewAt: data.interview_at,
      salaryRange: data.salary_range,
      location: data.location,
      source: data.source as ApplicationSource,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      notesCount: data.notes?.[0]?.count || 0,
    };

    return successResponse(application);
  } catch (err) {
    console.error('getApplicationById exception:', err);
    return errorResponse('지원 현황을 불러오는데 실패했습니다');
  }
}
