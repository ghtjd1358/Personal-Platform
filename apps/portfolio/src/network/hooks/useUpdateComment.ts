import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updateComment } from '@/network/apis/comments/comments-api';

type Payload = Parameters<typeof updateComment>[0];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updateComment>>['data']>;

export function useUpdateComment(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (payload: Payload): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updateComment(payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '댓글 수정 실패');
                        toastSuccess('댓글이 수정되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '댓글 수정 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
