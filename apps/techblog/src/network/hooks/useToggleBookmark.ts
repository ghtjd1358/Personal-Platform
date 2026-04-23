import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { toggleBookmark } from '@/network/apis/bookmark/toggle-bookmark';

type Result = NonNullable<Awaited<ReturnType<typeof toggleBookmark>>['data']>;

export function useToggleBookmark(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (jobId: string): Promise<Result | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                toggleBookmark(jobId)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '북마크 처리 실패');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '북마크 처리 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
