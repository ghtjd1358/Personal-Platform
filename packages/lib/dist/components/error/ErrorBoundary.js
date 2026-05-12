import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ErrorBoundary - KOMCA 패턴
 * 에러 발생 시 Fallback UI 표시
 */
import { Component } from 'react';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.resetError = () => {
            this.setState({ hasError: false, error: null });
        };
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }
    render() {
        if (this.state.hasError && this.state.error) {
            // 커스텀 fallback
            if (this.props.fallback) {
                if (typeof this.props.fallback === 'function') {
                    return this.props.fallback(this.state.error, this.resetError);
                }
                return this.props.fallback;
            }
            // 기본 fallback UI
            return (_jsxs("div", { className: "error-boundary-fallback", children: [_jsxs("div", { className: "error-boundary-content", children: [_jsx("div", { className: "error-boundary-icon", children: "\u26A0\uFE0F" }), _jsx("h2", { className: "error-boundary-title", children: "\uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4" }), _jsx("p", { className: "error-boundary-message", children: this.state.error.message || '알 수 없는 오류가 발생했습니다.' }), _jsxs("div", { className: "error-boundary-actions", children: [_jsx("button", { className: "error-boundary-button primary", onClick: this.resetError, children: "\uB2E4\uC2DC \uC2DC\uB3C4" }), _jsx("button", { className: "error-boundary-button secondary", onClick: () => window.location.reload(), children: "\uC0C8\uB85C\uACE0\uCE68" })] }), process.env.NODE_ENV === 'development' && (_jsxs("details", { className: "error-boundary-details", children: [_jsx("summary", { children: "\uC0C1\uC138 \uC815\uBCF4" }), _jsx("pre", { children: this.state.error.stack })] }))] }), _jsx("style", { children: `
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
                    ` })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
