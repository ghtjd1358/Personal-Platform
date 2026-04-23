/**
 * useDeleteFeatureImage — featuresApi.deleteImageByUrl 훅 래퍼 (mutation).
 * orphan 파일 정리용. API 가 본래 실패 무시 — 훅도 기본 silent.
 * 반환: 성공/실패 모두 true (orphan 이어도 치명적이지 않음) — 호출부는 await 후 이어서 진행.
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { featuresApi } from '@/network/apis/supabase';

export function useDeleteFeatureImage(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (publicUrl: string): Promise<true> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                featuresApi.deleteImageByUrl(publicUrl)
                    .then(() => true as const)
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return true as const;
                        if (!options.silent) toastError(err?.message || '이미지 삭제 실패');
                        return true as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
