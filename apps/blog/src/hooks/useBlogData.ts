import { useEffect, useState, useCallback } from 'react';
import {getPosts, getSeries, PostSummary, SeriesDetail} from "@/network";

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
    ? { limit: limitOrOptions, categoryId: null, tagId: null, search: '' }
    : { limit: 20, categoryId: null, tagId: null, search: '', ...limitOrOptions };
  const { limit, categoryId, tagId, search } = options;
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

  // 초기 데이터 로드 (카테고리 변경 시 리셋)
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setPosts([]);
    setPage(1);
    setHasMore(true);

    const searchParams = {
      limit,
      page: 1,
      ...(categoryId && { categoryId }),
      ...(tagId && { tagId }),
      ...(search && { search }),
    };

    Promise.all([getPosts(searchParams), getSeries()])
      .then(([postsRes, seriesRes]) => {
        if (postsRes.success && postsRes.data) {
          setPosts(postsRes.data.data);
          setStats(postsRes.data.stats);
          setHasMore(postsRes.data.page < postsRes.data.totalPages);
        } else {
          setError(postsRes.error || '블로그 데이터를 불러올 수 없습니다.');
        }
        if (seriesRes.success && seriesRes.data) {
          setSeries(seriesRes.data);
        }
      })
      .catch(() => setError('블로그 데이터 로딩 중 오류가 발생했습니다.'))
      .finally(() => setIsLoading(false));
  }, [limit, categoryId, tagId, search]);

  // 추가 데이터 로드 (무한스크롤)
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    const searchParams = {
      limit,
      page: nextPage,
      ...(categoryId && { categoryId }),
      ...(tagId && { tagId }),
      ...(search && { search }),
    };

    getPosts(searchParams)
      .then((postsRes) => {
        if (postsRes.success && postsRes.data) {
          setPosts((prev) => [...prev, ...postsRes.data!.data]);
          setPage(nextPage);
          setHasMore(postsRes.data.page < postsRes.data.totalPages);
        }
      })
      .catch(() => {
        console.error('추가 데이터 로딩 실패');
      })
      .finally(() => setIsLoadingMore(false));
  }, [isLoadingMore, hasMore, page, limit, categoryId, tagId, search]);

  // 에러 발생 시 ErrorBoundary로 전파
  if (error) {
    throw new Error(error);
  }

  return { posts, series, stats, isLoading, isLoadingMore, hasMore, loadMore };
};

export { useBlogData };
