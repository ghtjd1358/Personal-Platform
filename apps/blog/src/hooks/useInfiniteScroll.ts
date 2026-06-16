import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** 추가 로드 가능 여부 (hasMore) */
  hasMore: boolean;
  /** 추가 로드 중 (isLoadingMore) */
  isLoadingMore: boolean;
  /** 초기 로딩 중 (isLoading) — 첫 데이터 도착 전엔 trigger 비활성화 */
  isLoading: boolean;
  /** 무한스크롤 다음 페이지 로드 콜백 */
  onLoadMore?: () => void;
  /** Intersection Observer rootMargin (기본 200px) */
  rootMargin?: string;
  /** 스크롤 백업 트리거 임계값 — bottom 으로부터 N px (기본 300) */
  scrollThreshold?: number;
}

interface UseInfiniteScrollReturn<T extends HTMLElement = HTMLDivElement> {
  /** PostsSection 의 trigger sentinel 에 부착할 ref */
  observerRef: React.RefObject<T | null>;
}

/**
 * 무한스크롤 비즈니스 로직 hook.
 *
 * - PostsSection 같은 리스트 UI 에서 IntersectionObserver + window scroll fallback 을 분리.
 * - UI 는 props (posts, isLoading, hasMore...) 만 받아 렌더링에 집중.
 *
 * @example
 * const { observerRef } = useInfiniteScroll({ hasMore, isLoadingMore, isLoading, onLoadMore: loadMore });
 * <div ref={observerRef} />
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  hasMore,
  isLoadingMore,
  isLoading,
  onLoadMore,
  rootMargin = '200px 0px',
  scrollThreshold = 300,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn<T> {
  const observerRef = useRef<T>(null);
  const loadMoreRef = useRef(onLoadMore);

  // 최신 onLoadMore 참조 유지 — effect dep 빈도 줄임
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // IntersectionObserver 로 sentinel 노출 시 추가 로드 트리거
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
        rootMargin,
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
  }, [hasMore, isLoadingMore, isLoading, rootMargin]);

  // 스크롤 이벤트 백업 — Observer 가 작동하지 않는 케이스 보완
  const handleScroll = useCallback(() => {
    if (!hasMore || isLoadingMore || isLoading || !loadMoreRef.current) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
      loadMoreRef.current();
    }
  }, [hasMore, isLoadingMore, isLoading, scrollThreshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { observerRef };
}
