import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
const ScrollTopButton = ({ className = '', variant = 'primary', size = 'md', threshold = 100, title = '맨 위로', }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);
    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    const sizeClasses = {
        sm: 'scroll-top-btn--sm',
        md: 'scroll-top-btn--md',
        lg: 'scroll-top-btn--lg',
    };
    const variantClasses = {
        primary: 'scroll-top-btn--primary',
        secondary: 'scroll-top-btn--secondary',
        ghost: 'scroll-top-btn--ghost',
    };
    return (_jsx("button", { type: "button", className: `scroll-top-btn ${sizeClasses[size]} ${variantClasses[variant]} ${isVisible ? 'visible' : ''} ${className}`, onClick: scrollToTop, title: title, "aria-label": title, children: _jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("polyline", { points: "17 11 12 6 7 11" }), _jsx("polyline", { points: "17 18 12 13 7 18" })] }) }));
};
export { ScrollTopButton };
