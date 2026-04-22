/**
 * LikeButton - 포트폴리오 좋아요 버튼 컴포넌트
 *
 * Optimistic Update 패턴으로 즉시 피드백 제공
 */

import React from 'react';
import { useToast } from '@sonhoseong/mfa-lib';
import { useLike } from '@/hooks';

interface LikeButtonProps {
  portfolioId: string;
  userId?: string | null;
  initialLikeCount?: number;
  showCount?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  portfolioId,
  userId,
  initialLikeCount = 0,
  showCount = true,
}) => {
  const toast = useToast();
  const { isLiked, likeCount, isLoading, isToggling, toggle } = useLike({
    portfolioId,
    userId,
    initialLikeCount,
  });

  const handleClick = () => {
    if (!userId) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    toggle();
  };

  return (
    <button
      className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
      onClick={handleClick}
      disabled={isLoading || isToggling}
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        className={isToggling ? 'like-icon animating' : 'like-icon'}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {showCount && <span className="like-count">{likeCount}</span>}
    </button>
  );
};

export default LikeButton;
