/**
 * ErrorBoundary - KOMCA 패턴
 * 에러 발생 시 Fallback UI 표시
 */
import { Component, ErrorInfo, ReactNode } from 'react';
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
declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    resetError: () => void;
    render(): ReactNode;
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map