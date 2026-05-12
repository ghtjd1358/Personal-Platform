import { jsx as _jsx } from "react/jsx-runtime";
let keyframesInjected = false;
const injectKeyframes = () => {
    if (typeof document === 'undefined' || keyframesInjected)
        return;
    keyframesInjected = true;
    const style = document.createElement('style');
    style.setAttribute('data-mfa-skeleton', '');
    style.textContent = `
@keyframes mfaSkeletonShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.mfa-skeleton {
    display: inline-block;
    background: linear-gradient(
        90deg,
        rgba(43, 30, 20, 0.05) 0%,
        rgba(43, 30, 20, 0.12) 50%,
        rgba(43, 30, 20, 0.05) 100%
    );
    background-size: 200% 100%;
    animation: mfaSkeletonShimmer 1.4s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
    .mfa-skeleton { animation: none; background: rgba(43, 30, 20, 0.08); }
}
`;
    document.head.appendChild(style);
};
export const Skeleton = ({ variant = 'rect', width = '100%', height = 16, className = '', style, }) => {
    injectKeyframes();
    const radius = variant === 'circle' ? '50%' : variant === 'text' ? '3px' : '4px';
    return (_jsx("span", { className: `mfa-skeleton ${className}`.trim(), "aria-hidden": true, style: {
            width,
            height,
            borderRadius: radius,
            ...style,
        } }));
};
export default Skeleton;
