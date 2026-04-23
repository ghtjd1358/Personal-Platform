import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getJobs } from '@/network/apis/job/get-jobs';

type PageResult = NonNullable<Awaited<ReturnType<typeof getJobs>>['data']>;
type Params = Parameters<typeof getJobs>[0];

export function useFetchJobs(
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
            getJobs(params)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '공고 조회 실패');
                    setResult(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setResult(null);
                    if (!options.silent) toastError(err?.message || '공고 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, updater]);

    return { result };
}
