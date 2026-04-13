import { Dispatch } from 'react';
import { ModalCommonProps, ModalParams } from './types';

let modalId = 0;
const listeners: Dispatch<ModalParams<any>[]>[] = [];
const modalList: ModalParams<any>[] = [];

function notify() {
  listeners.forEach(dispatch => dispatch([...modalList]));
}

export function pushModal<Props extends ModalCommonProps>(modalParams: ModalParams<Props>) {
  const { component, props } = modalParams;
  const id = `modal-${++modalId}`;
  modalList.push({
    component,
    props: { ...props, id },
  });
  notify();
}

export function popModal() {
  if (modalList.length > 0) {
    modalList.pop();
    notify();
  }
}

export function closeAllModals() {
  modalList.length = 0;
  notify();
}

export function
addModalListListener(listener: Dispatch<ModalParams<any>[]>) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}

export function getModalList() {
  return [...modalList];
}
