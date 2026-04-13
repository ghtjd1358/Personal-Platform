/**
 * RoutesGuestPages - KOMCA 패턴
 * 비로그인 사용자용 라우트
 * Host에서 /portfolio/* 경로로 매핑됨
 */

import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '@sonhoseong/mfa-lib';
import { PREFIX } from '@/config/constants';

const HomePage = lazy(() => import('../home/HomePage'));
const ProjectDetail = lazy(() => import('../project/ProjectDetail'));

function RoutesGuestPages() {
    return (
        <Routes>
            {/* 메인 */}
            <Route path="/" element={<HomePage />} />
            {PREFIX && <Route path={PREFIX} element={<HomePage />} />}

            {/* 프로젝트 상세 */}
            <Route path={`${PREFIX}/project/:slug`} element={<ProjectDetail />} />

            {/* 로그인 */}
            <Route
                path={`${PREFIX}/login`}
                element={<LoginPage appName="Portfolio" redirectPath={PREFIX || '/'} />}
            />

            <Route path="*" element={<HomePage />} />
        </Routes>
    );
}

export { RoutesGuestPages };
