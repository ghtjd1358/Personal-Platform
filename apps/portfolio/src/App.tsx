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

// Suspense 유지, fallback 빈값 — 중복 스피너 방지. 추후 editorial 컴포넌트 끼울 slot 유지.
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
        <Suspense fallback="">
            {!isAuthenticated && <RoutesGuestPages />}
            {isAuthenticated && <RoutesAuthPages />}
        </Suspense>
    );
}

export default App;
