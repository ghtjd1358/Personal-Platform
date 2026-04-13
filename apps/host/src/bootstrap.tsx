/**
 * Bootstrap - Host Container (단순화)
 */
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, ToastProvider, ModalProvider, storage, initSupabase } from '@sonhoseong/mfa-lib';

storage.setHostApp();

// Supabase 초기화
initSupabase({
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseAnonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
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

start();
