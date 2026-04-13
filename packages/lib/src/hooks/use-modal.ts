/**
 * Modal Hooks
 * Alert, Confirm 모달 관리
 */

import { useCallback, useState } from 'react';

// 모달 옵션 (Hook용)
export interface SimpleModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

// Alert 모달 결과
export interface AlertModalResult {
  isOpen: boolean;
  options: SimpleModalOptions | null;
  show: (options: SimpleModalOptions | string) => Promise<void>;
  close: () => void;
}

// Confirm 모달 결과
export interface ConfirmModalResult {
  isOpen: boolean;
  options: SimpleModalOptions | null;
  show: (options: SimpleModalOptions | string) => Promise<boolean>;
  close: (confirmed: boolean) => void;
}

/**
 * Alert 모달 Hook
 */
export function useAlertModal(): AlertModalResult {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SimpleModalOptions | null>(null);
  const [resolver, setResolver] = useState<(() => void) | null>(null);

  const show = useCallback((opts: SimpleModalOptions | string): Promise<void> => {
    const modalOptions: SimpleModalOptions = typeof opts === 'string'
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
export function useConfirmModal(): ConfirmModalResult {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<SimpleModalOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const show = useCallback((opts: SimpleModalOptions | string): Promise<boolean> => {
    const modalOptions: SimpleModalOptions = typeof opts === 'string'
      ? { message: opts, confirmText: '확인', cancelText: '취소' }
      : { confirmText: '확인', cancelText: '취소', ...opts };

    setOptions(modalOptions);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const close = useCallback((confirmed: boolean) => {
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
 * KOMCA 패턴 업그레이드: Context 기반으로 커스텀 모달 사용
 *
 * @example
 * const alert = useAsyncAlert();
 * await alert('저장되었습니다.');
 * await alert('오류가 발생했습니다.', '오류');
 */
export function useAsyncAlert() {
  // ModalContext를 직접 import하지 않고 동적으로 가져옴 (순환 참조 방지)
  const getModalContext = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useModalContext } = require('../components/modal/ModalContext');
      return useModalContext();
    } catch {
      return null;
    }
  }, []);

  return useCallback(async (message: string, title?: string): Promise<void> => {
    const context = getModalContext();
    if (context?.alert) {
      return context.alert(message, title);
    }
    // fallback: 브라우저 기본 alert
    alert(title ? `${title}\n\n${message}` : message);
  }, [getModalContext]);
}

/**
 * 비동기 Confirm 모달 - ModalContext 연동
 * KOMCA 패턴 업그레이드: Context 기반으로 커스텀 모달 사용
 *
 * @example
 * const confirm = useAsyncConfirm();
 * const result = await confirm('삭제하시겠습니까?');
 * if (result) {
 *   // 삭제 처리
 * }
 */
export function useAsyncConfirm() {
  const getModalContext = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { useModalContext } = require('../components/modal/ModalContext');
      return useModalContext();
    } catch {
      return null;
    }
  }, []);

  return useCallback(async (message: string, title?: string): Promise<boolean> => {
    const context = getModalContext();
    if (context?.confirm) {
      return context.confirm(message, title);
    }
    // fallback: 브라우저 기본 confirm
    return confirm(title ? `${title}\n\n${message}` : message);
  }, [getModalContext]);
}

// 하위 호환성을 위한 alias
export const useAsyncAlertModal = useAsyncAlert;
export const useAsyncConfirmModal = useAsyncConfirm;