/**
 * App Component - KOMCA 패턴
 * 인증 상태에 따른 라우트 분기
 */

import React, { Suspense, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './styles/global.css';

// 라우트 로딩 fallback
const RouteFallback = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
    }}>
        <div className="spinner-large" />
    </div>
);

function App() {
    const accessToken = useSelector(selectAccessToken);
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

    // AOS 초기화
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
        });
    }, []);

    return (
        <main className="main-content">
            <Suspense fallback={<RouteFallback />}>
                {!isAuthenticated && <RoutesGuestPages />}
                {isAuthenticated && <RoutesAuthPages />}
            </Suspense>
        </main>
    );
}

export default App;
