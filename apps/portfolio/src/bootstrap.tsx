/**
 * Bootstrap - KOMCA 패턴
 * 앱 부팅 및 초기화 담당
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createAppStore, ToastProvider, ModalProvider, storage, initSupabase } from '@sonhoseong/mfa-lib';
import Root from './Root';
import './styles/global.css';

// Supabase 초기화 (싱글톤)
initSupabase({
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
});

const store = createAppStore();

// 단독 실행 시 store를 window에 노출
if (!window.__REDUX_STORE__) {
    window.__REDUX_STORE__ = store as any;
}

async function start() {
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');

    // 단독 실행 시 body에 standalone 클래스 추가
    if (!storage.isHostApp()) {
        document.body.classList.add('standalone');
    }

    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <Provider store={store}>
                <ToastProvider>
                    <ModalProvider>
                        <BrowserRouter>
                            <Root />
                        </BrowserRouter>
                    </ModalProvider>
                </ToastProvider>
            </Provider>
        </React.StrictMode>
    );
}

start();