import { jsx as _jsx } from "react/jsx-runtime";
const VARIANT_STYLES = {
    default: { background: 'var(--badge-bg, #f1f5f9)', color: 'var(--badge-color, #64748b)' },
    primary: { background: 'var(--color-primary, #0ea5e9)', color: '#fff' },
    success: { background: 'rgba(34,197,94,0.15)', color: '#16a34a' },
    warning: { background: 'rgba(234,179,8,0.15)', color: '#ca8a04' },
    danger: { background: 'rgba(239,68,68,0.15)', color: '#dc2626' },
    info: { background: 'rgba(99,102,241,0.15)', color: '#6366f1' },
    ghost: { background: 'transparent', border: '1px solid currentColor', color: 'var(--color-text-secondary, #8B7355)' },
};
const Badge = ({ children, variant = 'default', className = '', style }) => (_jsx("span", { className: `lib-badge lib-badge--${variant} ${className}`, style: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 4,
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
        ...VARIANT_STYLES[variant],
        ...style,
    }, children: children }));
export { Badge };
