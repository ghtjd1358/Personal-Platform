/**
 * Modal Context - KOMCA 패턴
 * 전역 모달 상태 관리
 */

import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';

// 모달 타입
export type ModalType = 'alert' | 'confirm' | 'custom';

// 모달 옵션
export interface ModalOptions {
    type: ModalType;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    content?: ReactNode;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    closeOnOverlayClick?: boolean;
}

// 모달 아이템
export interface ModalItem extends ModalOptions {
    id: string;
    resolve?: (value: boolean) => void;
}

// Context 타입
interface ModalContextType {
    modals: ModalItem[];
    alert: (message: string, title?: string) => Promise<void>;
    confirm: (message: string, title?: string) => Promise<boolean>;
    openModal: (options: ModalOptions) => string;
    closeModal: (id: string, result?: boolean) => void;
    closeAll: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
    children: ReactNode;
}

/**
 * Modal Provider
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modals, setModals] = useState<ModalItem[]>([]);

    const openModal = useCallback((options: ModalOptions): string => {
        const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setModals((prev) => [...prev, { ...options, id }]);
        return id;
    }, []);

    const closeModal = useCallback((id: string, result: boolean = false) => {
        setModals((prev) => {
            const modal = prev.find((m) => m.id === id);
            if (modal?.resolve) {
                modal.resolve(result);
            }
            return prev.filter((m) => m.id !== id);
        });
    }, []);

    const closeAll = useCallback(() => {
        setModals((prev) => {
            prev.forEach((modal) => modal.resolve?.(false));
            return [];
        });
    }, []);

    const alert = useCallback((message: string, title?: string): Promise<void> => {
        return new Promise((resolve) => {
            const id = `modal-${Date.now()}`;
            setModals((prev) => [
                ...prev,
                {
                    id,
                    type: 'alert',
                    title: title || '알림',
                    message,
                    confirmText: '확인',
                    resolve: () => resolve(),
                },
            ]);
        });
    }, []);

    const confirm = useCallback((message: string, title?: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const id = `modal-${Date.now()}`;
            setModals((prev) => [
                ...prev,
                {
                    id,
                    type: 'confirm',
                    title: title || '확인',
                    message,
                    confirmText: '확인',
                    cancelText: '취소',
                    resolve,
                },
            ]);
        });
    }, []);

    return (
        <ModalContext.Provider value={{ modals, alert, confirm, openModal, closeModal, closeAll }}>
            {children}
        </ModalContext.Provider>
    );
};

/**
 * useModal Hook
 */
export const useModalContext = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};

export default ModalContext;
