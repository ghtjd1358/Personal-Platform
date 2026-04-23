/**
 * useFetchFeaturesByUserId — featuresApi.getByUserId 훅 래퍼.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { featuresApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof featuresApi.getByUserId>>['data']>[number];

export function useFetchFeaturesByUserId(
    userId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [features, setFeatures] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!userId) {
            setFeatures([]);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            featuresApi.getByUserId(userId)
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
    }, [userId, updater]);

    return { features };
}
