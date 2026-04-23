import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getNoteById } from '@/network/apis/note/get-notes';

type Row = NonNullable<Awaited<ReturnType<typeof getNoteById>>['data']>;

export function useFetchNoteById(
    noteId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [note, setNote] = useState<Row | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!noteId) { setNote(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getNoteById(noteId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '메모 조회 실패');
                    setNote(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setNote(null);
                    if (!options.silent) toastError(err?.message || '메모 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteId, updater]);

    return { note };
}
