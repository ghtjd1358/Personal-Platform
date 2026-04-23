/**
 * useUploadImage — blog upload.uploadImage 훅 래퍼 (mutation).
 * Tiptap 에디터 등에서 호출 — 기본 silent (에디터가 inline 진행 표시).
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { uploadImage } from '@/network/apis/upload/upload-image';

type UploadResult = NonNullable<Awaited<ReturnType<typeof uploadImage>>['data']>;

export function useUploadImage(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (file: File, folder: string = 'blog'): Promise<UploadResult | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                uploadImage(file, folder)
                    .then((res) => {
                        if (!res.success || !res.data) throw new Error(res.error || '이미지 업로드 실패');
                        return res.data;
                    })
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
