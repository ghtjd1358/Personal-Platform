/**
 * RoutesAuthPages - 로그인 사용자용 라우트
 * KOMCA 패턴: 동적 Remote 로딩 + Graceful Fallback
 */
import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RemoteErrorBoundary } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import Dashboard from '../Dashboard';

// ============================================
// 안전한 Remote 로딩 (Graceful Fallback)
// ============================================

/**
 * 안전하게 Remote 모듈 import
 * 실패 시 null 반환 (앱 크래시 방지)
 */
const safeImport = async <T,>(
  importFn: () => Promise<T>,
  remoteName: string
): Promise<T | null> => {
  try {
    return await importFn();
  } catch (error) {
    console.error(`[MFA] Failed to load ${remoteName}:`, error);
    return null;
  }
};

// Remote App lazy imports with fallback
// @ts-ignore
const ResumeApp = React.lazy(() =>
  // @ts-ignore
  import('@resume/App').catch(() => ({
    default: () => null // 로드 실패 시 빈 컴포넌트
  }))
);

// @ts-ignore
const BlogApp = React.lazy(() =>
  // @ts-ignore
  import('@blog/App').catch(() => ({
    default: () => null
  }))
);

// @ts-ignore
const PortfolioApp = React.lazy(() =>
  // @ts-ignore
  import('@portfolio/App').catch(() => ({
    default: () => null
  }))
);

// @ts-ignore
const JobTrackerApp = React.lazy(() =>
  // @ts-ignore
  import('@jobtracker/App').catch(() => ({
    default: () => null
  }))
);

// @ts-ignore - 마이페이지 (Host 레벨)
const MyPage = React.lazy(() =>
  // @ts-ignore
  import('@blog/MyPage').catch(() => ({
    default: () => null
  }))
);

// Remote pathPrefix - /container prefix 고정 (LnbItems 동적 로딩 제거)
// 이전엔 remote별 pathPrefix를 top-level await로 가져왔으나, Module Federation의
// shared scope 초기화 타이밍 이슈로 load 실패가 빈번. 기본값이 이미 정확하므로 고정.
const resumePathPrefix = '/container/resume';
const blogPathPrefix = '/container/blog';
const portfolioPathPrefix = '/container/portfolio';
const jobtrackerPathPrefix = '/container/jobtracker';

// ============================================
// 컴포넌트
// ============================================

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: 48 }}>
    <h1>404</h1>
    <p>페이지를 찾을 수 없습니다.</p>
  </div>
);

/** Remote 앱 로딩 중 표시 */
const RemoteLoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#6c757d',
    }}
  >
    로딩 중...
  </div>
);

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
            <Suspense fallback={<RemoteLoadingFallback />}>
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
            <Suspense fallback={<RemoteLoadingFallback />}>
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
            <Suspense fallback={<RemoteLoadingFallback />}>
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
            <Suspense fallback={<RemoteLoadingFallback />}>
              <JobTrackerApp />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      {/* 마이페이지 (Host 레벨 - /container/user/:userId) */}
      <Route
        path="/container/user/:userId"
        element={
          <RemoteErrorBoundary remoteName="마이페이지">
            <Suspense fallback={<RemoteLoadingFallback />}>
              <MyPage />
            </Suspense>
          </RemoteErrorBoundary>
        }
      />

      <Route path={RoutePath.Login} element={<Navigate to={RoutePath.Dashboard} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export { RoutesAuthPages };
