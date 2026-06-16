import React from 'react';
import { CommonButton } from './CommonButton';
import { CommonButtonVariant, CommonButtonSize } from './CommonButton';
import { useScrollTop } from '../../hooks/use-scroll-top';

export interface ScrollTopButtonProps {
  className?: string;
  variant?: CommonButtonVariant;
  size?: CommonButtonSize;
  threshold?: number;
  title?: string;
}

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({
  className = '',
  variant = 'ghost',
  size = 'md',
  threshold = 100,
  title = '맨 위로',
}) => {
  const { isVisible, scrollToTop } = useScrollTop(threshold);

  if (!isVisible) return null;

  return (
    <CommonButton
      variant={variant}
      size={size}
      className={`common-btn--icon-only scroll-top-btn ${className}`}
      onClick={scrollToTop}
      aria-label={title}
      title={title}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 11 12 6 7 11" />
        <polyline points="17 18 12 13 7 18" />
      </svg>
    </CommonButton>
  );
};

export { ScrollTopButton };
