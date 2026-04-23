/**
 * useFetchExperiencesByUserIdWithDetails — experiencesApi.getByUserIdWithDetails 훅 래퍼.
 * API 가 async 로 이미 resolved 배열 반환 → 훅에선 { data, error } 언래핑 불필요, throw 는 그대로 catch.
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { experiencesApi, type ExperienceWithDetails } from '@/network/apis/supabase';

export function useFetchExperiencesByUserIdWithDetails(
    userId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [experiences, setExperiences] = useState<ExperienceWithDetails[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!userId) {
            setExperiences([]);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            experiencesApi.getByUserIdWithDetails(userId)
                .then((data) => {
                    if (cancelled) return;
                    setExperiences(data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setExperiences([]);
                    if (!options.silent) toastError(err?.message || '경력 상세 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, updater]);

    return { experiences };
}
