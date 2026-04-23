import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { addPostToSeries } from '@/network/apis/series/manage-series-posts';

type Payload = Parameters<typeof addPostToSeries>[0];

export function useAddPostToSeries(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (payload: Payload): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                addPostToSeries(payload)
                    .then((res) => {
                        if (!res.success) throw new Error(res.error || '시리즈 포스트 추가 실패');
                        toastSuccess('포스트가 시리즈에 추가되었습니다');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '시리즈 포스트 추가 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
