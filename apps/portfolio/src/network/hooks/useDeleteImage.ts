import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { deleteImage } from '@/network/apis/upload/upload-image';

export function useDeleteImage(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (path: string): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                deleteImage(path)
                    .then((res) => {
                        if (!res.success) throw new Error(res.error || '이미지 삭제 실패');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '이미지 삭제 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
