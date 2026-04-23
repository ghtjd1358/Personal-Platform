import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { removePostFromSeries } from '@/network/apis/series/manage-series-posts';

export function useRemovePostFromSeries(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (seriesId: string, postId: string): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                removePostFromSeries(seriesId, postId)
                    .then((res) => {
                        if (!res.success) throw new Error(res.error || '시리즈 포스트 제거 실패');
                        toastSuccess('포스트가 시리즈에서 제거되었습니다');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '시리즈 포스트 제거 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
