import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { createPortfolio } from '@/network/apis/portfolio/manage-portfolio';

type Payload = Parameters<typeof createPortfolio>[0];
type CreatedRow = NonNullable<Awaited<ReturnType<typeof createPortfolio>>['data']>;

export function useCreatePortfolio(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (payload: Payload): Promise<CreatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                createPortfolio(payload)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '포트폴리오 생성 실패');
                        toastSuccess('포트폴리오가 생성되었습니다');
                        return res.data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '포트폴리오 생성 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
