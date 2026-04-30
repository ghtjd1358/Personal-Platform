import React from 'react';
import {
    Container,
    ModalContainer,
    ToastContainer,
    ErrorBoundary,
    GlobalLoading,
    ScrollTopButton,
    storage,
    useSimpleInitialize,
} from '@sonhoseong/mfa-lib';
import App from './App';

function Root() {
    const { initialized } = useSimpleInitialize();

    if (!initialized) return null;

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
    );
}

export default Root;
