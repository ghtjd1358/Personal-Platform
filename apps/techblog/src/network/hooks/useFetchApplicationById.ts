import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getApplicationById } from '@/network/apis/application/get-applications';

type Row = NonNullable<Awaited<ReturnType<typeof getApplicationById>>['data']>;

export function useFetchApplicationById(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [application, setApplication] = useState<Row | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) { setApplication(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getApplicationById(id)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '지원 조회 실패');
                    setApplication(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setApplication(null);
                    if (!options.silent) toastError(err?.message || '지원 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { application };
}
