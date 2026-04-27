/**
 * App — Host Container
 *
 * 순수 컴포넌트: 인증 상태에 따라 Guest/Auth 라우팅 분기.
 * 초기화/부트스트랩은 모두 bootstrap.tsx 로 (Composition Root).
 * 공용 chrome (Modal/Toast/GlobalLoading) 은 HostShell.
 */
import { Suspense, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    selectIsAuthenticated,
    useSupabaseInitialize,
    usePermission,
    getCurrentUser,
    ErrorBoundary,
    Container,
    Lnb,
    Logo,
} from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import { lnbItems } from './lnb-items';
import { MyPageIcon } from './components/icons';
import HostShell from './components/HostShell';
import FloatingNav from './components/FloatingNav';
import './App.css';
import './sidebar-editorial.css';
import './theme-editorial.css';

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { initialized } = useSupabaseInitialize();
    const { filterMenus } = usePermission();

    const filteredLnbItems = useMemo(() => {
        const currentUser = getCurrentUser();
        const baseItems = currentUser
            ? [
                  ...lnbItems,
                  {
                      id: 'mypage',
                      title: '마이페이지',
                      path: `/container/user/${currentUser.id}`,
                      icon: MyPageIcon,
                  },
              ]
            : lnbItems;
        return filterMenus(baseItems);
    }, [filterMenus, isAuthenticated]);

    if (!initialized) return null;

    return  isAuthenticated ? (
        <HostShell>
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
                </ErrorBoundary>
            </Container>
            <FloatingNav />
        </HostShell>
    ): (
        <HostShell>
            <RoutesGuestPages />
        </HostShell>
    );
};

export default App;
