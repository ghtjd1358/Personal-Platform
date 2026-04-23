import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updateApplicationResult } from '@/network/apis/application/update-application';

type ResultArg = Parameters<typeof updateApplicationResult>[1];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updateApplicationResult>>['data']>;

export function useUpdateApplicationResult(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (applicationId: string, result: ResultArg): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updateApplicationResult(applicationId, result)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '결과 변경 실패');
                        toastSuccess('결과가 변경되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '결과 변경 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
