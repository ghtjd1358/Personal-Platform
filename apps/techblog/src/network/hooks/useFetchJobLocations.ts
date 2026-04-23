import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getJobLocations } from '@/network/apis/job/get-jobs';

export function useFetchJobLocations(
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [locations, setLocations] = useState<string[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getJobLocations()
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '지역 조회 실패');
                    setLocations(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setLocations([]);
                    if (!options.silent) toastError(err?.message || '지역 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { locations };
}
