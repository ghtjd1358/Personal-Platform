/**
 * ErrorBoundary - KOMCA 패턴
 * 에러 발생 시 Fallback UI 표시
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

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
                <div className="error-boundary-fallback">
                    <div className="error-boundary-content">
                        <div className="error-boundary-icon">⚠️</div>
                        <h2 className="error-boundary-title">문제가 발생했습니다</h2>
                        <p className="error-boundary-message">
                            {this.state.error.message || '알 수 없는 오류가 발생했습니다.'}
                        </p>
                        <div className="error-boundary-actions">
                            <button
                                className="error-boundary-button primary"
                                onClick={this.resetError}
                            >
                                다시 시도
                            </button>
                            <button
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

                    <style>{`
                        .error-boundary-fallback {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 400px;
                            padding: 24px;
                            background: #fafafa;
                        }

                        .error-boundary-content {
                            text-align: center;
                            max-width: 480px;
                            padding: 40px;
                            background: white;
                            border-radius: 16px;
                            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
                        }

                        .error-boundary-icon {
                            font-size: 48px;
                            margin-bottom: 16px;
                        }

                        .error-boundary-title {
                            margin: 0 0 12px;
                            font-size: 20px;
                            font-weight: 600;
                            color: #111827;
                        }

                        .error-boundary-message {
                            margin: 0 0 24px;
                            font-size: 14px;
                            color: #6b7280;
                            line-height: 1.5;
                        }

                        .error-boundary-actions {
                            display: flex;
                            gap: 12px;
                            justify-content: center;
                        }

                        .error-boundary-button {
                            padding: 10px 20px;
                            font-size: 14px;
                            font-weight: 500;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: all 0.15s;
                        }

                        .error-boundary-button.primary {
                            background: #3b82f6;
                            color: white;
                            border: none;
                        }

                        .error-boundary-button.primary:hover {
                            background: #2563eb;
                        }

                        .error-boundary-button.secondary {
                            background: white;
                            color: #374151;
                            border: 1px solid #d1d5db;
                        }

                        .error-boundary-button.secondary:hover {
                            background: #f9fafb;
                        }

                        .error-boundary-details {
                            margin-top: 24px;
                            text-align: left;
                        }

                        .error-boundary-details summary {
                            cursor: pointer;
                            font-size: 12px;
                            color: #9ca3af;
                        }

                        .error-boundary-details pre {
                            margin-top: 8px;
                            padding: 12px;
                            font-size: 11px;
                            background: #f3f4f6;
                            border-radius: 6px;
                            overflow-x: auto;
                            color: #ef4444;
                        }
                    `}</style>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
