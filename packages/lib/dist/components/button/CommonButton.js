import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * CommonButton — 모든 버튼 UI 의 단일 구현.
 *
 * 철학:
 *  - 선언적: variant/size/fullWidth/loading 등 props 로 "무엇" 만 표현. "어떻게" 는 CSS.
 *  - color/size/disabled: 미리 정해진 토큰으로만 — 자유 inline color 금지.
 *  - 복잡한 조건부 렌더(예: role 분기, side-effect) 는 이 컴포넌트에 넣지 말고
 *    바깥에서 wrapper 컴포넌트로 조합. CommonButton 은 순수 UI.
 *
 * 예시:
 *   function SubmitButton() {
 *     const isViewer = useRole() === 'viewer';
 *     return isViewer ? <ViewerSubmit /> : <AdminSubmit />;
 *   }
 *   function ViewerSubmit() { return <CommonButton variant="ghost" disabled>Submit</CommonButton>; }
 *   function AdminSubmit() {
 *     useEffect(() => showButtonAnimation(), []);
 *     return <CommonButton variant="primary" type="submit">Submit</CommonButton>;
 *   }
 */
import { forwardRef } from 'react';
import './CommonButton.css';
export const CommonButton = forwardRef(({ variant = 'primary', size = 'md', fullWidth = false, loading = false, leftIcon, rightIcon, disabled, children, className = '', ...rest }, ref) => {
    const classes = [
        'common-btn',
        `common-btn--variant-${variant}`,
        `common-btn--size-${size}`,
        fullWidth && 'common-btn--full',
        loading && 'common-btn--loading',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsxs("button", { ref: ref, className: classes, disabled: disabled || loading, "aria-busy": loading || undefined, ...rest, children: [loading && _jsx("span", { className: "common-btn__spinner", "aria-hidden": true }), !loading && leftIcon && _jsx("span", { className: "common-btn__icon", children: leftIcon }), _jsx("span", { className: "common-btn__label", children: children }), !loading && rightIcon && _jsx("span", { className: "common-btn__icon", children: rightIcon })] }));
});
CommonButton.displayName = 'CommonButton';
