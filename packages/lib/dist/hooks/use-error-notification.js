/**
 * Error Notification Hook
 * API 에러 발생시 자동 알림
 */
import { useEffect } from 'react';
// 에러 이벤트 이름
const ERROR_EVENT_NAME = 'mfa:api-error';
/**
 * 에러 이벤트 발생
 */
export function dispatchErrorEvent(errorDetails) {
    const event = new CustomEvent(ERROR_EVENT_NAME, {
        detail: { errorDetails },
    });
    window.dispatchEvent(event);
}
/**
 * 에러 알림 Hook
 */
export function useErrorNotification(onError) {
    useEffect(() => {
        const handleError = (event) => {
            const { errorDetails } = event.detail;
            if (onError) {
                onError(errorDetails);
            }
            else {
                // 기본 에러 처리
                const messages = errorDetails.map((detail) => {
                    if (detail.field) {
                        return `[${detail.field}] ${detail.message || detail.code}`;
                    }
                    return detail.message || detail.code;
                });
                console.error('[API Error]', messages.join('\n'));
                // alert(messages.join('\n'));
            }
        };
        window.addEventListener(ERROR_EVENT_NAME, handleError);
        return () => {
            window.removeEventListener(ERROR_EVENT_NAME, handleError);
        };
    }, [onError]);
}
/**
 * 에러 메시지 포맷팅
 */
export function formatErrorDetails(errorDetails) {
    return errorDetails
        .map((detail) => {
        switch (detail.code) {
            case 'NotBlank':
                return `${detail.field || '필드'}은(는) 필수 입력입니다.`;
            case 'NotNull':
                return `${detail.field || '필드'}은(는) 필수 입력입니다.`;
            case 'Pattern':
                return `${detail.field || '필드'} 형식이 올바르지 않습니다.`;
            case 'Min':
                return `${detail.field || '값'}이 최소값보다 작습니다.`;
            case 'Max':
                return `${detail.field || '값'}이 최대값을 초과했습니다.`;
            case 'Size':
                return `${detail.field || '값'} 길이가 허용 범위를 벗어났습니다.`;
            case 'TYPE_MISMATCH':
                return `${detail.field || '필드'} 타입이 올바르지 않습니다.`;
            default:
                return detail.message || '알 수 없는 오류가 발생했습니다.';
        }
    })
        .join('\n');
}
/**
 * Custom Event 유틸리티
 */
export const customEvents = {
    // 에러 이벤트 발생
    dispatchError: dispatchErrorEvent,
    // 검색 이벤트 발생
    dispatchSearch: (id) => {
        const event = new CustomEvent('mfa:search', { detail: { id } });
        window.dispatchEvent(event);
    },
    // 검색 이벤트 구독
    onSearch: (callback) => {
        const handler = (event) => {
            callback(event.detail.id);
        };
        window.addEventListener('mfa:search', handler);
        return () => window.removeEventListener('mfa:search', handler);
    },
};
