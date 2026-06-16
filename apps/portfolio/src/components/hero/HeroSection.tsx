import React, { useEffect, useRef, useState } from 'react';
import '@/styles/editorial.css';

interface HeroSectionProps {
  userName?: string;
  totalViews?: number;
  totalProjects?: number;
  totalLikes?: number;
  daysRunning?: number;
  isLoading?: boolean;
}

const Grain: React.FC = () => (
  <svg className="editorial-grain" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
    <filter id="portfolio-hero-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#portfolio-hero-grain)" />
  </svg>
);

const Fiber: React.FC = () => (
  <svg className="editorial-fiber" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
    <filter id="portfolio-hero-fiber">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.85" numOctaves="2" seed="23" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.12  0 0 0 0.4 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#portfolio-hero-fiber)" />
  </svg>
);

/** 0 → target cubic ease-out count-up. */
const useCountUp = (target: number, duration = 900, active = true): number => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!active || target === 0) { setValue(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setValue(target);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, active]);
  return value;
};

const StatValue: React.FC<{ target: number; isLoading?: boolean }> = ({ target, isLoading }) => {
  const v = useCountUp(target, 900, !isLoading);
  if (isLoading) {
    return (
      <span className="editorial-stat-value editorial-stat-value--loading" aria-label="불러오는 중">
        <span className="editorial-stat-dot" />
        <span className="editorial-stat-dot" />
        <span className="editorial-stat-dot" />
      </span>
    );
  }
  return <span className="editorial-stat-value">{v.toLocaleString()}</span>;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  userName,
  totalViews = 0,
  totalProjects = 0,
  totalLikes = 0,
  daysRunning = 0,
  isLoading = false,
}) => {
  return (
    <section className="editorial-hero editorial-hero--fullheight">
      <Grain />
      <Fiber />
      <div className="editorial-inner">
        <div className="editorial-head">
          {userName && (
            <span className="editorial-welcome">Welcome · {userName}</span>
          )}
          <span className="editorial-eyebrow">WORKS // 2026 — SELECTED</span>
          <h1 className="editorial-title">
            부족하지만<br />
            완성해온<br />
            <em>결과물입니다.</em>
          </h1>
          <p className="editorial-sub">
            아이디어를 현실로 만드는 과정의 집합 — 카드, 모달, 스크롤 인터랙션.
          </p>
        </div>
        <div className="editorial-side">
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">COLLECTION</span>
            <span className="editorial-meta-value">SELECTED</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">YEARS</span>
            <span className="editorial-meta-value">2023–2026</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">MEDIA</span>
            <span className="editorial-meta-value">WEB</span>
          </div>
        </div>
      </div>

      {/* hero 하단 정량 지표 — blog/HeroSection 와 동일 dialect. 4 remote 통일. */}
      <div className="editorial-extras">
        <div className="editorial-stats">
          <div className="editorial-stat">
            <StatValue target={totalViews} isLoading={isLoading} />
            <span className="editorial-stat-label">총 방문</span>
          </div>
          <div className="editorial-stat">
            <StatValue target={totalProjects} isLoading={isLoading} />
            <span className="editorial-stat-label">프로젝트</span>
          </div>
          <div className="editorial-stat">
            <StatValue target={totalLikes} isLoading={isLoading} />
            <span className="editorial-stat-label">좋아요</span>
          </div>
          <div className="editorial-stat">
            <StatValue target={daysRunning} isLoading={isLoading} />
            <span className="editorial-stat-label">일째 운영</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
