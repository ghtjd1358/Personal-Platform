import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { deleteNote } from '@/network/apis/note/delete-note';

export function useDeleteNote(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (noteId: string): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                deleteNote(noteId)
                    .then((res) => {
                        if (!res.success) throw new Error(res.error || '메모 삭제 실패');
                        toastSuccess('메모가 삭제되었습니다');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '메모 삭제 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
