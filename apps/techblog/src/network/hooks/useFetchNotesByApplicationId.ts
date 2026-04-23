import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getNotesByApplicationId } from '@/network/apis/note/get-notes';

type Row = NonNullable<Awaited<ReturnType<typeof getNotesByApplicationId>>['data']>[number];

export function useFetchNotesByApplicationId(
    applicationId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [notes, setNotes] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!applicationId) { setNotes([]); return; }
        let cancelled = false;

        showGlobalLoading(
            getNotesByApplicationId(applicationId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '메모 조회 실패');
                    setNotes(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setNotes([]);
                    if (!options.silent) toastError(err?.message || '메모 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applicationId, updater]);

    return { notes };
}
