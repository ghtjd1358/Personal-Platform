import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CommonButton } from './CommonButton';
import { useScrollTop } from '../../hooks/use-scroll-top';
const ScrollTopButton = ({ className = '', variant = 'ghost', size = 'md', threshold = 100, title = '맨 위로', }) => {
    const { isVisible, scrollToTop } = useScrollTop(threshold);
    if (!isVisible)
        return null;
    return (_jsx(CommonButton, { variant: variant, size: size, className: `common-btn--icon-only scroll-top-btn ${className}`, onClick: scrollToTop, "aria-label": title, title: title, children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("polyline", { points: "17 11 12 6 7 11" }), _jsx("polyline", { points: "17 18 12 13 7 18" })] }) }));
};
export { ScrollTopButton };
