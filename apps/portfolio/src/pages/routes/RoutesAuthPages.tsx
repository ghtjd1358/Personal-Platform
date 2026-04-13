/**
 * RoutesAuthPages - KOMCA 패턴
 * 로그인 사용자용 라우트
 * Host에서 /portfolio/* 경로로 매핑됨
 */

import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PREFIX } from '@/config/constants';

const HomePage = lazy(() => import('../home/HomePage'));
const ProjectDetail = lazy(() => import('../project/ProjectDetail'));
const MyPage = lazy(() => import('../mypage/MyPage'));
const PortfolioEditorPage = lazy(() => import('../mypage/PortfolioEditorPage'));

function RoutesAuthPages() {
    return (
        <Routes>
            {/* 메인 */}
            <Route path="/" element={<HomePage />} />
            {PREFIX && <Route path={PREFIX} element={<HomePage />} />}

            {/* 프로젝트 상세 */}
            <Route path={`${PREFIX}/project/:slug`} element={<ProjectDetail />} />

            {/* 마이페이지 - 포트폴리오 관리 */}
            <Route path={`${PREFIX}/mypage`} element={<MyPage />} />
            <Route path={`${PREFIX}/mypage/new`} element={<PortfolioEditorPage />} />
            <Route path={`${PREFIX}/mypage/edit/:id`} element={<PortfolioEditorPage />} />

            <Route path="*" element={<HomePage />} />
        </Routes>
    );
}

export { RoutesAuthPages };
