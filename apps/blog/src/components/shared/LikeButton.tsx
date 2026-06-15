import React from 'react';
import { LikeButton as LibLikeButton } from '@sonhoseong/mfa-lib';
import { useLikeToggle } from '@/hooks';

interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
  onLikeChange?: (liked: boolean, count: number) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikeCount, onLikeChange }) => {
  const { liked, likeCount, animating, handleLike } = useLikeToggle({
    postId,
    initialLikeCount,
    onLikeChange,
  });

  return (
    <LibLikeButton
      liked={liked}
      count={likeCount}
      animating={animating}
      onToggle={handleLike}
    />
  );
};

export { LikeButton };
