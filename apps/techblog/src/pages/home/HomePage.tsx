/**
 * HomePage (techblog) — 개발 보류 중.
 *
 * 이 remote 는 향후 재개 예정. 현재는 준비중 안내 배너만 표시.
 * 기존 복잡한 dashboard stats / upcoming events / recent applications UI 는
 * 데이터 구조가 확정될 때까지 잠시 치워두고, 사이트 다른 페이지(대시보드 · 이력서 · 포트폴리오 · 마이페이지) 에 집중.
 */
import React from 'react';
import { HeroSection } from '@/components';
import './HomePage.editorial.css';

const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <section
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#8B7355',
          }}
        >
          SECTION · UNDER CONSTRUCTION
        </span>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(28px, 4vw, 44px)',
            color: '#2B1E14',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          준비 중입니다
        </h2>
        <p
          style={{
            fontFamily: 'Pretendard, sans-serif',
            fontSize: '15px',
            color: '#8B7355',
            maxWidth: '520px',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          취업관리 섹션은 지금 설계를 다듬는 중입니다.
          <br />
          대시보드 · 이력서 · 포트폴리오 · 마이페이지를 먼저 완성한 뒤 이어서 작업할 예정입니다.
        </p>
      </section>
    </>
  );
};

export default HomePage;
