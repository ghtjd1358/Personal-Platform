/**
 * Update Application API
 *
 * Updates an existing job application
 */

import { JobApplication, ApplicationStatus, ApplicationResult, ApplicationSource } from '@/types/job';
import { ApiResponse, getSupabase, successResponse, errorResponse } from '../common';

export interface UpdateApplicationInput {
  companyName?: string;
  position?: string;
  jobUrl?: string;
  status?: ApplicationStatus;
  result?: ApplicationResult;
  salaryRange?: string;
  location?: string;
  appliedAt?: string;
  interviewAt?: string;
  source?: ApplicationSource;
}

/**
 * Update a job application
 *
 * @example
 * ```ts
 * // Update status only
 * const result = await updateApplication('app-1', { status: 'interview' });
 *
 * // Update result
 * const result = await updateApplication('app-1', { result: 'passed' });
 * ```
 */
export async function updateApplication(
  applicationId: string,
  input: UpdateApplicationInput
): Promise<ApiResponse<JobApplication>> {
  try {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('로그인이 필요합니다');
    }

    // Build update object with snake_case keys
    const updateData: Record<string, unknown> = {};

    if (input.companyName !== undefined) updateData.company_name = input.companyName;
    if (input.position !== undefined) updateData.position = input.position;
    if (input.jobUrl !== undefined) updateData.job_url = input.jobUrl;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.result !== undefined) updateData.result = input.result;
    if (input.salaryRange !== undefined) updateData.salary_range = input.salaryRange;
    if (input.location !== undefined) updateData.location = input.location;
    if (input.appliedAt !== undefined) updateData.applied_at = input.appliedAt;
    if (input.interviewAt !== undefined) updateData.interview_at = input.interviewAt;
    if (input.source !== undefined) updateData.source = input.source;

    // Auto-set applied_at when status changes to 'applied'
    if (input.status === 'applied' && !input.appliedAt) {
      updateData.applied_at = new Date().toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('updateApplication error:', error);
      return errorResponse(error.message);
    }

    if (!data) {
      return errorResponse('지원 현황을 찾을 수 없습니다');
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
    console.error('updateApplication exception:', err);
    return errorResponse('지원 현황 수정에 실패했습니다');
  }
}

/**
 * Update application status (convenience function for drag-and-drop)
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus
): Promise<ApiResponse<JobApplication>> {
  return updateApplication(applicationId, { status });
}

/**
 * Update application result (convenience function)
 */
export async function updateApplicationResult(
  applicationId: string,
  result: ApplicationResult
): Promise<ApiResponse<JobApplication>> {
  return updateApplication(applicationId, { result });
}
