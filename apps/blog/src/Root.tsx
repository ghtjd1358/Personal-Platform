import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
    Container,
    ModalContainer,
    ToastContainer,
    ErrorBoundary,
    GlobalLoading,
    LoadingSpinner,
    ScrollTopButton,
    storage,
    getStore,
    setAccessToken,
    setUser,
} from '@sonhoseong/mfa-lib'
import App from '@/App'

function useLocalInitialize() {
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
        try {
            const store = getStore();

            const savedToken = storage.getAccessToken();
            const savedUser = storage.getUser();

            if (savedToken) {
                store.dispatch(setAccessToken(savedToken))
            }
            if (savedUser) {
                store.dispatch(setUser(savedUser))
            }
            console.log('[Root] 초기화 완료')
        } catch (err) {
            console.error('[Root] 초기화 에러:', err)
        } finally {
            console.log('[Root] setInitialized(true) 호출')
            setInitialized(true)
        }
    }, [])

    return { initialized }
}

function Root() {
    const location = useLocation()
    const { initialized } = useLocalInitialize()

    const isLoginPage = location.pathname === '/login' || location.pathname === '/blog/login'

    if (!initialized) {
        return (
            <div className="root-init-loading">
                <div className="root-init-loading__inner">
                    <LoadingSpinner message="로딩 중..." />
                </div>
            </div>
        )
    }

    if (isLoginPage) {
        return (
            <>
                <ModalContainer />
                <ToastContainer />
                <Container>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </Container>
                <GlobalLoading />
            </>
        )
    }

    return (
        <>
            <ModalContainer />
            <ToastContainer />
            <Container>
                <ErrorBoundary>
                    <main className="main-content">
                        <App />
                    </main>
                    <GlobalLoading />
                </ErrorBoundary>
            </Container>
            {!storage.isHostApp() && <ScrollTopButton />}
        </>
    )
}

export default Root