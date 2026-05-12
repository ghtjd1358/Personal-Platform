import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useToast } from './ToastContext';
// 타입별 아이콘
const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
};
// 타입별 색상
const colors = {
    success: { bg: '#ecfdf5', border: '#10b981', icon: '#059669' },
    error: { bg: '#fef2f2', border: '#ef4444', icon: '#dc2626' },
    warning: { bg: '#fffbeb', border: '#f59e0b', icon: '#d97706' },
    info: { bg: '#eff6ff', border: '#3b82f6', icon: '#2563eb' },
};
const ToastContainer = ({ position = 'top-right' }) => {
    const { toasts, removeToast } = useToast();
    const getPositionStyles = () => {
        const base = { position: 'fixed', zIndex: 9998 };
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
    if (toasts.length === 0)
        return null;
    return (_jsxs("div", { style: getPositionStyles(), children: [_jsx("div", { className: "toast-list", children: toasts.map((toast) => (_jsxs("div", { className: `toast-item toast-${toast.type}`, style: {
                        backgroundColor: colors[toast.type].bg,
                        borderLeftColor: colors[toast.type].border,
                    }, children: [_jsx("div", { className: "toast-icon", style: { color: colors[toast.type].icon }, children: icons[toast.type] }), _jsxs("div", { className: "toast-content", children: [toast.title && _jsx("div", { className: "toast-title", children: toast.title }), _jsx("div", { className: "toast-message", children: toast.message })] }), _jsx("button", { className: "toast-close", onClick: () => removeToast(toast.id), "aria-label": "\uB2EB\uAE30", children: "\u2715" })] }, toast.id))) }), _jsx("style", { children: `
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
            ` })] }));
};
export default ToastContainer;
