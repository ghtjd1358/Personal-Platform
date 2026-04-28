import React from 'react';
import {
    Container,
    ModalContainer,
    ToastContainer,
    ErrorBoundary,
    GlobalLoading,
    ScrollTopButton,
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
            <ScrollTopButton />
        </>
    );
}

export default Root;
