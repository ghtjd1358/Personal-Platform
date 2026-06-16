/**
 * ErrorBoundary - KOMCA 패턴
 * 에러 발생 시 Fallback UI 표시
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
    children: ReactNode;
    /** 커스텀 Fallback UI */
    fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
    /** 에러 발생 시 콜백 */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    resetError = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            // 커스텀 fallback
            if (this.props.fallback) {
                if (typeof this.props.fallback === 'function') {
                    return this.props.fallback(this.state.error, this.resetError);
                }
                return this.props.fallback;
            }

            // 기본 fallback UI
            return (
                <div className="error-boundary-fallback" role="alert">
                    <div className="error-boundary-content">
                        <div className="error-boundary-icon" aria-hidden="true">⚠️</div>
                        <h2 className="error-boundary-title">문제가 발생했습니다</h2>
                        <p className="error-boundary-message">
                            {this.state.error.message || '알 수 없는 오류가 발생했습니다.'}
                        </p>
                        <div className="error-boundary-actions">
                            <button
                                type="button"
                                className="error-boundary-button primary"
                                onClick={this.resetError}
                            >
                                다시 시도
                            </button>
                            <button
                                type="button"
                                className="error-boundary-button secondary"
                                onClick={() => window.location.reload()}
                            >
                                새로고침
                            </button>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="error-boundary-details">
                                <summary>상세 정보</summary>
                                <pre>{this.state.error.stack}</pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
