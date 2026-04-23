/**
 * useFetchPortfolioByIdWithDetails — portfoliosApi.getByIdWithDetails 훅 래퍼.
 * API 가 PortfolioWithDetails | null 반환. id 없으면 fetch 생략.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi, type PortfolioWithDetails } from '@/network/apis/supabase';

export function useFetchPortfolioByIdWithDetails(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [portfolio, setPortfolio] = useState<PortfolioWithDetails | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) {
            setPortfolio(null);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            portfoliosApi.getByIdWithDetails(id)
                .then((data) => {
                    if (cancelled) return;
                    setPortfolio(data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setPortfolio(null);
                    if (!options.silent) toastError(err?.message || '포트폴리오 상세 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { portfolio };
}
