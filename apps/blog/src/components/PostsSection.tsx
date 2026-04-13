import React, { useEffect, useRef, useCallback } from 'react';
import {PostSummary} from "@/network";
import {PostCardSkeleton} from "@/components/PostCardSkeleton";
import {PostCard} from "@/components/PostCard";
import {DeferredComponent} from "@/components/DeferredComponent";


interface PostsSectionProps {
  posts: PostSummary[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const PostsSection: React.FC<PostsSectionProps> = ({ 
  posts, 
  isLoading, 
  isLoadingMore = false,
  hasMore = false,
  onLoadMore 
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(onLoadMore);

  // 최신 onLoadMore 참조 유지
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Intersection Observer로 무한스크롤 구현
  useEffect(() => {
    if (!hasMore || isLoadingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && loadMoreRef.current) {
          loadMoreRef.current();
        }
      },
      { 
        threshold: 0,
        rootMargin: '200px 0px'
      }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, isLoading]);

  // 스크롤 이벤트 백업 (Observer가 작동하지 않는 경우)
  const handleScroll = useCallback(() => {
    if (!hasMore || isLoadingMore || isLoading || !loadMoreRef.current) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    
    // 하단에서 300px 이내일 때 로드
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      loadMoreRef.current();
    }
  }, [hasMore, isLoadingMore, isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section id="posts" className="section">
      <div className="container">
        <div className="section-header animate-on-scroll">
          <div className="section-label">최근 포스트</div>
          <h2 className="section-title">블로그 글 목록</h2>
        </div>

        <div className="blog-grid">
          {isLoading ? (
            <DeferredComponent>
              <PostCardSkeleton count={20} />
            </DeferredComponent>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p>아직 게시된 글이 없습니다.</p>
            </div>
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

        {/* 무한스크롤 로딩 인디케이터 */}
        {!isLoading && hasMore && (
          <div ref={observerRef} className="infinite-scroll-trigger">
            {isLoadingMore ? (
              <div className="loading-more">
                <div className="loading-spinner" />
                <span>더 불러오는 중...</span>
              </div>
            ) : (
              <div className="scroll-hint">스크롤하여 더 보기</div>
            )}
          </div>
        )}

        {/* 모든 데이터 로드 완료 */}
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
