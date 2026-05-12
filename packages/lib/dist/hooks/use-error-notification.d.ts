/**
 * Error Notification Hook
 * API 에러 발생시 자동 알림
 */
import { ErrorDetail } from '../network/axios-factory';
export interface ErrorEvent {
    errorDetails: ErrorDetail[];
}
/**
 * 에러 이벤트 발생
 */
export declare function dispatchErrorEvent(errorDetails: ErrorDetail[]): void;
/**
 * 에러 알림 Hook
 */
export declare function useErrorNotification(onError?: (errorDetails: ErrorDetail[]) => void): void;
/**
 * 에러 메시지 포맷팅
 */
export declare function formatErrorDetails(errorDetails: ErrorDetail[]): string;
/**
 * Custom Event 유틸리티
 */
export declare const customEvents: {
    dispatchError: typeof dispatchErrorEvent;
    dispatchSearch: (id?: string) => void;
    onSearch: (callback: (id?: string) => void) => () => void;
};
//# sourceMappingURL=use-error-notification.d.ts.map