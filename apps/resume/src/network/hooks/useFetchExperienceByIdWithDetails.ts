/**
 * useFetchExperienceByIdWithDetails — experiencesApi.getByIdWithDetails 훅 래퍼.
 * API 가 async 로 ExperienceWithDetails | null 직접 반환. id 없으면 fetch 생략.
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { experiencesApi, type ExperienceWithDetails } from '@/network/apis/supabase';

export function useFetchExperienceByIdWithDetails(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [experience, setExperience] = useState<ExperienceWithDetails | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) {
            setExperience(null);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            experiencesApi.getByIdWithDetails(id)
                .then((data) => {
                    if (cancelled) return;
                    setExperience(data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setExperience(null);
                    if (!options.silent) toastError(err?.message || '경력 상세 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { experience };
}
