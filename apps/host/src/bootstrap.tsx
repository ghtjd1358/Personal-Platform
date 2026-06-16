/**
 * Bootstrap — Host Container (Composition Root)
 *
 * 앱 진입점. 의존성 초기화 흐름만 책임진다:
 *   0. Font loading guard (reflow/repaint 차단)
 *   1. Host 플래그 (storage)
 *   2. Supabase 클라이언트
 *   3. Axios Factory (토큰/인증/에러 핸들링)
 *   4. Redux Store 전역 노출 (Remote 공유용)
 *   5. Provider 래핑 후 App 마운트
 *
 * 각 step 의 디테일은 ./bootstrap/* 헬퍼로 분리.
 * App.tsx 는 순수 컴포넌트 로직만, side-effect 는 모두 여기로.
 */
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

try {
    // API 클라이언트 초기화 (이 시점 이후부터 apiClient 사용 가능)
    // 이전에 apiClient.get/post 호출 시 토큰 주입/refresh 가 동작하지 않음
    initApiClient({
        // 라우트 경로는 lib이 아닌 host가 결정
        onUnauthorized: () => window.location.replace(RoutePath.Login),
    });
} catch (err) {
    console.error('[Bootstrap] API 클라이언트 초기화 실패:', err);
}

// exposeStore 내부에서 storage.setHostApp() 호출하므로 직접 호출 제거
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

start().catch((err) => {
    console.error('[Bootstrap] 앱 시작 실패:', err);
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = '<div style="padding:2rem;font-family:sans-serif"><h2>앱을 불러오지 못했습니다</h2><p>페이지를 새로고침 해주세요.</p></div>';
    }
});
