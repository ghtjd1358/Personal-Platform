import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { reorderSeriesPosts } from '@/network/apis/series/manage-series-posts';

type Payload = Parameters<typeof reorderSeriesPosts>[0];

export function useReorderSeriesPosts(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (payload: Payload): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                reorderSeriesPosts(payload)
                    .then((res) => {
                        if (!res.success) throw new Error(res.error || '순서 변경 실패');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '순서 변경 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
