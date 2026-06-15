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
    <div className="root-init-loading">
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
