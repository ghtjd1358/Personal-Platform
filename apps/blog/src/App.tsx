import React, { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken, storage } from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from '@/pages/routes';
import { UserFloatingMenu } from '@/components/UserFloatingMenu';
import './styles/global.css';

function App() {
    const accessToken = useSelector(selectAccessToken);
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

    // Suspense fallback 을 null 로 둠 — 페이지 로딩은 host FarmerLoading(전역 오버레이)이 담당.
    // 구 PageLoadingFallback(스켈레톤 hero/stats/cards) 제거: editorial 오버레이와 중복되고
    // 시각 언어가 달라 사용자에게 로딩이 "여러 개" 처럼 보였던 원인.
    return (
        <>
            <Suspense fallback={null}>
                {!isAuthenticated && <RoutesGuestPages/>}
                {isAuthenticated && <RoutesAuthPages />}
            </Suspense>
            {!storage.isHostApp() && <UserFloatingMenu />}
        </>
    );
}

export default App;
