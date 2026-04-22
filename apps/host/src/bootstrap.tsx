/**
 * Bootstrap - Host Container (Composition Root)
 *
 * 앱의 진입점. 모든 의존성 초기화를 여기에 집중:
 * - Supabase 클라이언트 초기화
 * - Axios Factory (인증/토큰/에러 처리) 연결
 * - Redux Store 전역 노출 (Remote가 공유할 수 있도록)
 * - Provider 래핑 후 App 마운트
 *
 * App.tsx는 순수 컴포넌트 로직만 담당하도록 side-effect는 모두 여기로.
 */
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
    store,
    ToastProvider,
    ModalProvider,
    storage,
    initSupabase,
    initAxiosFactory,
    exposeStore,
    setAccessToken,
    getSupabase,
} from '@sonhoseong/mfa-lib';

// 0. Font Loading 상태 — Fraunces variable font 가 ready 되면 html 에 fonts-ready 클래스 부여.
//    이렇게 하면 .fonts-loading 상태에서 hero-title 이 visibility:hidden 유지 → 폴백(Georgia)
//    으로 굵게 그려졌다가 Fraunces 300 으로 얇아지는 weight jump(reflow/repaint) 완전 차단.
if (typeof document !== 'undefined') {
    const html = document.documentElement;
    html.classList.add('fonts-loading');
    const ready = (document as any).fonts?.ready;
    const markReady = () => {
        html.classList.remove('fonts-loading');
        html.classList.add('fonts-ready');
    };
    if (ready && typeof ready.then === 'function') {
        ready.then(markReady).catch(markReady);
        // safety net: 2s 안에 fonts.ready 가 resolve 안 되면 강제 해제 (영원히 숨지 않도록)
        setTimeout(markReady, 2000);
    } else {
        markReady();
    }
}

// 1. Host 플래그
storage.setHostApp();

// 2. Supabase 초기화
initSupabase({
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
});

// 3. Axios Factory (토큰/인증/에러 처리 연결)
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
        store.dispatch({ type: 'app/logout' });
        window.location.href = '/container/login';
    },
    onHttpError: (errorInfo) => {
        console.error(`[HTTP Error] ${errorInfo.status}: ${errorInfo.message}`);
    },
});

// 4. Store 전역 노출 (Remote가 window.__REDUX_STORE__로 접근)
exposeStore(store);

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

start();
