import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    Container,
    ModalContainer,
    ToastContainer,
    ErrorBoundary,
    GlobalLoading,
    useSimpleInitialize,
    selectAccessToken
} from '@sonhoseong/mfa-lib'
import { lnbItems } from './exposes/lnb-items'
import App from './exposes/App'

// 초기화 로딩 컴포넌트
const InitLoading = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#F8FAFC'
    }}>
        <div className="spinner-large" />
    </div>
)

function Root() {
    const accessToken = useSelector(selectAccessToken)
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])
    const { initialized } = useSimpleInitialize()

    const sidebarItems = useMemo(() => {
        return isAuthenticated ? lnbItems.hasPrefixAuthList : lnbItems.hasPrefixList
    }, [isAuthenticated])

    // 초기화 완료 전까지 로딩 표시
    if (!initialized) {
        return <InitLoading />
    }

    return (
        <>
            <ModalContainer />
            <ToastContainer />
            <Container>
                <ErrorBoundary>
                    {/*{isAuthenticated && <Lnb lnbItems={lnbItems} logo={<Logo customSize={36} />} />}*/}
                    <main className="main-content">
                        <App />
                    </main>
                    <GlobalLoading />
                </ErrorBoundary>
            </Container>
        </>
    )
}

export default Root
