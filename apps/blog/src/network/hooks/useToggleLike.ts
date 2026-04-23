/**
 * useToggleLike — blog like.toggleLike 훅 래퍼 (mutation).
 * 좋아요는 optimistic UI 가 흔해 기본 silent. 성공 토스트 없이 결과만 반환.
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { toggleLike } from '@/network/apis/like/toggle-like';

type LikeResult = NonNullable<Awaited<ReturnType<typeof toggleLike>>['data']>;

export function useToggleLike(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (postId: string, userId: string): Promise<LikeResult | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                toggleLike(postId, userId)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '좋아요 처리 실패');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '좋아요 처리 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
