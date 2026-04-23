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

function Root() {
    const accessToken = useSelector(selectAccessToken)
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])
    const { initialized } = useSimpleInitialize()

    const sidebarItems = useMemo(() => {
        return isAuthenticated ? lnbItems.hasPrefixAuthList : lnbItems.hasPrefixList
    }, [isAuthenticated])

    return  initialized ? (
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
    ) : (
        <></>
    )
}

export default Root
