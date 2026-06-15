import React from 'react';

export interface ButtonGroupProps {
  children: React.ReactNode;
  /** 버튼 간 간격 */
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  /** 배치 방향 */
  direction?: 'row' | 'column';
  /** 오른쪽 정렬 */
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  gap = 'sm',
  direction = 'row',
  align = 'start',
  className = '',
}) => (
  <div className={`btn-group btn-group--gap-${gap} btn-group--${direction} btn-group--align-${align} ${className}`}>
    {children}
  </div>
);

ButtonGroup.displayName = 'Button.Group';
