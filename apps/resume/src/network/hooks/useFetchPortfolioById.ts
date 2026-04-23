/**
 * useFetchPortfolioById — portfoliosApi.getById 훅 래퍼.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof portfoliosApi.getById>>['data']>;

export function useFetchPortfolioById(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [portfolio, setPortfolio] = useState<Row | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) {
            setPortfolio(null);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            portfoliosApi.getById(id)
                .then(({ data, error }) => {
                    if (cancelled) return;
                    if (error) throw error;
                    setPortfolio(data as Row);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setPortfolio(null);
                    if (!options.silent) toastError(err?.message || '포트폴리오 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { portfolio };
}
