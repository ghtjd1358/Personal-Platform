import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getPortfolioById } from '@/network/apis/portfolio/get-portfolio-detail';

type Detail = NonNullable<Awaited<ReturnType<typeof getPortfolioById>>['data']>;

export function useFetchPortfolioById(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [detail, setDetail] = useState<Detail | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) { setDetail(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getPortfolioById(id)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '포트폴리오 조회 실패');
                    setDetail(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setDetail(null);
                    if (!options.silent) toastError(err?.message || '포트폴리오 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { detail };
}
