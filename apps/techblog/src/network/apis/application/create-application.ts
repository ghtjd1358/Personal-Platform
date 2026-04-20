/**
 * Create Application API
 *
 * Creates a new job application
 */

import { JobApplication, ApplicationStatus, ApplicationResult, ApplicationSource } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface CreateApplicationInput {
  jobId?: string;
  companyName: string;
  position: string;
  jobUrl?: string;
  status?: ApplicationStatus;
  salaryRange?: string;
  location?: string;
  appliedAt?: string;
  interviewAt?: string;
  source?: ApplicationSource;
}

/**
 * Create a new job application
 *
 * @example
 * ```ts
 * const result = await createApplication({
 *   companyName: '네이버',
 *   position: '프론트엔드 개발자',
 *   status: 'interested'
 * });
 * ```
 */
export async function createApplication(
  input: CreateApplicationInput
): Promise<ApiResponse<JobApplication>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    const insertData = {
      user_id: user.id,
      job_id: input.jobId || null,
      company_name: input.companyName,
      position: input.position,
      job_url: input.jobUrl || null,
      status: input.status || 'interested',
      result: 'pending' as ApplicationResult,
      salary_range: input.salaryRange || null,
      location: input.location || null,
      applied_at: input.appliedAt || null,
      interview_at: input.interviewAt || null,
      source: input.source || null,
    };

    const { data, error } = await supabase
      .from('job_applications')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('createApplication error:', error);
      return errorResponse(error.message);
    }

    const application: JobApplication = {
      id: data.id,
      userId: data.user_id,
      jobId: data.job_id,
      companyName: data.company_name,
      position: data.position,
      jobUrl: data.job_url,
      status: data.status as ApplicationStatus,
      result: data.result as ApplicationResult,
      appliedAt: data.applied_at,
      interviewAt: data.interview_at,
      salaryRange: data.salary_range,
      location: data.location,
      source: data.source as ApplicationSource,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return successResponse(application);
  } catch (err) {
    console.error('createApplication exception:', err);
    return errorResponse('지원 현황 생성에 실패했습니다');
  }
}
