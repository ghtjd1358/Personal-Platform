import { useState, useEffect, useCallback, useRef } from "react";
import { toggleLike, checkLiked } from "../network";
import { useCurrentUser, useToast } from "@sonhoseong/mfa-lib";

interface UseLikeToggleOptions {
  postId: string;
  initialLikeCount: number;
  onLikeChange?: (liked: boolean, count: number) => void;
}

interface UseLikeToggleReturn {
  liked: boolean;
  likeCount: number;
  animating: boolean;
  handleLike: () => void;
}

export function useLikeToggle({
  postId,
  initialLikeCount,
  onLikeChange,
}: UseLikeToggleOptions): UseLikeToggleReturn {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [animating, setAnimating] = useState(false);
  const isProcessingRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const animatingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUser = useCurrentUser();
  const toast = useToast();

  // unmount 시 animating timeout 정리 (메모리/setState-after-unmount 누수 방지)
  useEffect(() => {
    return () => {
      if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);
    };
  }, []);

  // postId 변경 시 interaction guard 초기화 — 다른 포스트로 이동 시 checkLiked 다시 실행되도록
  useEffect(() => {
    hasInteractedRef.current = false;
    isProcessingRef.current = false; // postId 변경 시 처리 락도 초기화
  }, [postId]);

  useEffect(() => {
    let cancelled = false;
    const checkUserLiked = async () => {
      if (!currentUser?.id) return;
      const result = await checkLiked(postId, currentUser.id);
      // unmount/deps 변경 후 stale setState 방지
      if (cancelled) return;
      if (hasInteractedRef.current) return;
      if (result.success && result.data !== undefined) {
        setLiked(result.data);
      }
    };
    checkUserLiked();
    return () => { cancelled = true; };
  }, [postId, currentUser?.id]);

  const performLikeToggle = useCallback(
    async (userId: string, prevLiked: boolean, prevCount: number) => {
      try {
        const result = await toggleLike(postId, userId);
        if (result.success && result.data) {
          setLiked(result.data.liked);
          setLikeCount(result.data.likeCount);
          onLikeChange?.(result.data.liked, result.data.likeCount);
        } else {
          setLiked(prevLiked);
          setLikeCount(prevCount);
        }
      } catch {
        setLiked(prevLiked);
        setLikeCount(prevCount);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [postId, onLikeChange]
  );

  const handleLike = useCallback(() => {
    // 호출 시점의 userId 를 snapshot — 비동기 진행 중 currentUser 변경돼도 안전
    const userId = currentUser?.id;
    if (!userId) {
      toast.info("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    hasInteractedRef.current = true;

    const prevLiked = liked;
    const prevCount = likeCount;
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;

    setLiked(newLiked);
    setLikeCount(newCount);
    setAnimating(true);
    if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);
    animatingTimeoutRef.current = setTimeout(() => setAnimating(false), 300);

    performLikeToggle(userId, prevLiked, prevCount);
  }, [liked, likeCount, currentUser?.id, toast, performLikeToggle]);

  return { liked, likeCount, animating, handleLike };
}
