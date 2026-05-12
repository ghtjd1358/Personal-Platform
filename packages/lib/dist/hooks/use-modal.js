/**
 * Modal Hooks
 * Alert, Confirm 모달 관리
 */
import { useCallback, useState } from 'react';
import { useModalContext } from '../components/modal/ModalContext';
/**
 * Alert 모달 Hook
 */
export function useAlertModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState(null);
    const [resolver, setResolver] = useState(null);
    const show = useCallback((opts) => {
        const modalOptions = typeof opts === 'string'
            ? { message: opts }
            : opts;
        setOptions(modalOptions);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
        setOptions(null);
        if (resolver) {
            resolver();
            setResolver(null);
        }
    }, [resolver]);
    return { isOpen, options, show, close };
}
/**
 * Confirm 모달 Hook
 */
export function useConfirmModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState(null);
    const [resolver, setResolver] = useState(null);
    const show = useCallback((opts) => {
        const modalOptions = typeof opts === 'string'
            ? { message: opts, confirmText: '확인', cancelText: '취소' }
            : { confirmText: '확인', cancelText: '취소', ...opts };
        setOptions(modalOptions);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    }, []);
    const close = useCallback((confirmed) => {
        setIsOpen(false);
        setOptions(null);
        if (resolver) {
            resolver(confirmed);
            setResolver(null);
        }
    }, [resolver]);
    return { isOpen, options, show, close };
}
/**
 * 비동기 Alert 모달 - ModalContext 연동
 * 호출처 hook 컴포넌트가 ModalProvider 트리 안에 있어야 함 (host + 4 remote 모두 bootstrap 에서 보장).
 *
 * @example
 * const alert = useAsyncAlert();
 * await alert('저장되었습니다.');
 * await alert('오류가 발생했습니다.', '오류');
 */
export function useAsyncAlert() {
    // hook 은 render top-level 에서 호출 — useCallback 안에서 호출하면 Rules of Hooks 위반.
    // 이전엔 require() + try/catch 로 감쌌으나 그 안에서 hook 호출이 동작하지 않아 항상 fallback(native alert) 으로 빠지는 버그였음.
    const context = useModalContext();
    return useCallback((message, title) => context.alert(message, title), [context]);
}
/**
 * 비동기 Confirm 모달 - ModalContext 연동
 *
 * @example
 * const confirm = useAsyncConfirm();
 * const result = await confirm('삭제하시겠습니까?');
 * if (result) {
 *   // 삭제 처리
 * }
 */
export function useAsyncConfirm() {
    const context = useModalContext();
    return useCallback((message, title) => context.confirm(message, title), [context]);
}
// 하위 호환성을 위한 alias
export const useAsyncAlertModal = useAsyncAlert;
export const useAsyncConfirmModal = useAsyncConfirm;
