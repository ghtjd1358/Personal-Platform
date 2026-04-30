import React, { useEffect, useRef, useState } from 'react';
import '@/styles/editorial.css';

interface HeroSectionProps {
  userName?: string;
  totalViews?: number;
  totalPosts?: number;
  totalLikes?: number;
  daysRunning?: number;
  isLoading?: boolean;
}

const Grain: React.FC = () => (
  <svg className="editorial-grain" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
    <filter id="blog-hero-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#blog-hero-grain)" />
  </svg>
);

const Fiber: React.FC = () => (
  <svg className="editorial-fiber" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
    <filter id="blog-hero-fiber">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.85" numOctaves="2" seed="11" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.12  0 0 0 0.4 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#blog-hero-fiber)" />
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
  totalPosts = 0,
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
          <span className="editorial-eyebrow">JOURNAL // VOL.01 // 2026</span>
          <h1 className="editorial-title">
            배움과<br />
            고민의 과정을<br />
            <em>차곡차곡 기록합니다.</em>
          </h1>
          <p className="editorial-sub">
            프론트엔드 개발 경험과 학습 내용을 기록합니다.
          </p>
        </div>
        <div className="editorial-side">
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">ISSUE</span>
            <span className="editorial-meta-value">VOL.01</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">SECTION</span>
            <span className="editorial-meta-value">JOURNAL</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">KIND</span>
            <span className="editorial-meta-value">LONG-FORM</span>
          </div>
        </div>
      </div>

      {/* hero 하단 정량 지표 — 이력서 editorial-contacts 와 동일 가로 그리드 톤. 4 remote 통일. */}
      <div className="editorial-extras">
        <div className="editorial-stats">
          <div className="editorial-stat">
            <StatValue target={totalViews} isLoading={isLoading} />
            <span className="editorial-stat-label">총 방문</span>
          </div>
          <div className="editorial-stat">
            <StatValue target={totalPosts} isLoading={isLoading} />
            <span className="editorial-stat-label">포스트</span>
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
