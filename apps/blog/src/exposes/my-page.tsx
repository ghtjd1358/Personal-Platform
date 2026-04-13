import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/loading';
import '@/styles/global.css';

const MyPage = lazy(() => import('@/pages/mypage/MyPage'));

// Host에서 직접 사용할 수 있는 MyPage 컴포넌트
const MyPageExposed: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner className="mypage-loading-full" />}>
      <MyPage />
    </Suspense>
  );
};

export default MyPageExposed;
