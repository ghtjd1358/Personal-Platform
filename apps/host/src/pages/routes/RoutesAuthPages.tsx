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

// Remote pathPrefix (안전한 로딩) - /container prefix 포함
let resumePathPrefix = '/container/resume'; // 기본값
let blogPathPrefix = '/container/blog'; // 기본값
let portfolioPathPrefix = '/container/portfolio'; // 기본값
let jobtrackerPathPrefix = '/container/jobtracker'; // 기본값

// top-level await로 pathPrefix 로드 (실패 시 기본값 사용)
try {
  // @ts-ignore
  const resumeLnb = await import('@resume/LnbItems');
  resumePathPrefix = resumeLnb.pathPrefix || resumePathPrefix;
} catch (e) {
  console.warn('[MFA] Resume LnbItems 로드 실패, 기본값 사용:', resumePathPrefix);
}

try {
  // @ts-ignore
  const blogLnb = await import('@blog/LnbItems');
  blogPathPrefix = blogLnb.pathPrefix || blogPathPrefix;
} catch (e) {
  console.warn('[MFA] Blog LnbItems 로드 실패, 기본값 사용:', blogPathPrefix);
}

try {
  // @ts-ignore
  const portfolioLnb = await import('@portfolio/LnbItems');
  portfolioPathPrefix = portfolioLnb.pathPrefix || portfolioPathPrefix;
} catch (e) {
  console.warn('[MFA] Portfolio LnbItems 로드 실패, 기본값 사용:', portfolioPathPrefix);
}

try {
  // @ts-ignore
  const jobtrackerLnb = await import('@jobtracker/LnbItems');
  jobtrackerPathPrefix = jobtrackerLnb.pathPrefix || jobtrackerPathPrefix;
} catch (e) {
  console.warn('[MFA] JobTracker LnbItems 로드 실패, 기본값 사용:', jobtrackerPathPrefix);
}

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
