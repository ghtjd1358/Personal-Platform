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
    storage,
    initSupabase,
    exposeStore,
} from '@sonhoseong/mfa-lib';
import { setupFontLoading, setupHostAxios } from './setup';

setupFontLoading();
storage.setHostApp();
initSupabase({
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
});
setupHostAxios();
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
