import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getSeries } from '@/network/apis/series/get-series';
import type { SeriesDetail } from '@/network/apis/series/types';

export function useFetchSeries(
    userId?: string,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [series, setSeries] = useState<SeriesDetail[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getSeries(userId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '시리즈 조회 실패');
                    setSeries(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setSeries([]);
                    if (!options.silent) toastError(err?.message || '시리즈 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, updater]);

    return { series };
}
