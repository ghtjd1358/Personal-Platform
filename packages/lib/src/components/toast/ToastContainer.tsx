/**
 * Toast Container - KOMCA 패턴
 * 토스트 알림 UI 렌더링
 */

import React from 'react';
import { useToast, ToastType } from './ToastContext';

// 타입별 아이콘
const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
};

// 타입별 색상
const colors: Record<ToastType, { bg: string; border: string; icon: string }> = {
    success: { bg: '#ecfdf5', border: '#10b981', icon: '#059669' },
    error: { bg: '#fef2f2', border: '#ef4444', icon: '#dc2626' },
    warning: { bg: '#fffbeb', border: '#f59e0b', icon: '#d97706' },
    info: { bg: '#eff6ff', border: '#3b82f6', icon: '#2563eb' },
};

interface ToastContainerProps {
    /** 위치 */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ position = 'top-right' }) => {
    const { toasts, removeToast } = useToast();

    const getPositionStyles = (): React.CSSProperties => {
        const base: React.CSSProperties = { position: 'fixed', zIndex: 9998 };

        switch (position) {
            case 'top-left':
                return { ...base, top: 20, left: 20 };
            case 'top-center':
                return { ...base, top: 20, left: '50%', transform: 'translateX(-50%)' };
            case 'bottom-right':
                return { ...base, bottom: 20, right: 20 };
            case 'bottom-left':
                return { ...base, bottom: 20, left: 20 };
            case 'bottom-center':
                return { ...base, bottom: 20, left: '50%', transform: 'translateX(-50%)' };
            case 'top-right':
            default:
                return { ...base, top: 20, right: 20 };
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div style={getPositionStyles()}>
            <div className="toast-list">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast-item toast-${toast.type}`}
                        style={{
                            backgroundColor: colors[toast.type].bg,
                            borderLeftColor: colors[toast.type].border,
                        }}
                    >
                        <div
                            className="toast-icon"
                            style={{ color: colors[toast.type].icon }}
                        >
                            {icons[toast.type]}
                        </div>
                        <div className="toast-content">
                            {toast.title && <div className="toast-title">{toast.title}</div>}
                            <div className="toast-message">{toast.message}</div>
                        </div>
                        <button
                            className="toast-close"
                            onClick={() => removeToast(toast.id)}
                            aria-label="닫기"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <style>{`
                .toast-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    max-width: 380px;
                    width: 100%;
                }

                .toast-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 14px 16px;
                    border-radius: 8px;
                    border-left: 4px solid;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: toast-slide-in 0.3s ease-out;
                }

                @keyframes toast-slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .toast-icon {
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: bold;
                }

                .toast-content {
                    flex: 1;
                    min-width: 0;
                }

                .toast-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 2px;
                }

                .toast-message {
                    font-size: 13px;
                    color: #4b5563;
                    line-height: 1.4;
                    word-break: break-word;
                }

                .toast-close {
                    flex-shrink: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: #9ca3af;
                    font-size: 12px;
                    border-radius: 4px;
                    transition: all 0.15s;
                }

                .toast-close:hover {
                    background: rgba(0, 0, 0, 0.1);
                    color: #374151;
                }
            `}</style>
        </div>
    );
};

export default ToastContainer;
