/**
 * App - Host Container (단순화)
 */
import { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    store,
    exposeStore,
    selectIsAuthenticated,
    selectAccessToken,
    setAccessToken,
    useSupabaseInitialize,
    initAxiosFactory,
    getSupabase,
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

// Axios Factory 초기화 (토큰 관리 연결)
initAxiosFactory({
    getAccessToken: () => store.getState().app.accessToken,
    setAccessToken: (token: string) => store.dispatch(setAccessToken(token)),
    refreshToken: async () => {
        try {
            const supabase = getSupabase();
            const { data, error } = await supabase.auth.refreshSession();
            if (error || !data.session) {
                console.warn('[Axios Factory] 토큰 갱신 실패');
                return null;
            }
            return data.session.access_token;
        } catch {
            return null;
        }
    },
    onUnauthorized: () => {
        // 인증 실패 시 로그아웃 처리
        store.dispatch({ type: 'app/logout' });
        window.location.href = '/container/login';
    },
    onHttpError: (errorInfo) => {
        // HTTP 에러 처리 (toast/modal)
        console.error(`[HTTP Error] ${errorInfo.status}: ${errorInfo.message}`);
    },
});

// Store를 전역에 노출
exposeStore(store);

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
                        <Suspense fallback={""}>
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
