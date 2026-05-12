/**
 * Modal Hooks
 * Alert, Confirm 모달 관리
 */
export interface SimpleModalOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}
export interface AlertModalResult {
    isOpen: boolean;
    options: SimpleModalOptions | null;
    show: (options: SimpleModalOptions | string) => Promise<void>;
    close: () => void;
}
export interface ConfirmModalResult {
    isOpen: boolean;
    options: SimpleModalOptions | null;
    show: (options: SimpleModalOptions | string) => Promise<boolean>;
    close: (confirmed: boolean) => void;
}
/**
 * Alert 모달 Hook
 */
export declare function useAlertModal(): AlertModalResult;
/**
 * Confirm 모달 Hook
 */
export declare function useConfirmModal(): ConfirmModalResult;
/**
 * 비동기 Alert 모달 - ModalContext 연동
 * 호출처 hook 컴포넌트가 ModalProvider 트리 안에 있어야 함 (host + 4 remote 모두 bootstrap 에서 보장).
 *
 * @example
 * const alert = useAsyncAlert();
 * await alert('저장되었습니다.');
 * await alert('오류가 발생했습니다.', '오류');
 */
export declare function useAsyncAlert(): (message: string, title?: string) => Promise<void>;
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
export declare function useAsyncConfirm(): (message: string, title?: string) => Promise<boolean>;
export declare const useAsyncAlertModal: typeof useAsyncAlert;
export declare const useAsyncConfirmModal: typeof useAsyncConfirm;
//# sourceMappingURL=use-modal.d.ts.map