/**
 * useIncrementViewCount — portfolio.incrementViewCount 훅 래퍼 (mutation).
 * 조회수 증가는 UX 에 미치는 영향 없음 → 기본 silent, 성공 토스트 없음.
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { incrementViewCount } from '@/network/apis/portfolio/get-portfolio-detail';

export function useIncrementViewCount(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (id: string): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                incrementViewCount(id)
                    .then((res) => {
                        if (!res.success) throw new Error(res.error || '조회수 증가 실패');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '조회수 증가 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
