/**
 * useFetchPortfolios — portfolio.getPortfolios 훅 래퍼.
 * portfolio remote 는 ApiResponse<T> 래핑 shape.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getPortfolios } from '@/network/apis/portfolio/get-portfolios';

type ListResult = NonNullable<Awaited<ReturnType<typeof getPortfolios>>['data']>;
type Params = Parameters<typeof getPortfolios>[0];

export function useFetchPortfolios(
    params: Params,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [result, setResult] = useState<ListResult | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getPortfolios(params)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '포트폴리오 조회 실패');
                    setResult(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setResult(null);
                    if (!options.silent) toastError(err?.message || '포트폴리오 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, updater]);

    return { result };
}
