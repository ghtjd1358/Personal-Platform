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

    if (!initialized) return <></>;

    const content = (
        <ErrorBoundary>
            <main className="main-content">
                <App />
            </main>
            <GlobalLoading />
        </ErrorBoundary>
    );

    return (
        <>
            <ModalContainer />
            <ToastContainer />
            {isHost ? content : <Container>{content}</Container>}
            {!isHost && <ScrollTopButton />}
        </>
    );
}

export default Root;
