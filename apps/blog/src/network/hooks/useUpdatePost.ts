import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updatePost } from '@/network/apis/post/post-update-post';

type Payload = Parameters<typeof updatePost>[1];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updatePost>>['data']>;

export function useUpdatePost(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (id: string, payload: Payload): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updatePost(id, payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '게시글 수정 실패');
                        toastSuccess('게시글이 수정되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '게시글 수정 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
