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
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: modal-fade-in 0.2s ease-out;
                }

                @keyframes modal-fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .modal-container {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    min-width: 320px;
                    max-width: 480px;
                    max-height: 90vh;
                    overflow: hidden;
                    animation: modal-slide-up 0.2s ease-out;
                }

                @keyframes modal-slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    padding: 20px 24px 0;
                }

                .modal-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #111827;
                }

                .modal-body {
                    padding: 16px 24px 24px;
                }

                .modal-message {
                    margin: 0;
                    font-size: 14px;
                    color: #4b5563;
                    line-height: 1.6;
                    white-space: pre-wrap;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    padding: 16px 24px;
                    background: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                }

                .modal-button {
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: 500;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.15s;
                }

                .modal-button.primary {
                    background: #3b82f6;
                    color: white;
                    border: none;
                }

                .modal-button.primary:hover {
                    background: #2563eb;
                }

                .modal-button.secondary {
                    background: white;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .modal-button.secondary:hover {
                    background: #f3f4f6;
                }
            `}</style>
        </>
    );
};

export default ModalContainer;
