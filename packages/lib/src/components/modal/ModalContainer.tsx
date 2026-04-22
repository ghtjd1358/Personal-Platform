/**
 * Modal Container - KOMCA 패턴
 * 모달 UI 렌더링
 */

import React, { useEffect } from 'react';
import { useModalContext, ModalItem } from './ModalContext';

const ModalContainer: React.FC = () => {
    const { modals, closeModal } = useModalContext();

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [modals.length]);

    if (modals.length === 0) return null;

    const handleOverlayClick = (modal: ModalItem) => {
        if (modal.closeOnOverlayClick !== false) {
            closeModal(modal.id, false);
        }
    };

    const handleConfirm = async (modal: ModalItem) => {
        if (modal.onConfirm) {
            await modal.onConfirm();
        }
        closeModal(modal.id, true);
    };

    const handleCancel = (modal: ModalItem) => {
        modal.onCancel?.();
        closeModal(modal.id, false);
    };

    return (
        <>
            {modals.map((modal, index) => (
                <div
                    key={modal.id}
                    className="modal-overlay"
                    style={{ zIndex: 10000 + index }}
                    onClick={() => handleOverlayClick(modal)}
                >
                    <div
                        className="modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modal.content ? (
                            // 커스텀 컨텐츠
                            modal.content
                        ) : (
                            // 기본 Alert/Confirm UI
                            <>
                                {modal.title && (
                                    <div className="modal-header">
                                        <h3 className="modal-title">{modal.title}</h3>
                                    </div>
                                )}
                                <div className="modal-body">
                                    <p className="modal-message">{modal.message}</p>
                                </div>
                                <div className="modal-footer">
                                    {modal.type === 'confirm' && modal.cancelText && (
                                        <button
                                            className="modal-button secondary"
                                            onClick={() => handleCancel(modal)}
                                        >
                                            {modal.cancelText}
                                        </button>
                                    )}
                                    <button
                                        className="modal-button primary"
                                        onClick={() => handleConfirm(modal)}
                                    >
                                        {modal.confirmText || '확인'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}

            <style>{`
                /* Editorial modal — 한지 cream + 먹 ink + 주홍 accent.
                 * 이전 기본 UI(흰색 bg + 파란 버튼) 는 프로젝트 톤과 충돌해서 전면 교체.
                 */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(43, 30, 20, 0.55);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: modal-fade-in 0.2s ease-out;
                }

                @keyframes modal-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .modal-container {
                    background: #FBF5E3;
                    border: 2px solid #2B1E14;
                    border-radius: 2px;
                    box-shadow:
                        6px 8px 0 rgba(43, 30, 20, 0.22),
                        14px 20px 40px rgba(43, 30, 20, 0.15);
                    min-width: 340px;
                    max-width: 520px;
                    max-height: 90vh;
                    overflow: hidden;
                    animation: modal-slide-up 0.25s cubic-bezier(.2, .7, .2, 1);
                    font-family: 'Pretendard Variable', Pretendard, sans-serif;
                    color: #2B1E14;
                    position: relative;
                }

                /* 종이 grain */
                .modal-container::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(rgba(43, 30, 20, 0.05) 1px, transparent 1px);
                    background-size: 3px 3px;
                    pointer-events: none;
                    opacity: 0.5;
                }

                @keyframes modal-slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(18px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .modal-header {
                    position: relative;
                    padding: 24px 28px 0;
                }

                .modal-header::before {
                    content: 'DIALOG';
                    display: block;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 10px;
                    letter-spacing: 0.22em;
                    color: #8C1E1A;
                    text-transform: uppercase;
                    margin-bottom: 6px;
                }

                .modal-title {
                    margin: 0;
                    font-family: 'Fraunces', 'FallbackFraunces', Georgia, serif;
                    font-weight: 500;
                    font-size: 22px;
                    color: #2B1E14;
                    line-height: 1.25;
                    letter-spacing: -0.005em;
                    font-variation-settings: "opsz" 144, "SOFT" 30;
                }

                .modal-body {
                    position: relative;
                    padding: 16px 28px 22px;
                }

                .modal-message {
                    margin: 0;
                    font-size: 14px;
                    color: #2B1E14;
                    line-height: 1.7;
                    white-space: pre-wrap;
                    font-family: 'Fraunces', 'FallbackFraunces', Georgia, serif;
                    font-style: italic;
                }

                .modal-footer {
                    position: relative;
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding: 16px 28px;
                    background: #F4EAD5;
                    border-top: 1px dashed #D4C4A8;
                }

                .modal-button {
                    padding: 9px 20px;
                    font-family: 'Pretendard Variable', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 2px;
                    border: 1px solid #2B1E14;
                    cursor: pointer;
                    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, color 0.15s ease;
                    line-height: 1;
                }

                .modal-button.primary {
                    background: #2B1E14;
                    color: #FBF5E3;
                }

                .modal-button.primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 2px 3px 0 rgba(43, 30, 20, 0.25);
                    background: #8C1E1A;
                    border-color: #8C1E1A;
                }

                .modal-button.secondary {
                    background: transparent;
                    color: #2B1E14;
                }

                .modal-button.secondary:hover {
                    background: #FBF5E3;
                    color: #8C1E1A;
                    border-color: #8C1E1A;
                }
            `}</style>
        </>
    );
};

export default ModalContainer;
