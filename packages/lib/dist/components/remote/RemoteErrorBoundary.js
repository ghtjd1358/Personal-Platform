import { jsx as _jsx } from "react/jsx-runtime";
/**
 * RemoteErrorBoundary
 * Remote 앱 로드 실패 시 에러를 캡처하고 Fallback UI 표시
 */
import { Component } from 'react';
import { RemoteErrorFallback } from './RemoteErrorFallback';
export class RemoteErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleRetry = () => {
            this.setState({ hasError: false, error: null });
        };
        this.state = {
            hasError: false,
            error: null,
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error(`[RemoteErrorBoundary] ${this.props.remoteName} 로드 실패:`, error);
        console.error('Error Info:', errorInfo);
        // 에러 콜백 실행
        this.props.onError?.(error, errorInfo);
    }
    render() {
        const { hasError, error } = this.state;
        const { children, remoteName, fallback } = this.props;
        if (hasError) {
            // 커스텀 Fallback이 있으면 사용
            if (fallback) {
                return fallback;
            }
            // 기본 Fallback UI
            return (_jsx(RemoteErrorFallback, { remoteName: remoteName, error: error, onRetry: this.handleRetry }));
        }
        return children;
    }
}
export default RemoteErrorBoundary;
