import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { createNote } from '@/network/apis/note/create-note';

type Payload = Parameters<typeof createNote>[0];
type CreatedRow = NonNullable<Awaited<ReturnType<typeof createNote>>['data']>;

export function useCreateNote(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (input: Payload): Promise<CreatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                createNote(input)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '메모 생성 실패');
                        toastSuccess('메모가 생성되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '메모 생성 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
