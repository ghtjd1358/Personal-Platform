import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updateApplicationStatus } from '@/network/apis/application/update-application';

type StatusArg = Parameters<typeof updateApplicationStatus>[1];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updateApplicationStatus>>['data']>;

export function useUpdateApplicationStatus(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (applicationId: string, status: StatusArg): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updateApplicationStatus(applicationId, status)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '상태 변경 실패');
                        toastSuccess('상태가 변경되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '상태 변경 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
