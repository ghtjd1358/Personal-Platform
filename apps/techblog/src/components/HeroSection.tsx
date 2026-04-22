import React from 'react';
import '@/styles/editorial.css';

const Grain: React.FC = () => (
  <svg className="editorial-grain" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
    <filter id="techblog-hero-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#techblog-hero-grain)" />
  </svg>
);

const Fiber: React.FC = () => (
  <svg className="editorial-fiber" xmlns="http://www.w3.org/2000/svg" aria-hidden focusable="false">
    <filter id="techblog-hero-fiber">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.85" numOctaves="2" seed="37" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.12  0 0 0 0.4 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#techblog-hero-fiber)" />
  </svg>
);

const HeroSection: React.FC = () => {
  return (
    <section className="editorial-hero editorial-hero--fullheight">
      <Grain />
      <Fiber />
      <div className="editorial-inner">
        <div className="editorial-head">
          <span className="editorial-eyebrow">TRACKER // 2026 — LEDGER</span>
          <h1 className="editorial-title">
            지원과 일정을,<br />
            <em>한 권에.</em>
          </h1>
          <p className="editorial-sub">
            지원 현황, 인터뷰 일정, 기술 노트를 한 곳에 정리합니다.
          </p>
        </div>
        <div className="editorial-side">
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">LEDGER</span>
            <span className="editorial-meta-value">LIVE</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">FOCUS</span>
            <span className="editorial-meta-value">CAREER</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">NOTES</span>
            <span className="editorial-meta-value">TECH · LOG</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HeroSection };
