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

const isHost = storage.isHostApp();

function Root() {
    const { initialized } = useSimpleInitialize();

    return initialized ? (
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
            {!isHost && <ScrollTopButton />}
        </>
    ) : (
        <></>
    );
}

export default Root;
