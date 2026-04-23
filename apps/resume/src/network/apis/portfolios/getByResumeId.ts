import { getSupabase } from '@sonhoseong/mfa-lib';

export const getByResumeId = (resumeId: string) =>
    getSupabase().from('portfolios').select('*').eq('resume_id', resumeId).order('order_index');
