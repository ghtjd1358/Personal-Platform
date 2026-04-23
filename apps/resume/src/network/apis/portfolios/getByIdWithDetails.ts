import { getSupabase } from '@sonhoseong/mfa-lib';
import type { PortfolioWithDetails } from './types';
import { shapePortfolio } from './shape';

/**
 * 단건 포트폴리오 + 자식 nested fetch.
 * maybeSingle — id 미존재 시 404 throw 대신 null 반환 → ProjectDetail 페이지에서 Not Found 처리.
 */
export const getByIdWithDetails = async (
    id: string,
): Promise<PortfolioWithDetails | null> => {
    const { data, error } = await getSupabase()
        .from('portfolios')
        .select('*, portfolio_tasks(id, task, order_index), portfolio_tags(tag, order_index)')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? shapePortfolio(data) : null;
};
