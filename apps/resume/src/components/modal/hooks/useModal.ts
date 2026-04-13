import { useCallback } from 'react';
import { pushModal, popModal, closeAllModals } from '../modal-manager';
import { ModalCommonProps, ModalParams } from '../types';

export function useModal() {
  const showModal = useCallback(<Props extends ModalCommonProps>(
    modalParams: ModalParams<Props>
  ) => {
    pushModal(modalParams);
  }, []);

  const closeModal = useCallback(() => {
    popModal();
  }, []);

  const closeAll = useCallback(() => {
    closeAllModals();
  }, []);

  return {
    showModal,
    closeModal,
    closeAll,
  };
}
