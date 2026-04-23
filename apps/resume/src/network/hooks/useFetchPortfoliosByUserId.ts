/**
 * useFetchPortfoliosByUserId — portfoliosApi.getByUserId 훅 래퍼.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof portfoliosApi.getByUserId>>['data']>[number];

export function useFetchPortfoliosByUserId(
    userId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [portfolios, setPortfolios] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!userId) {
            setPortfolios([]);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            portfoliosApi.getByUserId(userId)
                .then(({ data, error }) => {
                    if (cancelled) return;
                    if (error) throw error;
                    setPortfolios((data || []) as Row[]);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setPortfolios([]);
                    if (!options.silent) toastError(err?.message || '포트폴리오 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, updater]);

    return { portfolios };
}
