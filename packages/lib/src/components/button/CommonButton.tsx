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
import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import './CommonButton.css';

export type CommonButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'text';
export type CommonButtonSize = 'sm' | 'md' | 'lg';

export interface CommonButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    /** 색상 의미. editorial 팔레트 매핑 — primary(먹), secondary(한지 outline), ghost(투명), danger(주홍), text(밑줄만) */
    variant?: CommonButtonVariant;
    /** 크기 프리셋 — sm/md/lg 중 택일 */
    size?: CommonButtonSize;
    /** 부모 폭 가득 채움 */
    fullWidth?: boolean;
    /** 로딩 상태 — spinner 표시 + 자동 disabled */
    loading?: boolean;
    /** 왼쪽 아이콘 슬롯 */
    leftIcon?: ReactNode;
    /** 오른쪽 아이콘 슬롯 */
    rightIcon?: ReactNode;
    /** 추가 className — escape hatch. 남용 금지 (색상/크기는 prop 으로) */
    className?: string;
}

export const CommonButton = forwardRef<HTMLButtonElement, CommonButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            loading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            className = '',
            ...rest
        },
        ref,
    ) => {
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

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                aria-busy={loading || undefined}
                {...rest}
            >
                {loading && <span className="common-btn__spinner" aria-hidden />}
                {!loading && leftIcon && <span className="common-btn__icon">{leftIcon}</span>}
                <span className="common-btn__label">{children}</span>
                {!loading && rightIcon && <span className="common-btn__icon">{rightIcon}</span>}
            </button>
        );
    },
);

CommonButton.displayName = 'CommonButton';
