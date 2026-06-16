import { Suspense, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    selectIsAuthenticated,
    selectUser,
    useSupabaseInitialize,
    usePermission,
    useSupabaseLogout,
    ErrorBoundary,
    Container,
    Lnb,
    Logo,
    MyPageIcon,
} from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import { lnbItems } from './lnb-items';
import HostShell from './components/HostShell';
import './App.css';
import './sidebar-editorial.css';
import './theme-editorial.css';

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const { initialized } = useSupabaseInitialize();
    const { filterMenus } = usePermission();
    const { logout: supabaseLogout } = useSupabaseLogout();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        await supabaseLogout();
        navigate('/');
    }, [supabaseLogout, navigate]);

    const filteredLnbItems = useMemo(() => {
        const baseItems = user
            ? [
                  ...lnbItems,
                  {
                      id: 'mypage',
                      title: '마이페이지',
                      path: `/container/user/${user.id}`,
                      icon: MyPageIcon,
                  },
              ]
            : lnbItems;
        return filterMenus(baseItems);
    }, [filterMenus, user]);

    if (!initialized) {
        return <HostShell>{null}</HostShell>;
    }

    return  isAuthenticated ? (
        <HostShell>
            <Container>
                <ErrorBoundary>
                    <Lnb
                        lnbItems={filteredLnbItems}
                        onLogout={handleLogout}
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
        </HostShell>
    ): (
        <HostShell>
            <RoutesGuestPages />
        </HostShell>
    );
};

export default App;
