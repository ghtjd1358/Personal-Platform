import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getSeriesByPostId } from '@/network/apis/series/manage-series-posts';

type SeriesRef = { series_id: string; title: string; slug: string };

export function useFetchSeriesByPostId(
    postId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [series, setSeries] = useState<SeriesRef[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!postId) { setSeries([]); return; }
        let cancelled = false;

        showGlobalLoading(
            getSeriesByPostId(postId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '포스트 시리즈 조회 실패');
                    setSeries(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setSeries([]);
                    if (!options.silent) toastError(err?.message || '포스트 시리즈 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId, updater]);

    return { series };
}
