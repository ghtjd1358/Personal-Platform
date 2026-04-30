import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { PortfolioSummary } from '@/network';
import './PortfolioStats.editorial.css';

interface PortfolioStatsProps {
  portfolios: PortfolioSummary[];
  isLoading?: boolean;
}

/** target 까지 0 → cubic ease-out count-up. blog/BlogStats 동일 패턴. */
const useCountUp = (target: number, duration = 900, active = true): number => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, active]);

  return value;
};

const StatValue: React.FC<{ target: number; isLoading?: boolean }> = ({ target, isLoading }) => {
  const v = useCountUp(target, 900, !isLoading);
  if (isLoading) {
    return (
      <span className="portfolio-stat-value portfolio-stat-loading" aria-label="불러오는 중">
        <span className="portfolio-stat-dot" />
        <span className="portfolio-stat-dot" />
        <span className="portfolio-stat-dot" />
      </span>
    );
  }
  return <span className="portfolio-stat-value">{v.toLocaleString()}</span>;
};

const PortfolioStats: React.FC<PortfolioStatsProps> = ({ portfolios, isLoading = false }) => {
  // 4 metric — blog 와 같은 layout: 총 방문 / 프로젝트 / 좋아요 / 일째 운영
  const stats = useMemo(() => {
    const totalViews = portfolios.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const totalProjects = portfolios.length;
    const totalLikes = portfolios.reduce((sum, p) => sum + (p.like_count || 0), 0);
    // 가장 오래된 created_at 기준 운영 일수 — 데이터 없으면 0
    let daysRunning = 0;
    if (portfolios.length > 0) {
      const earliest = portfolios.reduce<number>((min, p) => {
        const t = p.created_at ? new Date(p.created_at).getTime() : Number.POSITIVE_INFINITY;
        return Math.min(min, t);
      }, Number.POSITIVE_INFINITY);
      if (Number.isFinite(earliest)) {
        daysRunning = Math.max(1, Math.floor((Date.now() - earliest) / (1000 * 60 * 60 * 24)));
      }
    }
    return { totalViews, totalProjects, totalLikes, daysRunning };
  }, [portfolios]);

  return (
    <section className="portfolio-stats-section">
      <div className="container">
        <div className="portfolio-stats">
          <div className="portfolio-stat">
            <StatValue target={stats.totalViews} isLoading={isLoading} />
            <span className="portfolio-stat-label">총 방문</span>
          </div>
          <div className="portfolio-stat">
            <StatValue target={stats.totalProjects} isLoading={isLoading} />
            <span className="portfolio-stat-label">프로젝트</span>
          </div>
          <div className="portfolio-stat">
            <StatValue target={stats.totalLikes} isLoading={isLoading} />
            <span className="portfolio-stat-label">좋아요</span>
          </div>
          <div className="portfolio-stat">
            <StatValue target={stats.daysRunning} isLoading={isLoading} />
            <span className="portfolio-stat-label">일째 운영</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PortfolioStats };
