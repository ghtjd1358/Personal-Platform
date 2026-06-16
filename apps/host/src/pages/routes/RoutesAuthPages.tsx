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
import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import { RemoteErrorBoundary, REMOTE_LINK_PREFIX } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import MyPageGuard from './MyPageGuard';

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

function RoutesAuthPages() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route path={RoutePath.Dashboard} element={<Suspense fallback=""><Dashboard /></Suspense>} />

      <Route
        path={`${resumePathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="이력서">
            <Suspense fallback=""><ResumeApp /></Suspense>
          </RemoteErrorBoundary>
        }
      />
      <Route
        path={`${blogPathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="블로그">
            <Suspense fallback=""><BlogApp /></Suspense>
          </RemoteErrorBoundary>
        }
      />
      <Route
        path={`${portfolioPathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="포트폴리오">
            <Suspense fallback=""><PortfolioApp /></Suspense>
          </RemoteErrorBoundary>
        }
      />
      <Route
        path={`${jobtrackerPathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="취업관리">
            <Suspense fallback=""><JobTrackerApp /></Suspense>
          </RemoteErrorBoundary>
        }
      />

      <Route path="/container/user/:userId" element={<MyPageGuard />} />
      <Route path={RoutePath.Login} element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route path="*" element={<Navigate to={RoutePath.Dashboard} replace />} />
    </Routes>
  );
}

export { RoutesAuthPages };
