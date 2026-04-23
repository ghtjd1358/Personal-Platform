/**
 * RoutesAuthPages - 로그인 사용자용 라우트
 */
import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RemoteErrorBoundary, REMOTE_LINK_PREFIX } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import Dashboard from '../Dashboard';
import MyPage from '../MyPage';


// Remote App lazy imports with fallback
const ResumeApp = React.lazy(() =>
  import('@resume/App').catch(() => ({
    default: () => null // 로드 실패 시 빈 컴포넌트
  }))
);

const BlogApp = React.lazy(() =>
  import('@blog/App').catch(() => ({
    default: () => null
  }))
);

const PortfolioApp = React.lazy(() =>
  import('@portfolio/App').catch(() => ({
    default: () => null
  }))
);

const JobTrackerApp = React.lazy(() =>
  import('@jobtracker/App').catch(() => ({
    default: () => null
  }))
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

      {/* 마이페이지 (Host-level 통합 — 4 remote 도메인을 하나의 editorial 대시보드로) */}
      <Route
        path="/container/user/:userId"
        element={
          <RemoteErrorBoundary remoteName="마이페이지">
            <MyPage />
          </RemoteErrorBoundary>
        }
      />

      <Route path={RoutePath.Login} element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route path="*" element={<Navigate to={RoutePath.Dashboard} replace/>} />
    </Routes>
  );
}

export { RoutesAuthPages };
