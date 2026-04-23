import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { uploadImages } from '@/network/apis/upload/upload-image';

type UploadResults = NonNullable<Awaited<ReturnType<typeof uploadImages>>['data']>;

export function useUploadImages(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (files: File[], folder: string = 'portfolio'): Promise<UploadResults | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                uploadImages(files, folder)
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
