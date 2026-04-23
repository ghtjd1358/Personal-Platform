import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getSeriesDetail } from '@/network/apis/series/get-series-detail';

type SeriesDetailFull = NonNullable<Awaited<ReturnType<typeof getSeriesDetail>>['data']>;

export function useFetchSeriesDetail(
    slug: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [detail, setDetail] = useState<SeriesDetailFull | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!slug) { setDetail(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getSeriesDetail(slug)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '시리즈 조회 실패');
                    setDetail(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setDetail(null);
                    if (!options.silent) toastError(err?.message || '시리즈 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, updater]);

    return { detail };
}
