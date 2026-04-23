/**
 * useFetchFeatures — featuresApi.getAll 훅 래퍼.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { featuresApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof featuresApi.getAll>>['data']>[number];

export function useFetchFeatures(updater?: number, options: { silent?: boolean } = {}) {
    const [features, setFeatures] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            featuresApi.getAll()
                .then(({ data, error }) => {
                    if (cancelled) return;
                    if (error) throw error;
                    setFeatures((data || []) as Row[]);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setFeatures([]);
                    if (!options.silent) toastError(err?.message || 'Features 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { features };
}
