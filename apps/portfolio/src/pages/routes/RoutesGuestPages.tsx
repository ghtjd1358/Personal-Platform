/**
 * RoutesGuestPages - KOMCA 패턴
 * 비로그인 사용자용 라우트
 * Host에서 /portfolio/* 경로로 매핑됨
 */

import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PREFIX } from '@/config/constants';

const HomePage = lazy(() => import('../home/HomePage'));
const ProjectDetail = lazy(() => import('../project/ProjectDetail'));

/**
 * Standalone(remote3 단독) 라우트 — 공개 포트폴리오 뷰.
 * 편집/관리/로그인 흐름은 host 모드 전용 → standalone 에서 login 라우트 제거.
 */
function RoutesGuestPages() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            {PREFIX && <Route path={PREFIX} element={<HomePage />} />}
            <Route path={`${PREFIX}/project/:slug`} element={<ProjectDetail />} />
            <Route path="*" element={<HomePage />} />
        </Routes>
    );
}

export { RoutesGuestPages };
