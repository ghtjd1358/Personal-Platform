import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
    store,
    ToastProvider,
    ModalProvider,
    initSupabase,
    exposeStore,
    setupFontLoading,
    initApiClient,
} from '@sonhoseong/mfa-lib';
import { RoutePath } from './pages/routes/paths';

setupFontLoading();

// webpack MF 런타임에서 터지는 uncaught rejection을 전역에서 억제
// "Shared module is not available" 에러만 타깃 — React 내부 에러는 절대 삼키지 않음
window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message ?? String(event.reason ?? '');
    if (msg.includes('Shared module is not available')) {
        event.preventDefault();
    }
});

try {
    initSupabase({
        supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
        supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    });
} catch (err) {
    console.error('[Bootstrap] Supabase 초기화 실패:', err);
}

// exposeStore 먼저 — initApiClient 내부 getStore() 가 window.__REDUX_STORE__ 를 잡도록
exposeStore(store);

initApiClient({
    onUnauthorized: () => {
        if (window.location.pathname !== RoutePath.Login) {
            window.location.replace(RoutePath.Login);
        }
    },
});

const LOAD_FAILURE_HTML = '<div style="padding:2rem;font-family:sans-serif"><h2>앱을 불러오지 못했습니다</h2><p>페이지를 새로고침 해주세요.</p></div>';

async function start(retries = 0): Promise<void> {
    const container = document.getElementById('root');
    if (!container) throw new Error('Failed to find the root element');

    const { default: App } = await import('./App');

    // root는 최초 1회만 생성 — 재시도 시 기존 root 재사용
    const reactRoot = (container as any).__reactRoot ?? createRoot(container);
    (container as any).__reactRoot = reactRoot;

    try {
        reactRoot.render(
            <Provider store={store}>
                <ToastProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </ModalProvider>
                </ToastProvider>
            </Provider>
        );
    } catch (err) {
        if (retries < 3) {
            console.warn(`[Bootstrap] 렌더 실패, 재시도 ${retries + 1}/3`);
            await new Promise(r => setTimeout(r, 600));
            return start(retries + 1);
        }
        container.innerHTML = LOAD_FAILURE_HTML;
    }
}

start().catch((err) => {
    console.error('[Bootstrap] 앱 시작 실패:', err);
    const root = document.getElementById('root');
    if (root) root.innerHTML = LOAD_FAILURE_HTML;
});
