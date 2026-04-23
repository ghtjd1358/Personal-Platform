/**
 * useCreateFeature — featuresApi.create 훅 래퍼 (mutation).
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { featuresApi } from '@/network/apis/supabase';

type Payload = Parameters<typeof featuresApi.create>[0];
type CreatedRow = Awaited<ReturnType<typeof featuresApi.create>>['data'];

export function useCreateFeature(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (payload: Payload): Promise<CreatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                featuresApi.create(payload)
                    .then(({ data, error }) => {
                        if (error) throw error;
                        toastSuccess('Feature 가 추가되었습니다');
                        return data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || 'Feature 추가 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
