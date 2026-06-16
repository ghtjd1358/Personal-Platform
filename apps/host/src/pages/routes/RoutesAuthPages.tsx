/**
 * RoutesAuthPages — 로그인된 사용자용 라우트
 *
 * 앱 라우팅 구조:
 * /                       → /container/dashboard 로 이동
 * /container/dashboard    → 대시보드
 * /container/resume/*     → 이력서 리모트 앱 (port 5001)
 * /container/blog/*       → 블로그 리모트 앱 (port 5002)
 * /container/portfolio/*  → 포트폴리오 리모트 앱 (port 5003)
 * /container/jobtracker/* → 기술블로그/취업관리 리모트 앱 (port 5004)
 * /container/user/:userId → 마이페이지 (admin은 접근 불가)
 * /login                  → 이미 로그인 상태이므로 대시보드로 이동
 */
import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { RemoteErrorBoundary, REMOTE_LINK_PREFIX, DeferredComponent } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import MyPageGuard from './MyPageGuard';
import { PageSkeleton, DashboardSkeleton } from '../../components/skeleton';

// chunk download 동안 GlobalLoading을 띄우기 위해 trackPromise로 감쌈
const LOADING_AREA = 'GLOBAL';

const Dashboard = lazy(() => import('../Dashboard'));

const ResumeApp = lazy(() =>
  trackPromise(import('@resume/App').catch(() => ({ default: () => null })), LOADING_AREA)
);
const BlogApp = lazy(() =>
  trackPromise(import('@blog/App').catch(() => ({ default: () => null })), LOADING_AREA)
);
const PortfolioApp = lazy(() =>
  trackPromise(import('@portfolio/App').catch(() => ({ default: () => null })), LOADING_AREA)
);
const JobTrackerApp = lazy(() =>
  trackPromise(import('@jobtracker/App').catch(() => ({ default: () => null })), LOADING_AREA)
);

const resumePathPrefix = REMOTE_LINK_PREFIX.resume;
const blogPathPrefix = REMOTE_LINK_PREFIX.blog;
const portfolioPathPrefix = REMOTE_LINK_PREFIX.portfolio;
const jobtrackerPathPrefix = REMOTE_LINK_PREFIX.jobtracker;

const remoteRoutes: { path: string; name: string; App: React.ComponentType }[] = [
  { path: `${resumePathPrefix}/*`,    name: '이력서',   App: ResumeApp },
  { path: `${blogPathPrefix}/*`,      name: '블로그',   App: BlogApp },
  { path: `${portfolioPathPrefix}/*`, name: '포트폴리오', App: PortfolioApp },
  { path: `${jobtrackerPathPrefix}/*`,name: '취업관리', App: JobTrackerApp },
];

/**
 * Suspense fallback wrappers
 * - DeferredComponent 로 감싸면 빠른 chunk(<200ms) 는 skeleton 깜빡임 없이 통과
 * - 느린 chunk 만 skeleton 노출 → 사용자 체감 안정성 ↑
 */
const remoteFallback = (label: string) => (
  <DeferredComponent>
    <PageSkeleton label={`${label}을 불러오는 중입니다`} />
  </DeferredComponent>
);

const dashboardFallback = (
  <DeferredComponent>
    <DashboardSkeleton />
  </DeferredComponent>
);

function RoutesAuthPages() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route
        path={RoutePath.Dashboard}
        element={<Suspense fallback={dashboardFallback}><Dashboard /></Suspense>}
      />

      {remoteRoutes.map(({ path, name, App }) => (
        <Route key={path} path={path} element={
          <RemoteErrorBoundary remoteName={name}>
            <Suspense fallback={remoteFallback(name)}><App /></Suspense>
          </RemoteErrorBoundary>
        } />
      ))}

      <Route path="/container/user/:userId" element={<MyPageGuard />} />
      <Route path={RoutePath.Login} element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route path="*" element={<Navigate to={RoutePath.Dashboard} replace />} />
    </Routes>
  );
}

export { RoutesAuthPages };
