import React, { useEffect, useState } from 'react';
import { addModalListListener, getModalList } from './modal-manager';
import { ModalParams } from './types';

export function ModalContainer() {
  const [modalList, setModalList] = useState<ModalParams<any>[]>(() => getModalList());

  useEffect(() => {
    return addModalListListener(setModalList);
  }, []);

  return (
    <>
      {modalList.map(({ component: Component, props }) => (
        <Component {...props} key={props.id} />
      ))}
    </>
  );
}
