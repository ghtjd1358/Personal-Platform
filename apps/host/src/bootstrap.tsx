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

async function start(): Promise<void> {
    const container = document.getElementById('root');
    if (!container) throw new Error('Failed to find the root element');

    // KOMCA 패턴: 순차(sequential) 로드 — 각 remote가 MF 공유 모듈 레지스트리 협상을 완전히 끝낸 뒤 다음 로드
    // 병렬(allSettled)은 레지스트리에 동시 등록 시 race condition 발생 → 1/3 확률 crash
    await import('@resume/App').catch(() => null);
    await import('@blog/App').catch(() => null);
    await import('@portfolio/App').catch(() => null);
    await import('@jobtracker/App').catch(() => null);

    const { default: App } = await import('./App');

    // KOMCA 패턴: render는 setTimeout 매크로태스크에서 실행
    // await new Promise(setTimeout)은 마이크로태스크 연속이라 MF pending async가 아직 남을 수 있음
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                createRoot(container).render(
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
                resolve();
            } catch (err) {
                reject(err);
            }
        }, 100);
    });
}

start().catch((err) => {
    console.error('[Bootstrap] 앱 시작 실패:', err);
    const root = document.getElementById('root');
    if (root) root.innerHTML = LOAD_FAILURE_HTML;
});
