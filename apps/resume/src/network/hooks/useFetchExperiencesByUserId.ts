/**
 * useFetchExperiencesByUserId — experiencesApi.getByUserId 훅 래퍼.
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { experiencesApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof experiencesApi.getByUserId>>['data']>[number];

export function useFetchExperiencesByUserId(
    userId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [experiences, setExperiences] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!userId) {
            setExperiences([]);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            experiencesApi.getByUserId(userId)
                .then(({ data, error }) => {
                    if (cancelled) return;
                    if (error) throw error;
                    setExperiences((data || []) as Row[]);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setExperiences([]);
                    if (!options.silent) toastError(err?.message || '경력 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, updater]);

    return { experiences };
}
