/**
 * RemoteErrorBoundary
 * Remote 앱 로드 실패 시 에러를 캡처하고 Fallback UI 표시
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
export interface RemoteErrorBoundaryProps {
    /** 자식 요소 (Remote 앱) */
    children: ReactNode;
    /** Remote 앱 이름 (Fallback UI에 표시) */
    remoteName: string;
    /** 커스텀 Fallback 컴포넌트 */
    fallback?: ReactNode;
    /** 에러 발생 시 콜백 */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface RemoteErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
export declare class RemoteErrorBoundary extends Component<RemoteErrorBoundaryProps, RemoteErrorBoundaryState> {
    constructor(props: RemoteErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): RemoteErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    handleRetry: () => void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export default RemoteErrorBoundary;
//# sourceMappingURL=RemoteErrorBoundary.d.ts.map