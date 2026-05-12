import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Modal Container - KOMCA 패턴
 * 모달 UI 렌더링
 */
import { useEffect } from 'react';
import { useModalContext } from './ModalContext';
const ModalContainer = () => {
    const { modals, closeModal } = useModalContext();
    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && modals.length > 0) {
                const lastModal = modals[modals.length - 1];
                closeModal(lastModal.id, false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [modals, closeModal]);
    // 모달 열렸을 때 body 스크롤 방지
    useEffect(() => {
        if (modals.length > 0) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [modals.length]);
    if (modals.length === 0)
        return null;
    const handleOverlayClick = (modal) => {
        if (modal.closeOnOverlayClick !== false) {
            closeModal(modal.id, false);
        }
    };
    const handleConfirm = async (modal) => {
        if (modal.onConfirm) {
            await modal.onConfirm();
        }
        closeModal(modal.id, true);
    };
    const handleCancel = (modal) => {
        modal.onCancel?.();
        closeModal(modal.id, false);
    };
    return (_jsxs(_Fragment, { children: [modals.map((modal, index) => (_jsx("div", { className: "mfa-modal-overlay", style: { zIndex: 10000 + index }, onClick: () => handleOverlayClick(modal), children: _jsx("div", { className: "mfa-modal-container", onClick: (e) => e.stopPropagation(), children: modal.content ? (
                    // 커스텀 컨텐츠
                    modal.content) : (
                    // 기본 Alert/Confirm UI
                    _jsxs(_Fragment, { children: [modal.title && (_jsx("div", { className: "mfa-modal-header", children: _jsx("h3", { className: "mfa-modal-title", children: modal.title }) })), _jsx("div", { className: "mfa-modal-body", children: _jsx("p", { className: "mfa-modal-message", children: modal.message }) }), _jsxs("div", { className: "mfa-modal-footer", children: [modal.type === 'confirm' && modal.cancelText && (_jsx("button", { className: "mfa-modal-button secondary", onClick: () => handleCancel(modal), children: modal.cancelText })), _jsx("button", { className: "mfa-modal-button primary", onClick: () => handleConfirm(modal), children: modal.confirmText || '확인' })] })] })) }) }, modal.id))), _jsx("style", { children: `
                /* Editorial modal — token 화. 각 remote 가 :root 에서 --mfa-modal-* 만 override 하면
                 * 자기 컨셉(blog 한지/주홍, portfolio 한지/주홍, resume 한지/먹, techblog 별도 톤 등)
                 * 으로 달라짐. fallback 값은 blog editorial(한지+먹+주홍).
                 */
                .mfa-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--mfa-mfa-modal-overlay-bg, rgba(43, 30, 20, 0.55));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: mfa-modal-fade-in 0.2s ease-out;
                }

                @keyframes mfa-modal-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .mfa-modal-container {
                    background: var(--mfa-modal-bg, #FBF5E3);
                    border: 2px solid var(--mfa-modal-ink, #2B1E14);
                    border-radius: var(--mfa-modal-radius, 2px);
                    box-shadow:
                        6px 8px 0 var(--mfa-modal-ink-shadow, rgba(43, 30, 20, 0.22)),
                        14px 20px 40px rgba(43, 30, 20, 0.15);
                    min-width: 340px;
                    max-width: 520px;
                    max-height: 90vh;
                    overflow: hidden;
                    animation: mfa-modal-slide-up 0.25s cubic-bezier(.2, .7, .2, 1);
                    font-family: var(--mfa-modal-font-body, 'Pretendard Variable', Pretendard, sans-serif);
                    color: var(--mfa-modal-ink, #2B1E14);
                    position: relative;
                }

                /* 종이 grain */
                .mfa-modal-container::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(var(--mfa-modal-ink-shadow, rgba(43, 30, 20, 0.05)) 1px, transparent 1px);
                    background-size: 3px 3px;
                    pointer-events: none;
                    opacity: 0.5;
                }

                @keyframes mfa-modal-slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(18px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .mfa-modal-header {
                    position: relative;
                    padding: 24px 28px 0;
                }

                .mfa-modal-header::before {
                    content: var(--mfa-modal-eyebrow, 'DIALOG');
                    display: block;
                    font-family: var(--mfa-modal-font-mono, 'JetBrains Mono', monospace);
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    color: var(--mfa-modal-accent, #8C1E1A);
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }

                .mfa-modal-title {
                    margin: 0;
                    font-family: var(--mfa-modal-font-display, 'Fraunces', 'FallbackFraunces', Georgia, serif);
                    font-weight: 500;
                    font-size: 22px;
                    color: var(--mfa-modal-ink, #2B1E14);
                    line-height: 1.25;
                    letter-spacing: -0.005em;
                    font-variation-settings: "opsz" 144, "SOFT" 30;
                }

                .mfa-modal-body {
                    position: relative;
                    padding: 16px 24px 22px;
                }

                .mfa-modal-message {
                    margin: 0;
                    width: 100%;
                    font-size: 15px;
                    color: var(--mfa-modal-ink, #2B1E14);
                    line-height: 1.7;
                    white-space: pre-wrap;
                    word-break: keep-all;
                    font-family: var(--mfa-modal-font-display, 'Fraunces', 'FallbackFraunces', Georgia, serif);
                    font-style: italic;
                }

                .mfa-modal-footer {
                    position: relative;
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding: 16px 28px;
                    background: var(--mfa-modal-bg-secondary, #F4EAD5);
                    border-top: 1px dashed var(--mfa-modal-line, #D4C4A8);
                }

                .mfa-modal-button {
                    padding: 9px 20px;
                    font-family: var(--mfa-modal-font-body, 'Pretendard Variable', sans-serif);
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: var(--mfa-modal-radius, 2px);
                    border: 1px solid var(--mfa-modal-ink, #2B1E14);
                    cursor: pointer;
                    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
                    line-height: 1;
                }

                .mfa-modal-button.primary {
                    background: var(--mfa-modal-ink, #2B1E14);
                    color: var(--mfa-modal-bg, #FBF5E3);
                }

                .mfa-modal-button.primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 2px 3px 0 var(--mfa-modal-ink-shadow, rgba(43, 30, 20, 0.25));
                    background: var(--mfa-modal-accent, #8C1E1A);
                    border-color: var(--mfa-modal-accent, #8C1E1A);
                }

                .mfa-modal-button.secondary {
                    background: transparent;
                    color: var(--mfa-modal-ink, #2B1E14);
                }

                .mfa-modal-button.secondary:hover {
                    background: var(--mfa-modal-bg, #FBF5E3);
                    color: var(--mfa-modal-accent, #8C1E1A);
                    border-color: var(--mfa-modal-accent, #8C1E1A);
                }
            ` })] }));
};
export default ModalContainer;
