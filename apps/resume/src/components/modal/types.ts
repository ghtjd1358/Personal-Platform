import React from 'react';

export interface ModalCommonProps {
  id?: string;
  onClose?: () => void;
}

export interface ModalParams<Props extends ModalCommonProps> {
  component: React.ComponentType<Props>;
  props: Props;
}
