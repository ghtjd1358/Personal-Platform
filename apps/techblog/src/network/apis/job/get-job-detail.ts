/**
 * Get Job Detail API
 *
 * Fetches a single job by ID
 */

import { Job } from '@/types/job';
import {
  ApiResponse,
  getSupabase,
  successResponse,
  errorResponse,
} from '../common';

/**
 * Get a single job by ID
 *
 * @example
 * ```ts
 * const result = await getJobDetail('job-uuid');
 * if (result.success) {
 *   console.log(result.data); // Job
 * }
 * ```
 */
export async function getJobDetail(jobId: string): Promise<ApiResponse<Job>> {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return errorResponse('채용공고를 찾을 수 없습니다.');
      }
      return errorResponse(error.message);
    }

    const job: Job = {
      id: data.id,
      company: data.company,
      position: data.position,
      location: data.location || '',
      salary: data.salary || '',
      deadline: data.deadline || '',
      skills: data.skills || [],
      description: data.description || '',
      companyInfo: data.company_info || {
        industry: '',
        employees: '',
        founded: '',
      },
      jobUrl: data.job_url,
      postedAt: data.posted_at || '',
    };

    return successResponse(job);
  } catch (err) {
    return errorResponse('채용공고를 불러오는데 실패했습니다.');
  }
}
