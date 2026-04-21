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
    getCurrentUser,
    ErrorBoundary,
    ToastContainer,
    ModalContainer,
    Container,
    Lnb,
    Logo,
} from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import { lnbItems } from './lnb-items';
import FarmerLoading from './components/FarmerLoading';
import './App.css';
import './sidebar-editorial.css';
import './theme-editorial.css';

// 마이페이지 아이콘 — 로그인 시 동적으로 LNB에 추가
const mypageIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { initialized } = useSupabaseInitialize();
    const { filterMenus } = usePermission();

    // 권한 기반 메뉴 필터링 + 로그인 시 마이페이지 동적 추가
    // (유저별 path: /container/user/:userId — lnb-items static으로는 표현 불가라 여기서 병합)
    const filteredLnbItems = useMemo(() => {
        const currentUser = getCurrentUser();
        const baseItems = currentUser
            ? [
                  ...lnbItems,
                  {
                      id: 'mypage',
                      title: '마이페이지',
                      path: `/container/user/${currentUser.id}`,
                      icon: mypageIcon,
                  },
              ]
            : lnbItems;
        return filterMenus(baseItems);
    }, [filterMenus, isAuthenticated]);

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
                <FarmerLoading />
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
                    <Lnb
                        lnbItems={filteredLnbItems}
                        logo={
                            <Logo
                                customSize={36}
                                sideColor="#2B1E14"
                                centerColor="#8C1E1A"
                                eyeColor="#FBF5E3"
                            />
                        }
                    />
                    <main className="main-content">
                        <Suspense fallback="">
                            <RoutesAuthPages />
                        </Suspense>
                    </main>
                    <FarmerLoading />
                </ErrorBoundary>
            </Container>
        </>
    );
};

export default App;
