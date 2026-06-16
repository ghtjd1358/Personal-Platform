import { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useShowGlobalLoading, useToast, selectUser } from '@sonhoseong/mfa-lib';
import { createPost } from '@/network/apis/post/post-create-post';

type Payload = Parameters<typeof createPost>[1];
type CreatedRow = NonNullable<Awaited<ReturnType<typeof createPost>>['data']>;

export function useCreatePost(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();
    const user = useSelector(selectUser);

    return useCallback(
        async (payload: Payload): Promise<CreatedRow | false> => {
            if (!user?.id) {
                if (!options.silent) toastError('로그인이 필요합니다.');
                return false;
            }

            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                createPost(user.id, payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '게시글 작성 실패');
                        toastSuccess('게시글이 작성되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '게시글 작성 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent, user],
    );
}
