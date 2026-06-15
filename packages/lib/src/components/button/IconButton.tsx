import React, { forwardRef } from 'react';
import { CommonButton, CommonButtonProps } from './CommonButton';

export interface IconButtonProps extends Omit<CommonButtonProps, 'leftIcon' | 'rightIcon' | 'fullWidth'> {
  /** 아이콘 레이블 — 접근성 필수 */
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', className = '', children, ...rest }, ref) => (
    <CommonButton
      ref={ref}
      variant={variant}
      size={size}
      className={`common-btn--icon-only ${className}`}
      {...rest}
    >
      {children}
    </CommonButton>
  ),
);

IconButton.displayName = 'Button.Icon';
