/**
 * LikeButton - 포트폴리오 좋아요 컨테이너.
 *
 * lib 의 LikeButton (presentational) + useLike hook (state) 연결.
 * Optimistic Update 패턴으로 즉시 피드백 제공.
 */

import React from 'react';
import { LikeButton as LibLikeButton, useToast } from '@sonhoseong/mfa-lib';
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
    <LibLikeButton
      liked={isLiked}
      count={likeCount}
      animating={isToggling}
      disabled={isLoading}
      showCount={showCount}
      onToggle={handleClick}
      className="action-btn like-btn"
    />
  );
};

export default LikeButton;
