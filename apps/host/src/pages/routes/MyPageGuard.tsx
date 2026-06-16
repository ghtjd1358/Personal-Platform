import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, RemoteErrorBoundary, DeferredComponent } from '@sonhoseong/mfa-lib';
import { RoutePath } from './paths';
import { InlineLoader } from '../../components/skeleton';

const MyPage = lazy(() => import('../MyPage'));

// admin은 MyPage에 접근 불가 — admin은 /admin/* 경로로 직접 CRUD
const MyPageGuard: React.FC = () => {
  const user = useSelector(selectUser);

  if (user?.role === 'admin') {
    return <Navigate to={RoutePath.Dashboard} replace />;
  }

  return (
    <RemoteErrorBoundary remoteName="마이페이지">
      <Suspense
        fallback={
          <DeferredComponent>
            <InlineLoader label="마이페이지를 불러오는 중입니다" />
          </DeferredComponent>
        }
      >
        <MyPage />
      </Suspense>
    </RemoteErrorBoundary>
  );
};

export default MyPageGuard;
