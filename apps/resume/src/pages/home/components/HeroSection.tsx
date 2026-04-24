import React, { useState } from 'react';
import { useToast } from '@sonhoseong/mfa-lib';
import { downloadResume } from '../../../network/apis/resume';
import '../../../styles/editorial.css';

/**
 * HeroSection — 랜딩 첫인상. Supabase 의존 0.
 *
 * 과거에는 `resumeProfile` prop 으로 summary 를 API 에서 주입했는데,
 *  (1) 로딩 지연으로 FOUC 발생,
 *  (2) summary 텍스트는 거의 변하지 않는 정적 자기소개라서
 * 하드코딩으로 전환. 수정은 이 파일에서 직접.
 *
 * 추가: grain/fiber/contact-icon SVG 는 CSS 도착 전 브라우저 기본값(300×150) 로 렌더돼
 * 첫 paint 에서 layout shift 발생. 각 SVG 에 `width`/`height` 속성을 직접 부여해서
 * CSS 없이도 정확한 크기로 렌더되게 보정.
 */

interface HeroSectionProps {
  userName?: string;
}

const Grain: React.FC = () => (
  <svg
    className="editorial-grain"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
  >
    <filter id="resume-hero-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#resume-hero-grain)" />
  </svg>
);

// 한지 섬유 overlay — 가로 방향 긴 fiber (baseFrequency X<<Y 비대칭)
const Fiber: React.FC = () => (
  <svg
    className="editorial-fiber"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
  >
    <filter id="resume-hero-fiber">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.85" numOctaves="2" seed="3" stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.22  0 0 0 0 0.17  0 0 0 0 0.12  0 0 0 0.4 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#resume-hero-fiber)" />
  </svg>
);


const MailIcon: React.FC = () => (
  <svg className="editorial-contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const GithubIcon: React.FC = () => (
  <svg className="editorial-contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const VelogIcon: React.FC = () => (
  <svg className="editorial-contact-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 0C1.338 0 0 1.338 0 3v18c0 1.662 1.338 3 3 3h18c1.662 0 3-1.338 3-3V3c0-1.662-1.338-3-3-3H3Zm6.883 6.25c.63 0 1.005.3 1.125.9l1.463 8.303c.465-.615.846-1.133 1.146-1.553.465-.66.893-1.418 1.283-2.273.405-.855.608-1.62.608-2.295 0-.405-.113-.727-.338-.967-.21-.255-.608-.577-1.193-.967.6-.765 1.35-1.148 2.25-1.148.48 0 .878.143 1.193.428.33.285.494.704.494 1.26 0 .93-.39 2.093-1.17 3.488-.765 1.38-2.241 3.457-4.431 6.232l-2.227.156-1.711-9.628h-2.25V7.24c.6-.195 1.305-.406 2.115-.63.81-.24 1.358-.36 1.643-.36Z" />
  </svg>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ userName }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const toast = useToast();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadResume({ fileName: 'resume.pdf' });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('다운로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="hero" className="editorial-hero">
      <Grain />
      <Fiber />
      <div className="editorial-inner">
        <div className="editorial-head">
          {userName && (
            <span className="editorial-welcome">Welcome · {userName}</span>
          )}
          <span className="editorial-eyebrow">RÉSUMÉ // 2026 · 손호성</span>
          <h1 className="editorial-title">
            안녕하세요,<br />
            프론트엔드 개발자<br />
            {/* em(italic)→upright 전환 시 기울기로 인한 시각 충돌 방지용 여백 */}
            <em style={{ marginRight: '0.18em' }}>손호성</em>입니다.
          </h1>
          <p className="editorial-sub">
            React와 TypeScript를 기반으로 개발합니다.<br />
            복잡한 시스템을 분해하고 조립하는 작업을 좋아합니다.
          </p>
        </div>
        <div className="editorial-side">
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">YEARS</span>
            <span className="editorial-meta-value">2+</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">STACK</span>
            <span className="editorial-meta-value">REACT · TS</span>
          </div>
          <div className="editorial-meta-row">
            <span className="editorial-meta-label">BASE</span>
            <span className="editorial-meta-value">SEOUL · KR</span>
          </div>
        </div>
      </div>

      <div className="editorial-extras">
        <div className="editorial-contacts">
          <a
            href="mailto:hoseong1358@gmail.com"
            className="editorial-contact"
            title="이메일 보내기"
          >
            <MailIcon />
            <span className="editorial-contact-label">Email</span>
          </a>
          <a
            href="https://github.com/ghtjd1358"
            className="editorial-contact"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
          >
            <GithubIcon />
            <span className="editorial-contact-label">GitHub</span>
          </a>
          <a
            href="https://velog.io/@ghtjd1358/series"
            className="editorial-contact"
            target="_blank"
            rel="noreferrer"
            title="Velog"
          >
            <VelogIcon />
            <span className="editorial-contact-label">Velog</span>
          </a>
        </div>

        <div className="editorial-cta-row">
          <button
            onClick={handleDownload}
            className="editorial-btn"
            disabled={isDownloading}
          >
            {isDownloading ? '다운로드 중...' : '이력서 다운로드'}
            <span className="editorial-btn-icon" aria-hidden>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};
