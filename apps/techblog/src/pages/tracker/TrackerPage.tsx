/**
 * TrackerPage (techblog) — 개발 보류 중.
 *
 * 칸반 보드 UI 는 데이터 모델 확정 이후 재개.
 * 현재는 HomePage 와 동일한 "준비 중" 안내 유지.
 */
import React from 'react';
import '../home/HomePage.editorial.css';
import './TrackerPage.editorial.css';

const TrackerPage: React.FC = () => {
  return (
    <section className="tracker-placeholder">
      <span className="tracker-placeholder-eyebrow">
        SECTION · UNDER CONSTRUCTION
      </span>
      <h2 className="tracker-placeholder-title">
        준비 중입니다
      </h2>
      <p className="tracker-placeholder-desc">
        취업 현황 칸반 보드는 지금 설계를 다듬는 중입니다.
        <br />
        대시보드 · 이력서 · 포트폴리오 · 마이페이지를 먼저 완성한 뒤 이어서 작업할 예정입니다.
      </p>
    </section>
  );
};

export default TrackerPage;
