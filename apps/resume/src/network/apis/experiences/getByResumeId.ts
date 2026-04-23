import { getSupabase } from '@sonhoseong/mfa-lib';

/** 특정 이력서(resume) 에 연결된 experiences 조회 */
export const getByResumeId = (resumeId: string) =>
    getSupabase().from('experiences').select('*').eq('resume_id', resumeId).order('order_index');
