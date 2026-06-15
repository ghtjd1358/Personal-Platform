import React from 'react';
import { getCurrentUser } from '@sonhoseong/mfa-lib';
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
  const userName = getCurrentUser()?.name;
  return (
    <section className="editorial-hero editorial-hero--fullheight">
      <Grain />
      <Fiber />
      <div className="editorial-inner">
        <div className="editorial-head">
          {userName && (
            <span className="editorial-welcome">Welcome · {userName}</span>
          )}
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
      <div className="techblog-hero-notice">
        <span className="techblog-hero-notice__eyebrow">SECTION · UNDER CONSTRUCTION</span>
        <h2 className="techblog-hero-notice__title">준비 중입니다…</h2>
        <p className="techblog-hero-notice__sub">
          취업관리 섹션은 지금 설계를 다듬는 중입니다.<br />
          대시보드 · 이력서 · 포트폴리오 · 마이페이지를 먼저 완성한 뒤 이어서 작업할 예정입니다.
        </p>
      </div>
    </section>
  );
};

export { HeroSection };
