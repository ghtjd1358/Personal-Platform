import { useLocation } from 'react-router-dom'
import {
    Container,
    ModalContainer,
    ToastContainer,
    ErrorBoundary,
    GlobalLoading,
    LoadingSpinner,
    ScrollTopButton,
    storage,
    useSimpleInitialize,
} from '@sonhoseong/mfa-lib'
import App from '@/App'

const isHost = storage.isHostApp()

function Root() {
    const location = useLocation()
    const { initialized } = useSimpleInitialize()

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

    return (
        <>
            <ModalContainer />
            <ToastContainer />
            {isHost ? (
                <ErrorBoundary>
                    <main className="main-content">
                        <App />
                    </main>
                    <GlobalLoading />
                </ErrorBoundary>
            ) : (
                <Container>
                    <ErrorBoundary>
                        <main className="main-content">
                            <App />
                        </main>
                        <GlobalLoading />
                    </ErrorBoundary>
                </Container>
            )}
            {!isHost && !isLoginPage && <ScrollTopButton />}
        </>
    )
}

export default Root