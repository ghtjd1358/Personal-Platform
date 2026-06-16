import React from 'react';
import { EmptyState, LoadingSpinner } from '@sonhoseong/mfa-lib';
import { PostSummary } from "@/network";
import { PostCard } from "@/components/post/PostCard";
import { PostCardSkeleton } from "@/components/post/PostCardSkeleton";
import { useInfiniteScroll } from "@/hooks";

const SKELETON_COUNT = 8;

type SortField = 'date' | 'views' | 'likes';
type SortDir = 'desc' | 'asc';

interface PostsSectionProps {
  posts: PostSummary[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  sortField?: SortField;
  sortDir?: SortDir;
}

const SORT_LABEL: Record<SortField, string> = {
  date: '작성일',
  views: '조회수',
  likes: '좋아요',
};

const PostsSection: React.FC<PostsSectionProps> = ({
  posts,
  isLoading,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  sortField = 'date',
  sortDir = 'desc',
}) => {
  const { observerRef } = useInfiniteScroll({
    hasMore,
    isLoadingMore,
    isLoading,
    onLoadMore,
  });

  return (
    <section id="posts" className="section">
      <div className="container">
        <div className="posts-section-eyebrow">
          POSTS · {SORT_LABEL[sortField]} {sortDir === 'desc' ? '내림차순' : '오름차순'}
        </div>

        <div className="blog-grid">
          {isLoading && posts.length === 0 ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <PostCardSkeleton key={`skeleton-${i}`} />
            ))
          ) : !isLoading && posts.length === 0 ? (
            <EmptyState description="아직 게시된 글이 없습니다." />
          ) : (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                animationDelay={index < 20 ? index + 1 : 0}
              />
            ))
          )}
        </div>

        {!isLoading && hasMore && (
          <div ref={observerRef} className="infinite-scroll-trigger">
            {isLoadingMore ? (
              <LoadingSpinner message="더 불러오는 중..." className="loading-more" />
            ) : (
              <div className="scroll-hint">스크롤하여 더 보기</div>
            )}
          </div>
        )}

        {!isLoading && !hasMore && posts.length > 0 && (
          <div className="end-of-list">
            <span>모든 글을 불러왔습니다</span>
          </div>
        )}
      </div>
    </section>
  );
};

export { PostsSection };
