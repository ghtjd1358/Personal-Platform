import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Toast Context - KOMCA 패턴
 * 전역 토스트 알림 상태 관리
 */
import { createContext, useContext, useCallback, useState } from 'react';
const ToastContext = createContext(null);
/**
 * Toast Provider
 */
export const ToastProvider = ({ children, defaultDuration = 3000, maxToasts = 5, }) => {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const duration = toast.duration ?? defaultDuration;
        setToasts((prev) => {
            const newToasts = [...prev, { ...toast, id }];
            // 최대 개수 초과 시 오래된 것 제거
            return newToasts.slice(-maxToasts);
        });
        // 자동 제거
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [defaultDuration, maxToasts]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    // 편의 메서드
    const success = useCallback((message, title) => {
        addToast({ type: 'success', message, title });
    }, [addToast]);
    const error = useCallback((message, title) => {
        addToast({ type: 'error', message, title, duration: 5000 });
    }, [addToast]);
    const warning = useCallback((message, title) => {
        addToast({ type: 'warning', message, title });
    }, [addToast]);
    const info = useCallback((message, title) => {
        addToast({ type: 'info', message, title });
    }, [addToast]);
    return (_jsx(ToastContext.Provider, { value: { toasts, addToast, removeToast, success, error, warning, info }, children: children }));
};
/**
 * useToast Hook
 */
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
export default ToastContext;
