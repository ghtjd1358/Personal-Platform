/**
 * Portfolios 도메인 타입 (= resume side 의 projects).
 * portfolios + portfolio_tasks + portfolio_tags 를 UI shape 로 합친 PortfolioWithDetails.
 */

export interface PortfolioWithDetails {
    id: string;
    user_id: string;
    resume_id: string | null;
    title: string;
    role: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    image_url?: string | null;
    order_index: number;
    tasks: { id: string; task: string }[];
    tags: string[];
}

export type NestedPortfolioRow = {
    id: string;
    portfolio_tasks?: { id: string; task: string; order_index: number }[];
    portfolio_tags?: { tag: string; order_index?: number }[];
    [key: string]: unknown;
};
