import { Suspense, lazy, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import {
    selectUser,
    useNodeInitialize,
    useNodeLogout,
    usePermission,
    ErrorBoundary,
    Container,
    Lnb,
    Logo,
    DeferredComponent,
    RemoteErrorBoundary,
    REMOTE_LINK_PREFIX,
    LnbMenuItem,
    LoginPage,
    setAccessToken,
    setUser,
    getSupabase,
} from '@sonhoseong/mfa-lib';
import { useDispatch } from 'react-redux';
import { RoutePath } from './pages/routes/paths';
import { RequireAuth } from './pages/routes/RequireAuth';
import MyPageGuard from './pages/routes/MyPageGuard';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { buildLnbItems } from './lnb-items';
import HostShell from './components/HostShell';
import { PageSkeleton, DashboardSkeleton } from './components/skeleton';
import './App.css';
import './sidebar-editorial.css';
import './theme-editorial.css';

const LOADING_AREA = 'GLOBAL';
const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:4000';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ResumeApp = lazy(() =>
    trackPromise(import('@resume/App').catch(() => ({ default: () => null })), LOADING_AREA)
);
const BlogApp = lazy(() =>
    trackPromise(import('@blog/App').catch(() => ({ default: () => null })), LOADING_AREA)
);
const PortfolioApp = lazy(() =>
    trackPromise(import('@portfolio/App').catch(() => ({ default: () => null })), LOADING_AREA)
);
const JobTrackerApp = lazy(() =>
    trackPromise(import('@jobtracker/App').catch(() => ({ default: () => null })), LOADING_AREA)
);

const resumePathPrefix = REMOTE_LINK_PREFIX.resume;
const blogPathPrefix = REMOTE_LINK_PREFIX.blog;
const portfolioPathPrefix = REMOTE_LINK_PREFIX.portfolio;
const jobtrackerPathPrefix = REMOTE_LINK_PREFIX.jobtracker;

const remoteRoutes: { path: string; name: string; App: React.ComponentType }[] = [
    { path: `${resumePathPrefix}/*`,     name: '이력서',    App: ResumeApp },
    { path: `${blogPathPrefix}/*`,       name: '블로그',    App: BlogApp },
    { path: `${portfolioPathPrefix}/*`,  name: '포트폴리오', App: PortfolioApp },
    { path: `${jobtrackerPathPrefix}/*`, name: '취업관리',  App: JobTrackerApp },
];

const remoteFallback = (name: string) => (
    <DeferredComponent>
        <PageSkeleton label={`${name}을 불러오는 중입니다`} />
    </DeferredComponent>
);

function AuthLayout({ lnbItems, onLogout }: { lnbItems: LnbMenuItem[]; onLogout: () => Promise<void> }) {
    return (
        <Container>
            <ErrorBoundary>
                <Lnb
                    lnbItems={lnbItems}
                    onLogout={onLogout}
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
                        <Outlet />
                    </Suspense>
                </main>
            </ErrorBoundary>
        </Container>
    );
}

const App = () => {
    const user = useSelector(selectUser);
    const { initialized } = useNodeInitialize();
    const { filterMenus, isOwner } = usePermission();
    const { logout: nodeLogout } = useNodeLogout();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = useCallback(async () => {
        await nodeLogout();
        navigate(RoutePath.Login);
    }, [nodeLogout, navigate]);

    const handleGoogleLogin = useCallback(() => {
        window.location.href = `${API_URL}/api/auth/google`;
    }, []);

    const handleTestLogin = useCallback(async () => {
        try {
            // Node.js API 우선 (배포 완료 후)
            const loginRes = await axios.post<{ data: { accessToken: string } }>(
                `${API_URL}/api/auth/login`,
                { email: 'admin@test.com', password: '1234' },
                { withCredentials: true, timeout: 4000 }
            );
            const { accessToken } = loginRes.data.data;
            dispatch(setAccessToken(accessToken));
            const meRes = await axios.get<{ data: { id: string; email: string; name: string; role?: 'admin' | 'user'; avatar?: string } }>(
                `${API_URL}/api/auth/me`,
                { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
            );
            const u = meRes.data.data;
            dispatch(setUser({ id: u.id, email: u.email, name: u.name, role: u.role ?? 'user', avatar: u.avatar }));
        } catch {
            // Fallback: Supabase auth (API 미배포 환경)
            const supabase = getSupabase();
            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'admin@test.com',
                password: '1234',
            });
            if (error || !data.session) throw new Error('테스트 로그인 실패. API 서버 또는 Supabase 계정을 확인하세요.');
            dispatch(setAccessToken(data.session.access_token));
            dispatch(setUser({ id: data.user.id, email: 'admin@test.com', name: '데모 계정', role: 'admin' }));
        }
        navigate(RoutePath.Dashboard, { replace: true });
    }, [dispatch, navigate]);

    const lnbItems = useMemo(
        () => filterMenus(buildLnbItems(user, isOwner)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [filterMenus, user?.id, isOwner]
    );

    if (!initialized) return <HostShell />;

    return (
        <HostShell>
            <Routes>
                {/* Guest routes */}
                <Route
                    path={RoutePath.Login}
                    element={
                        <LoginPage
                            appName="Portfolio"
                            redirectPath={RoutePath.Dashboard}
                            onGoogleLogin={handleGoogleLogin}
                            onTestLogin={handleTestLogin}
                        />
                    }
                />
                <Route path={RoutePath.AuthCallback} element={<AuthCallbackPage />} />

                {/* Protected routes — RequireAuth redirects to /login with state.from if unauthenticated */}
                <Route element={<RequireAuth />}>
                    <Route element={<AuthLayout lnbItems={lnbItems} onLogout={handleLogout} />}>
                        <Route path="/" element={<Navigate to={RoutePath.Dashboard} replace />} />
                        <Route
                            path={RoutePath.Dashboard}
                            element={
                                <Suspense fallback={<DeferredComponent><DashboardSkeleton /></DeferredComponent>}>
                                    <Dashboard />
                                </Suspense>
                            }
                        />
                        {remoteRoutes.map(({ path, name, App }) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <RemoteErrorBoundary remoteName={name}>
                                        <Suspense fallback={remoteFallback(name)}>
                                            <App />
                                        </Suspense>
                                    </RemoteErrorBoundary>
                                }
                            />
                        ))}
                        <Route path="/container/user/:userId" element={<MyPageGuard />} />
                        <Route path={RoutePath.Login} element={<Navigate to={RoutePath.Dashboard} replace />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to={RoutePath.Login} replace />} />
            </Routes>
        </HostShell>
    );
};

export default App;
