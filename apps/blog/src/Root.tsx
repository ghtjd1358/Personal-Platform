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