import React from 'react';
import '@/styles/editorial.css';

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

const HeroSection: React.FC = () => {
  return (
    <section className="editorial-hero">
      <Grain />
      <Fiber />
      <div className="editorial-inner">
        <div className="editorial-head">
          <span className="editorial-eyebrow">JOURNAL // VOL.01 // 2026</span>
          <h1 className="editorial-title">
            읽고, 쓰고,<br />
            <em>남깁니다.</em>
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
    </section>
  );
};

export { HeroSection };
