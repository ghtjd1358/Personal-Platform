import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updateApplication } from '@/network/apis/application/update-application';

type Payload = Parameters<typeof updateApplication>[1];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updateApplication>>['data']>;

export function useUpdateApplication(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (applicationId: string, input: Payload): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updateApplication(applicationId, input)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '지원 수정 실패');
                        toastSuccess('지원이 수정되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '지원 수정 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
