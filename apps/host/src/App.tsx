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
    DeferredComponent,
} from '@sonhoseong/mfa-lib';
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes';
import { buildLnbItems } from './lnb-items';
import HostShell from './components/HostShell';
import { PageSkeleton } from './components/skeleton';
import './App.css';
import './sidebar-editorial.css';
import './theme-editorial.css';

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const { initialized } = useSupabaseInitialize();
    const { filterMenus, isOwner } = usePermission();
    const { logout: supabaseLogout } = useSupabaseLogout();
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        await supabaseLogout();
        navigate('/');
    }, [supabaseLogout, navigate]);

    const lnbItems = useMemo(
        () => filterMenus(buildLnbItems(user, isOwner)),
        [filterMenus, user, isOwner]
    );

    if (!initialized) return <HostShell />;

    return (
        <HostShell>
            {isAuthenticated ? (
                <Container>
                    <ErrorBoundary>
                        <Lnb
                            lnbItems={lnbItems}
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
                            <Suspense
                                fallback={
                                    <DeferredComponent>
                                        <PageSkeleton label="페이지를 불러오는 중입니다" />
                                    </DeferredComponent>
                                }
                            >
                                <RoutesAuthPages />
                            </Suspense>
                        </main>
                    </ErrorBoundary>
                </Container>
            ) : (
                <RoutesGuestPages />
            )}
        </HostShell>
    );
};

export default App;
