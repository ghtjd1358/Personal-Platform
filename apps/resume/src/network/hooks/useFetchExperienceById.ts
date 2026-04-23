/**
 * useFetchExperienceById — experiencesApi.getById 훅 래퍼.
 * 단건 조회. id 없으면 fetch 생략. details 없이 단일 row 만 필요할 때.
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { experiencesApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof experiencesApi.getById>>['data']>;

export function useFetchExperienceById(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [experience, setExperience] = useState<Row | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) {
            setExperience(null);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            experiencesApi.getById(id)
                .then(({ data, error }) => {
                    if (cancelled) return;
                    if (error) throw error;
                    setExperience(data as Row);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setExperience(null);
                    if (!options.silent) toastError(err?.message || '경력 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { experience };
}
