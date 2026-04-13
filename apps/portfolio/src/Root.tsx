/**
 * Root Component - KOMCA 패턴
 * 앱의 최상위 레이아웃 컴포넌트
 */

import React from 'react';
import {
    ModalContainer,
    ToastContainer,
    ErrorBoundary,
    GlobalLoading,
    useSimpleInitialize,
} from '@sonhoseong/mfa-lib';
import App from './App';

// 초기화 로딩 컴포넌트
const InitLoading = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#0a0a0a'
    }}>
        <div className="spinner-large" />
    </div>
);

const Root: React.FC = () => {
    const { initialized } = useSimpleInitialize();

    // 초기화 완료 전까지 로딩 표시
    if (!initialized) {
        return <InitLoading />;
    }

    return (
        <>
            <ModalContainer />
            <ToastContainer />
            <ErrorBoundary>
                <App />
                <GlobalLoading />
            </ErrorBoundary>
        </>
    );
};

export default Root;
