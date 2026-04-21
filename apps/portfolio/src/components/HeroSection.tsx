import React from 'react';
import '@/styles/editorial.css';

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

const HeroSection: React.FC = () => {
  return (
    <section className="editorial-hero">
      <Grain />
      <Fiber />
      <div className="editorial-inner">
        <div className="editorial-head">
          <span className="editorial-eyebrow">WORKS // 2026 — SELECTED</span>
          <h1 className="editorial-title">
            Selected,<br />
            <em>Shown.</em>
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
    </section>
  );
};

export { HeroSection };
