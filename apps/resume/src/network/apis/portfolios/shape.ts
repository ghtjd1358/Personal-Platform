import type { PortfolioWithDetails, NestedPortfolioRow } from './types';

/** portfolios nested row → PortfolioWithDetails 평탄화 */
export const shapePortfolio = (row: NestedPortfolioRow): PortfolioWithDetails => {
    const { portfolio_tasks, portfolio_tags, ...rest } = row;
    return {
        ...(rest as Omit<PortfolioWithDetails, 'tasks' | 'tags'>),
        tasks: (portfolio_tasks || [])
            .slice()
            .sort((a, b) => a.order_index - b.order_index)
            .map((t) => ({ id: t.id, task: t.task })),
        tags: (portfolio_tags || [])
            .slice()
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((t) => t.tag),
    };
};
