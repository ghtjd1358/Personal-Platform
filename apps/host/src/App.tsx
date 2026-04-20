/**
 * App - Host Container
 *
 * 순수 컴포넌트: 인증 상태에 따라 Guest/Auth 라우팅 분기.
 * 초기화/부트스트랩 코드는 모두 bootstrap.tsx로 이동 (Composition Root).
 */
import { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    selectIsAuthenticated,
    useSupabaseInitialize,
    usePermission,
    ErrorBoundary,
    ToastContainer,
    ModalContainer,
    Container,
    Lnb,
    Logo,
    GlobalLoading,
} from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import { lnbItems } from './lnb-items';
import './App.css';

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { initialized } = useSupabaseInitialize();
    const { filterMenus } = usePermission();

    // 권한 기반 메뉴 필터링
    const filteredLnbItems = useMemo(() => {
        return filterMenus(lnbItems);
    }, [filterMenus]);

    if (!initialized) {
        return null;
    }

    // 비로그인: 로그인 페이지만
    if (!isAuthenticated) {
        return (
            <>
                <ModalContainer />
                <ToastContainer position="top-right" />
                <RoutesGuestPages />
                <GlobalLoading />
            </>
        );
    }

    // 로그인: Lnb + 콘텐츠
    return (
        <>
            <ModalContainer />
            <ToastContainer position="top-right" />
            <Container>
                <ErrorBoundary>
                    <Lnb lnbItems={filteredLnbItems} logo={<Logo customSize={36} />} />
                    <main className="main-content">
                        <Suspense fallback="">
                            <RoutesAuthPages />
                        </Suspense>
                    </main>
                    <GlobalLoading />
                </ErrorBoundary>
            </Container>
        </>
    );
};

export default App;
