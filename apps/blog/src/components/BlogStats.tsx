import React, { useEffect, useRef, useState } from 'react';
import './BlogStats.editorial.css';

interface BlogStatsProps {
  totalViews: number;
  totalPosts: number;
  totalLikes: number;
  daysRunning: number;
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

/* 스켈레톤 dots 제거 — 숫자는 항상 0 에서 count-up, 데이터 도착하면 자연스럽게 올라감.
   Hero/Admin bar 와 같은 "껍데기" 영역에 skeleton 이 뜨는 게 어색하다는 피드백 반영. */
const StatValue: React.FC<{ target: number }> = ({ target }) => {
  const v = useCountUp(target, 900, true);
  return <span className="blog-stat-value">{v.toLocaleString()}</span>;
};

const BlogStats: React.FC<BlogStatsProps> = ({
  totalViews,
  totalPosts,
  totalLikes,
  daysRunning,
}) => {
  return (
    <section className="blog-stats-section">
      <div className="container">
        <div className="blog-stats">
          <div className="blog-stat">
            <StatValue target={totalViews} />
            <span className="blog-stat-label">총 방문</span>
          </div>
          <div className="blog-stat">
            <StatValue target={totalPosts} />
            <span className="blog-stat-label">포스트</span>
          </div>
          <div className="blog-stat">
            <StatValue target={totalLikes} />
            <span className="blog-stat-label">좋아요</span>
          </div>
          <div className="blog-stat">
            <StatValue target={daysRunning} />
            <span className="blog-stat-label">일째 운영</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BlogStats };
