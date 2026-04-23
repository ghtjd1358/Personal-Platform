import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { updatePortfolio } from '@/network/apis/portfolio/manage-portfolio';

type Payload = Parameters<typeof updatePortfolio>[1];
type UpdatedRow = NonNullable<Awaited<ReturnType<typeof updatePortfolio>>['data']>;

export function useUpdatePortfolio(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (id: string, payload: Payload): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                updatePortfolio(id, payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '포트폴리오 수정 실패');
                        toastSuccess('포트폴리오가 수정되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '포트폴리오 수정 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
