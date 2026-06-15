import { useState, useEffect, useCallback, useRef } from "react";
import { toggleLike, checkLiked } from "../network";
import { getCurrentUser, useToast } from "@sonhoseong/mfa-lib";

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
  const currentUser = getCurrentUser();
  const toast = useToast();

  useEffect(() => {
    const checkUserLiked = async () => {
      if (!currentUser?.id) return;
      const result = await checkLiked(postId, currentUser.id);
      if (hasInteractedRef.current) return;
      if (result.success && result.data !== undefined) {
        setLiked(result.data);
      }
    };
    checkUserLiked();
  }, [postId, currentUser?.id]);

  const performLikeToggle = useCallback(
    async (prevLiked: boolean, prevCount: number) => {
      if (!currentUser?.id) return;
      try {
        const result = await toggleLike(postId, currentUser.id);
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
    [postId, currentUser?.id, onLikeChange]
  );

  const handleLike = useCallback(() => {
    if (!currentUser?.id) {
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
    setTimeout(() => setAnimating(false), 300);

    performLikeToggle(prevLiked, prevCount);
  }, [liked, likeCount, currentUser?.id, toast, performLikeToggle]);

  return { liked, likeCount, animating, handleLike };
}
