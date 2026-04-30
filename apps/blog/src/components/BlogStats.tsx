import React, { useEffect, useRef, useState } from 'react';
import './BlogStats.editorial.css';

interface BlogStatsProps {
  totalViews: number;
  totalPosts: number;
  totalLikes: number;
  daysRunning: number;
  /** 데이터 fetch 중이면 0 대신 3-dot pulse 표시 (count-up 깜빡임/0 정체 UX 해결) */
  isLoading?: boolean;
}

/**
 * target 값까지 0 부터 부드럽게 count-up (cubic ease-out).
 * fetch 완료 직후 자연스러운 "올라가는" 숫자 애니.
 */
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
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
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

/* loading 중엔 3-dot ink pulse, 아니면 count-up.
   Hero/Admin bar 와 다르게 stats 는 정량 정보라 0 정체가 더 어색 → 명시적 loading 신호 필요. */
const StatValue: React.FC<{ target: number; isLoading?: boolean }> = ({ target, isLoading }) => {
  const v = useCountUp(target, 900, !isLoading);
  if (isLoading) {
    return (
      <span className="blog-stat-value blog-stat-loading" aria-label="불러오는 중">
        <span className="blog-stat-dot" />
        <span className="blog-stat-dot" />
        <span className="blog-stat-dot" />
      </span>
    );
  }
  return <span className="blog-stat-value">{v.toLocaleString()}</span>;
};

const BlogStats: React.FC<BlogStatsProps> = ({
  totalViews,
  totalPosts,
  totalLikes,
  daysRunning,
  isLoading = false,
}) => {
  return (
    <section className="blog-stats-section">
      <div className="container">
        <div className="blog-stats">
          <div className="blog-stat">
            <StatValue target={totalViews} isLoading={isLoading} />
            <span className="blog-stat-label">총 방문</span>
          </div>
          <div className="blog-stat">
            <StatValue target={totalPosts} isLoading={isLoading} />
            <span className="blog-stat-label">포스트</span>
          </div>
          <div className="blog-stat">
            <StatValue target={totalLikes} isLoading={isLoading} />
            <span className="blog-stat-label">좋아요</span>
          </div>
          <div className="blog-stat">
            <StatValue target={daysRunning} isLoading={isLoading} />
            <span className="blog-stat-label">일째 운영</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BlogStats };
