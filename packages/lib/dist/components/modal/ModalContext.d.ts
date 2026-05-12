/**
 * Modal Context - KOMCA 패턴
 * 전역 모달 상태 관리
 */
import React, { ReactNode } from 'react';
export type ModalType = 'alert' | 'confirm' | 'custom';
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
export interface ModalItem extends ModalOptions {
    id: string;
    resolve?: (value: boolean) => void;
}
interface ModalContextType {
    modals: ModalItem[];
    alert: (message: string, title?: string) => Promise<void>;
    confirm: (message: string, title?: string) => Promise<boolean>;
    openModal: (options: ModalOptions) => string;
    closeModal: (id: string, result?: boolean) => void;
    closeAll: () => void;
}
declare const ModalContext: React.Context<ModalContextType | null>;
interface ModalProviderProps {
    children: ReactNode;
}
/**
 * Modal Provider
 */
export declare const ModalProvider: React.FC<ModalProviderProps>;
/**
 * useModal Hook
 */
export declare const useModalContext: () => ModalContextType;
export default ModalContext;
//# sourceMappingURL=ModalContext.d.ts.map