/**
 * useCreatePortfolio — portfoliosApi.create 훅 래퍼 (mutation).
 * API 내부에서 auto-slug 처리 (title 기반). client 가 slug 안 넣어도 됨.
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi } from '@/network/apis/supabase';

type Payload = Parameters<typeof portfoliosApi.create>[0];
type CreatedRow = Awaited<ReturnType<typeof portfoliosApi.create>>['data'];

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
                portfoliosApi.create(payload)
                    .then(({ data, error }) => {
                        if (error) throw error;
                        toastSuccess('포트폴리오가 추가되었습니다');
                        return data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '포트폴리오 추가 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
