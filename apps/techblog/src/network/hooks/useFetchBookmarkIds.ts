import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getBookmarkIds } from '@/network/apis/bookmark/get-bookmarks';

export function useFetchBookmarkIds(
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [ids, setIds] = useState<string[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getBookmarkIds()
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '북마크 id 조회 실패');
                    setIds(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setIds([]);
                    if (!options.silent) toastError(err?.message || '북마크 id 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { ids };
}
