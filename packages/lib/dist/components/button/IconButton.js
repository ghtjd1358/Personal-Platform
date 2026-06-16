import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { CommonButton } from './CommonButton';
export const IconButton = forwardRef(({ variant = 'ghost', size = 'md', className = '', children, ...rest }, ref) => (_jsx(CommonButton, { ref: ref, variant: variant, size: size, className: `common-btn--icon-only ${className}`, ...rest, children: children })));
IconButton.displayName = 'Button.Icon';
