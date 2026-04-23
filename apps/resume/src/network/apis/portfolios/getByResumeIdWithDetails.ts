import { getSupabase } from '@sonhoseong/mfa-lib';
import type { PortfolioWithDetails } from './types';
import { shapePortfolio } from './shape';

/** 이력서 기준 포트폴리오 전체 + 자식(tasks/tags) nested fetch. 홈/어드민에서 사용. */
export const getByResumeIdWithDetails = async (
    resumeId: string,
): Promise<PortfolioWithDetails[]> => {
    const { data, error } = await getSupabase()
        .from('portfolios')
        .select('*, portfolio_tasks(id, task, order_index), portfolio_tags(tag, order_index)')
        .eq('resume_id', resumeId)
        .order('order_index');
    if (error) throw error;
    return (data || []).map(shapePortfolio);
};
