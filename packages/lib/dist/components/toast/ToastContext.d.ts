/**
 * Toast Context - KOMCA 패턴
 * 전역 토스트 알림 상태 관리
 */
import React, { ReactNode } from 'react';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
}
interface ToastContextType {
    toasts: ToastItem[];
    addToast: (toast: Omit<ToastItem, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
}
declare const ToastContext: React.Context<ToastContextType | null>;
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
export declare const ToastProvider: React.FC<ToastProviderProps>;
/**
 * useToast Hook
 */
export declare const useToast: () => ToastContextType;
export default ToastContext;
//# sourceMappingURL=ToastContext.d.ts.map