export interface RemoteErrorFallbackProps {
    /** Remote 앱 이름 (예: "이력서", "블로그") */
    remoteName: string;
    /** 재시도 콜백 */
    onRetry?: () => void;
    /** 에러 메시지 (개발 환경에서만 표시) */
    error?: Error | null;
}
export declare function RemoteErrorFallback({ remoteName, onRetry, error }: RemoteErrorFallbackProps): import("react/jsx-runtime").JSX.Element;
export default RemoteErrorFallback;
//# sourceMappingURL=RemoteErrorFallback.d.ts.map