import { useState, useEffect, useCallback, useRef } from 'react';
import { getLikeStatus, toggleLike } from '@/network';

interface UseLikeOptions {
  portfolioId: string;
  userId?: string | null;
  initialLikeCount?: number;
}

interface UseLikeReturn {
  isLiked: boolean;
  likeCount: number;
  isLoading: boolean;
  isToggling: boolean;
  toggle: () => Promise<void>;
}

/**
 * 포트폴리오 좋아요 상태 관리 Hook
 * - Optimistic Update 패턴 적용: UI 즉시 반영, 실패 시 롤백
 */
export function useLike({
  portfolioId,
  userId,
  initialLikeCount = 0,
}: UseLikeOptions): UseLikeReturn {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // Ref로 race condition 방지 (dependency array 순환 참조 회피)
  const isTogglingRef = useRef(false);

  // 초기 좋아요 상태 로드
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      setIsLoading(true);
      const result = await getLikeStatus(portfolioId, userId);
      if (isMounted && result.success && result.data) {
        setIsLiked(result.data.isLiked);
        setLikeCount(result.data.likeCount);
      }
      if (isMounted) setIsLoading(false);
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [portfolioId, userId]);

  // 좋아요 토글 (Optimistic Update)
  const toggle = useCallback(async () => {
    // Ref로 중복 클릭 방지 (race condition 방어)
    if (!userId || isTogglingRef.current) return;
    isTogglingRef.current = true;
    setIsToggling(true);

    // 1. 현재 상태 저장 (롤백용)
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    // 2. Optimistic Update - UI 즉시 반영
    setIsLiked(!previousIsLiked);
    setLikeCount(previousIsLiked ? previousLikeCount - 1 : previousLikeCount + 1);

    // 3. API 호출
    const result = await toggleLike(portfolioId, userId);

    // 4. 실패 시 롤백
    if (!result.success) {
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      console.error('Like toggle failed:', result.error);
    } else if (result.data) {
      // 서버 데이터로 동기화 (트리거로 인한 정확한 count)
      setLikeCount(result.data.likeCount);
    }

    setIsToggling(false);
    isTogglingRef.current = false;
  }, [portfolioId, userId, isLiked, likeCount]);

  return {
    isLiked,
    likeCount,
    isLoading,
    isToggling,
    toggle,
  };
}
