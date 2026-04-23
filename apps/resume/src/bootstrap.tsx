import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store, ToastProvider, ModalProvider } from '@sonhoseong/mfa-lib'
import Root from './Root'

async function start() {
    const rootElement = document.getElementById('root')
    if (!rootElement) throw new Error('Root element not found')

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
    )
}

start()
