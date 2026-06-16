import React from 'react';
import { CommonButton } from './CommonButton';

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: () => void;
  disabled?: boolean;
  animating?: boolean;
  showCount?: boolean;
  className?: string;
}

const HeartIcon: React.FC<{ liked: boolean; animating: boolean }> = ({ liked, animating }) => (
  <svg
    className={animating ? 'like-icon animating' : 'like-icon'}
    viewBox="0 0 24 24"
    fill={liked ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    width="18"
    height="18"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const LikeButton: React.FC<LikeButtonProps> = ({
  liked,
  count,
  onToggle,
  disabled = false,
  animating = false,
  showCount = true,
  className = '',
}) => {
  const modifiers = [liked && 'like-button--liked', animating && 'like-button--animating', className]
    .filter(Boolean)
    .join(' ');

  return (
    <CommonButton
      variant="ghost"
      size="sm"
      className={`like-button ${modifiers}`}
      onClick={onToggle}
      disabled={disabled}
      aria-label={liked ? '좋아요 취소' : '좋아요'}
      aria-pressed={liked}
      leftIcon={<HeartIcon liked={liked} animating={animating} />}
    >
      {showCount && <span className="like-count">{count}</span>}
    </CommonButton>
  );
};

export { LikeButton };
