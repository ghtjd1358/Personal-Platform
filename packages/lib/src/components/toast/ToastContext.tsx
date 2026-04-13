/**
 * Toast Context - KOMCA 패턴
 * 전역 토스트 알림 상태 관리
 */

import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';

// Toast 타입
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast 아이템
export interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
}

// Toast Context 타입
interface ToastContextType {
    toasts: ToastItem[];
    addToast: (toast: Omit<ToastItem, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Provider Props
interface ToastProviderProps {
    children: ReactNode;
    /** 기본 표시 시간 (ms) */
    defaultDuration?: number;
    /** 최대 표시 개수 */
    maxToasts?: number;
}

/**
 * Toast Provider
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
    children,
    defaultDuration = 3000,
    maxToasts = 5,
}) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
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

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // 편의 메서드
    const success = useCallback((message: string, title?: string) => {
        addToast({ type: 'success', message, title });
    }, [addToast]);

    const error = useCallback((message: string, title?: string) => {
        addToast({ type: 'error', message, title, duration: 5000 });
    }, [addToast]);

    const warning = useCallback((message: string, title?: string) => {
        addToast({ type: 'warning', message, title });
    }, [addToast]);

    const info = useCallback((message: string, title?: string) => {
        addToast({ type: 'info', message, title });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
        </ToastContext.Provider>
    );
};

/**
 * useToast Hook
 */
export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastContext;
