/**
 * useFetchApplications — techblog application.getApplications 훅 래퍼.
 * techblog API 는 ApiResponse<T> 래핑 shape.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getApplications } from '@/network/apis/application/get-applications';

type PageResult = NonNullable<Awaited<ReturnType<typeof getApplications>>['data']>;
type Params = Parameters<typeof getApplications>[0];

export function useFetchApplications(
    params: Params = {},
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [result, setResult] = useState<PageResult | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getApplications(params)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '지원 목록 조회 실패');
                    setResult(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setResult(null);
                    if (!options.silent) toastError(err?.message || '지원 목록 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, updater]);

    return { result };
}
