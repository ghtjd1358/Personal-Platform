import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getBookmarks } from '@/network/apis/bookmark/get-bookmarks';

type Row = NonNullable<Awaited<ReturnType<typeof getBookmarks>>['data']>[number];

export function useFetchBookmarks(updater?: number, options: { silent?: boolean } = {}) {
    const [bookmarks, setBookmarks] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getBookmarks()
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '북마크 조회 실패');
                    setBookmarks(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setBookmarks([]);
                    if (!options.silent) toastError(err?.message || '북마크 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { bookmarks };
}
