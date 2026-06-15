import { useEffect, useState } from 'react';
import { getPortfolioById } from '@/network/apis/portfolio/get-portfolio-detail';
import { PortfolioSummary } from '@/network/apis/portfolio/types';

interface UsePortfolioModalReturn {
  portfolio: PortfolioSummary | null;
  isLoading: boolean;
}

/**
 * PortfolioModal data fetching hook.
 *
 * - portfolioId 변경 시 detail 재fetch.
 * - portfolioId === null 이면 idle 상태 (loading=false, portfolio=null).
 * - UI(PortfolioModal) 는 portfolio/isLoading props 만 받아 렌더링에 집중.
 */
export function usePortfolioModal(portfolioId: string | null): UsePortfolioModalReturn {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!portfolioId) {
      setPortfolio(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    getPortfolioById(portfolioId)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) setPortfolio(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load portfolio:', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [portfolioId]);

  return { portfolio, isLoading };
}
