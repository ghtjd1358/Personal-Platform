/**
 * RoutesAuthPages - 로그인 사용자용 라우트
 */
import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { trackPromise } from 'react-promise-tracker';
import { RemoteErrorBoundary, REMOTE_LINK_PREFIX, selectUser } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import Dashboard from '../Dashboard';
import MyPage from '../MyPage';

// LNB → remote 진입 시 chunk download 동안 GlobalLoading 띄우기 위한 GLOBAL area.
// lib `useShowGlobalLoading` 와 동일 area 라 같은 GlobalLoading 인스턴스가 자동 표시.
const LOADING_AREA = 'GLOBAL';

/**
 * MyPageGuard — admin 은 MyPage 접근 불가 (운영 원칙).
 * admin 은 /admin/* 경로로 직접 CRUD 하므로 MyPage 중계가 불필요.
 * MyPage 는 일반 user 전용 대시보드.
 */
const MyPageGuard: React.FC = () => {
  const user = useSelector(selectUser);
  if (user?.role === 'admin') {
    return <Navigate to={RoutePath.Dashboard} replace />;
  }
  return <MyPage />;
};


// Remote App lazy imports — chunk download 를 trackPromise 로 감싸 GlobalLoading 표시.
// 실패 시 빈 컴포넌트로 graceful fallback (네트워크/배포 이슈로 remoteEntry.js 로드 실패 케이스).
const ResumeApp = React.lazy(() =>
  trackPromise(import('@resume/App').catch(() => ({ default: () => null })), LOADING_AREA)
);

const BlogApp = React.lazy(() =>
  trackPromise(import('@blog/App').catch(() => ({ default: () => null })), LOADING_AREA)
);

const PortfolioApp = React.lazy(() =>
  trackPromise(import('@portfolio/App').catch(() => ({ default: () => null })), LOADING_AREA)
);

const JobTrackerApp = React.lazy(() =>
  trackPromise(import('@jobtracker/App').catch(() => ({ default: () => null })), LOADING_AREA)
);

// Remote URL prefix — lib 의 단일 소스에서 가져옴 (remote 의 LINK_PREFIX 와 동기화 보장)
const resumePathPrefix = REMOTE_LINK_PREFIX.resume;
const blogPathPrefix = REMOTE_LINK_PREFIX.blog;
const portfolioPathPrefix = REMOTE_LINK_PREFIX.portfolio;
const jobtrackerPathPrefix = REMOTE_LINK_PREFIX.jobtracker;

// ============================================
// 컴포넌트
// ============================================

function RoutesAuthPages() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route path={RoutePath.Dashboard} element={<Dashboard />} />

      {/* Resume Remote App */}
      <Route
        path={`${resumePathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="이력서">
            <Suspense fallback="">
              <ResumeApp />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* Blog Remote App */}
      <Route
        path={`${blogPathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="블로그">
            <Suspense fallback="">
              <BlogApp />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* Portfolio Remote App */}
      <Route
        path={`${portfolioPathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="포트폴리오">
            <Suspense fallback="">
              <PortfolioApp />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* JobTracker Remote App */}
      <Route
        path={`${jobtrackerPathPrefix}/*`}
        element={
          <RemoteErrorBoundary remoteName="취업관리">
            <Suspense fallback="">
              <JobTrackerApp />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* 마이페이지 (Host-level 통합 — 4 remote 도메인을 하나의 editorial 대시보드로).
          admin 은 MyPageGuard 에서 Dashboard 로 redirect (admin 은 /admin/* 로 직접 관리). */}
      <Route
        path="/container/user/:userId"
        element={
          <RemoteErrorBoundary remoteName="마이페이지">
            <MyPageGuard />
          </RemoteErrorBoundary>
        }
      />

      <Route path={RoutePath.Login} element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route path="*" element={<Navigate to={RoutePath.Dashboard} replace/>} />
    </Routes>
  );
}

export { RoutesAuthPages };
