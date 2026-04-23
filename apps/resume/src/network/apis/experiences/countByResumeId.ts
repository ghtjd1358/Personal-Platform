import { getSupabase } from '@sonhoseong/mfa-lib';

/** 이력서에 연결된 경력 개수 조회 (head: true 로 count 만) */
export const countByResumeId = async (resumeId: string): Promise<number> => {
    const { count, error } = await getSupabase()
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('resume_id', resumeId);
    if (error) throw error;
    return count || 0;
};
