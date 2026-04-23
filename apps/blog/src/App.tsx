import React, { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken, storage } from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from '@/pages/routes';
import { UserFloatingMenu } from '@/components/UserFloatingMenu';
import './styles/global.css';

function App() {
    const accessToken = useSelector(selectAccessToken);
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

    // Suspense fallback 빈값 — 로딩은 host FarmerLoading(전역 오버레이)이 담당.
    // 4 remote 공통 규약: fallback='' 유지 → 추후 editorial 컴포넌트 끼울 slot 보존.
    return (
        <>
            <Suspense fallback="">
                {!isAuthenticated && <RoutesGuestPages/>}
                {isAuthenticated && <RoutesAuthPages />}
            </Suspense>
            {!storage.isHostApp() && <UserFloatingMenu />}
        </>
    );
}

export default App;
