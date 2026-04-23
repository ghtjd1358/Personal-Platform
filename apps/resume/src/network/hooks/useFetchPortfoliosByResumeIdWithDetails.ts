/**
 * useFetchPortfoliosByResumeIdWithDetails — portfoliosApi.getByResumeIdWithDetails 훅 래퍼.
 * API 가 async PortfolioWithDetails[] 직접 반환 — { data, error } 언래핑 불필요.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi, type PortfolioWithDetails } from '@/network/apis/supabase';

export function useFetchPortfoliosByResumeIdWithDetails(
    resumeId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [portfolios, setPortfolios] = useState<PortfolioWithDetails[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!resumeId) {
            setPortfolios([]);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            portfoliosApi.getByResumeIdWithDetails(resumeId)
                .then((data) => {
                    if (cancelled) return;
                    setPortfolios(data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setPortfolios([]);
                    if (!options.silent) toastError(err?.message || '포트폴리오 상세 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeId, updater]);

    return { portfolios };
}
