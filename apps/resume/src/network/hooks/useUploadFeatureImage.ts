/**
 * useUploadFeatureImage — featuresApi.uploadImage 훅 래퍼 (mutation).
 * Supabase Storage `resume-features` bucket 업로드 → public URL 반환.
 * 업로드 자체는 save flow 의 일부인 경우가 많아 기본 silent (상위에서 최종 토스트).
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { featuresApi } from '@/network/apis/supabase';

export function useUploadFeatureImage(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (userId: string, file: File): Promise<string | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                featuresApi.uploadImage(userId, file)
                    .then((publicUrl) => publicUrl)
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '이미지 업로드 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
