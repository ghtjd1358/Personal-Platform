import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { createComment } from '@/network/apis/comments/comments-api';

type Payload = Parameters<typeof createComment>[0];
type CreatedRow = NonNullable<Awaited<ReturnType<typeof createComment>>['data']>;

export function useCreateComment(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (payload: Payload): Promise<CreatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                createComment(payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '댓글 작성 실패');
                        toastSuccess('댓글이 등록되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '댓글 작성 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
