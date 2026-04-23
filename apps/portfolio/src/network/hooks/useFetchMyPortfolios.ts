import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getMyPortfolios } from '@/network/apis/portfolio/manage-portfolio';

type List = NonNullable<Awaited<ReturnType<typeof getMyPortfolios>>['data']>;

export function useFetchMyPortfolios(updater?: number, options: { silent?: boolean } = {}) {
    const [list, setList] = useState<List>([] as unknown as List);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getMyPortfolios()
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '내 포트폴리오 조회 실패');
                    setList(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setList([] as unknown as List);
                    if (!options.silent) toastError(err?.message || '내 포트폴리오 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { list };
}
