import { getSupabase } from '@sonhoseong/mfa-lib';

export const countByResumeId = async (resumeId: string): Promise<number> => {
    const { count, error } = await getSupabase()
        .from('portfolios')
        .select('*', { count: 'exact', head: true })
        .eq('resume_id', resumeId);
    if (error) throw error;
    return count || 0;
};
