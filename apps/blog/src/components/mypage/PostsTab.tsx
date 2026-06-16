import React from 'react';
import { EmptyState, LoadingSpinner } from '@sonhoseong/mfa-lib';
import { PostSummary } from '@/network';
import { PostCard } from '@/components/post/PostCard';

interface PostsTabProps {
  posts: PostSummary[];
  isLoading?: boolean;
}

const PostsTab: React.FC<PostsTabProps> = ({ posts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mypage-content">
        <div className="container">
          <LoadingSpinner message="로딩 중..." />
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mypage-content">
        <div className="container">
          <EmptyState description="작성한 글이 없습니다." />
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-content">
      <div className="container">
        <div className="mypage-posts-grid">
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              animationDelay={index + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { PostsTab };