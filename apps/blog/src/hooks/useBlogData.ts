import { useEffect, useState, useCallback, useRef } from 'react';
import {getPosts, getSeries, PostSummary, SeriesDetail} from "@/network";
import type { PostSortOption } from '@/network/apis/post/types/response/post-search-condition';

interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  daysRunning: number;
}

interface BlogDataOptions {
  limit?: number;
  categoryId?: string | null;
  tagId?: string | null;
  search?: string;
  sort?: PostSortOption;
}

interface BlogData {
  posts: PostSummary[];
  series: SeriesDetail[];
  stats: BlogStats;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

/**
 * 블로그 데이터(포스트, 시리즈, 통계)를 페칭하는 훅 (무한스크롤 지원)
 */
const useBlogData = (limitOrOptions: number | BlogDataOptions = 20): BlogData => {
  const options = typeof limitOrOptions === 'number'
    ? { limit: limitOrOptions, categoryId: null, tagId: null, search: '', sort: 'latest' as PostSortOption }
    : { limit: 20, categoryId: null, tagId: null, search: '', sort: 'latest' as PostSortOption, ...limitOrOptions };
  const { limit, categoryId, tagId, search, sort } = options;
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [series, setSeries] = useState<SeriesDetail[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    daysRunning: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // 동기 락 — setIsLoadingMore(true) 가 state update 되기 전에 IntersectionObserver
  // 가 loadMore 를 재호출해서 같은 page 를 두 번 받는 race 를 차단.
  const loadingLockRef = useRef(false);

  // 초기 데이터 로드 (필터/정렬 변경 시 재-fetch)
  // ⚠️ setPosts([]) 로 즉시 비우지 않음 — 스크롤 위치 jump 방지. fetch 완료 후 교체.
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setPage(1);
    setHasMore(true);
    // loadingLockRef 리셋 — 이전 fetch 가 진행 중이던 경우에도 새 정렬 fetch 가 막히지 않게
    loadingLockRef.current = false;

    const searchParams = {
      limit,
      page: 1,
      sort,
      ...(categoryId && { categoryId }),
      ...(tagId && { tagId }),
      ...(search && { search }),
    };

    let cancelled = false;

    Promise.all([getPosts(searchParams), getSeries()])
      .then(([postsRes, seriesRes]) => {
        if (cancelled) return;
        if (postsRes.success && postsRes.data) {
          setPosts(postsRes.data.data);  // 덮어쓰기 — 이전 데이터 자연 교체
          setStats(postsRes.data.stats);
          setHasMore(postsRes.data.page < postsRes.data.totalPages);
        } else {
          setError(postsRes.error || '블로그 데이터를 불러올 수 없습니다.');
        }
        if (seriesRes.success && seriesRes.data) {
          setSeries(seriesRes.data);
        }
      })
      .catch(() => {
        if (!cancelled) setError('블로그 데이터 로딩 중 오류가 발생했습니다.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    // deps 변경 시 진행 중이던 fetch 결과를 버림 (race 차단)
    return () => {
      cancelled = true;
    };
  }, [limit, categoryId, tagId, search, sort]);

  // 추가 데이터 로드 (무한스크롤)
  const loadMore = useCallback(() => {
    if (loadingLockRef.current || !hasMore) return;
    loadingLockRef.current = true;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    const searchParams = {
      limit,
      page: nextPage,
      sort,
      ...(categoryId && { categoryId }),
      ...(tagId && { tagId }),
      ...(search && { search }),
    };

    getPosts(searchParams)
      .then((postsRes) => {
        if (postsRes.success && postsRes.data) {
          // id 기준 dedupe — 서버 pagination 경계/race 로 중복 반환되어도 안전.
          setPosts((prev) => {
            const existing = new Set(prev.map((p) => p.id));
            const toAdd = postsRes.data!.data.filter((p) => !existing.has(p.id));
            return toAdd.length ? [...prev, ...toAdd] : prev;
          });
          setPage(nextPage);
          setHasMore(postsRes.data.page < postsRes.data.totalPages);
        }
      })
      .catch(() => {
        console.error('추가 데이터 로딩 실패');
      })
      .finally(() => {
        loadingLockRef.current = false;
        setIsLoadingMore(false);
      });
  }, [hasMore, page, limit, categoryId, tagId, search, sort]);

  // 에러 발생 시 ErrorBoundary로 전파
  if (error) {
    throw new Error(error);
  }

  return { posts, series, stats, isLoading, isLoadingMore, hasMore, loadMore };
};

export { useBlogData };
