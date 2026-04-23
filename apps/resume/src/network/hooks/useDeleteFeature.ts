/**
 * useDeleteFeature — featuresApi.delete 훅 래퍼 (mutation).
 * 주의: 이 훅은 DB row 만 삭제. Storage 파일 삭제가 필요하면 useDeleteFeatureImage 를 같이 호출해야 함.
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { featuresApi } from '@/network/apis/supabase';

export function useDeleteFeature(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (id: string): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                featuresApi.delete(id)
                    .then(({ error }) => {
                        if (error) throw error;
                        toastSuccess('Feature 가 삭제되었습니다');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || 'Feature 삭제 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
