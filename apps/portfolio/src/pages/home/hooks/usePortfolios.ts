import { useState, useEffect } from 'react';
import { getPortfolios, PortfolioSummary } from '../../../network';
import { PortfolioSearchCondition } from '../../../network/apis/portfolio/types';

type UsePortfoliosReturn = {
  portfolios: PortfolioSummary[];
  featuredProjects: PortfolioSummary[];
  otherProjects: PortfolioSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const usePortfolios = (params?: PortfolioSearchCondition): UsePortfoliosReturn => {
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPortfolios(params);
      if (res.success && res.data) {
        setPortfolios(res.data.data);
      } else {
        setError(res.error || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (e) {
      setError('포트폴리오를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, [params?.search, params?.categoryId, params?.status, params?.isFeatured]);

  const featuredProjects = portfolios.filter(p => p.is_featured);
  const otherProjects = portfolios.filter(p => !p.is_featured);

  return {
    portfolios,
    featuredProjects,
    otherProjects,
    loading,
    error,
    refetch: fetchPortfolios,
  };
};
