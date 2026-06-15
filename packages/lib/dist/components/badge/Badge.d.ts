import React from 'react';
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost';
interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    style?: React.CSSProperties;
}
declare const Badge: React.FC<BadgeProps>;
export { Badge };
export type { BadgeProps, BadgeVariant };
//# sourceMappingURL=Badge.d.ts.map