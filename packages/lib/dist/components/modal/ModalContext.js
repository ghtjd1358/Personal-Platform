import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Modal Context - KOMCA 패턴
 * 전역 모달 상태 관리
 */
import { createContext, useContext, useCallback, useState } from 'react';
const ModalContext = createContext(null);
/**
 * Modal Provider
 */
export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState([]);
    const openModal = useCallback((options) => {
        const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setModals((prev) => [...prev, { ...options, id }]);
        return id;
    }, []);
    const closeModal = useCallback((id, result = false) => {
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
    const alert = useCallback((message, title) => {
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
    const confirm = useCallback((message, title) => {
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
    return (_jsx(ModalContext.Provider, { value: { modals, alert, confirm, openModal, closeModal, closeAll }, children: children }));
};
/**
 * useModal Hook
 */
export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};
export default ModalContext;
