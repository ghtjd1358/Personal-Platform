/**
 * useFetchPortfolios — portfoliosApi.getAll 훅 래퍼.
 * admin 전역 뷰용. 일반 페이지는 useFetchPortfoliosByUserId / ByResumeId 사용.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof portfoliosApi.getAll>>['data']>[number];

export function useFetchPortfolios(updater?: number, options: { silent?: boolean } = {}) {
    const [portfolios, setPortfolios] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            portfoliosApi.getAll()
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
    }, [updater]);

    return { portfolios };
}
