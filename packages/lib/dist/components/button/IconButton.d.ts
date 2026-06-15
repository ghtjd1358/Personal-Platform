import React from 'react';
import { CommonButtonProps } from './CommonButton';
export interface IconButtonProps extends Omit<CommonButtonProps, 'leftIcon' | 'rightIcon' | 'fullWidth'> {
    /** 아이콘 레이블 — 접근성 필수 */
    'aria-label': string;
}
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=IconButton.d.ts.map