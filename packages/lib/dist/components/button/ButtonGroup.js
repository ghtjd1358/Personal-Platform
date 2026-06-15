import { jsx as _jsx } from "react/jsx-runtime";
export const ButtonGroup = ({ children, gap = 'sm', direction = 'row', align = 'start', className = '', }) => (_jsx("div", { className: `btn-group btn-group--gap-${gap} btn-group--${direction} btn-group--align-${align} ${className}`, children: children }));
ButtonGroup.displayName = 'Button.Group';
