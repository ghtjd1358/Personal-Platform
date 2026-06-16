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
    onUnauthorized: () => window.location.replace(RoutePath.Login),
});

async function start() {
    const container = document.getElementById('root');
    if (!container) throw new Error('Failed to find the root element');

    const { default: App } = await import('./App');

    const root = createRoot(container);
    root.render(
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
}

const LOAD_FAILURE_HTML = '<div style="padding:2rem;font-family:sans-serif"><h2>앱을 불러오지 못했습니다</h2><p>페이지를 새로고침 해주세요.</p></div>';

start().catch((err) => {
    console.error('[Bootstrap] 앱 시작 실패:', err);
    const root = document.getElementById('root');
    if (root) root.innerHTML = LOAD_FAILURE_HTML;
});
