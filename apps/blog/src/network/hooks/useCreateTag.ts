import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { createTag } from '@/network/apis/tag/post-create-tag';

type Payload = Parameters<typeof createTag>[0];
type CreatedRow = NonNullable<Awaited<ReturnType<typeof createTag>>['data']>;

export function useCreateTag(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (payload: Payload): Promise<CreatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                createTag(payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '태그 생성 실패');
                        toastSuccess('태그가 생성되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '태그 생성 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
