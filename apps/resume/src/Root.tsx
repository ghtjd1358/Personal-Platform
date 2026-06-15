import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    Container,
    ModalContainer,
    ToastContainer,
    ErrorBoundary,
    GlobalLoading,
    ScrollTopButton,
    storage,
    useSimpleInitialize,
    selectAccessToken
} from '@sonhoseong/mfa-lib'
import { lnbItems } from './exposes/lnb-items'
import App from './exposes/App'

function Root() {
    const { initialized } = useSimpleInitialize()

    return  initialized ? (
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
    ) : (
        <></>
    )
}

export default Root
