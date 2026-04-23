/**
 * useFetchFeatureById — featuresApi.getById 훅 래퍼.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { featuresApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof featuresApi.getById>>['data']>;

export function useFetchFeatureById(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [feature, setFeature] = useState<Row | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) {
            setFeature(null);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            featuresApi.getById(id)
                .then(({ data, error }) => {
                    if (cancelled) return;
                    if (error) throw error;
                    setFeature(data as Row);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setFeature(null);
                    if (!options.silent) toastError(err?.message || 'Feature 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { feature };
}
