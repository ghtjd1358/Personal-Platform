/**
 * useFetchExperiences — experiencesApi.getAll 훅 래퍼.
 * 전체 조회 (admin 전역 뷰 용). 일반 페이지는 useFetchExperiencesByUserId 를 쓸 것.
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { experiencesApi } from '@/network/apis/supabase';

type Row = NonNullable<Awaited<ReturnType<typeof experiencesApi.getAll>>['data']>[number];

export function useFetchExperiences(updater?: number, options: { silent?: boolean } = {}) {
    const [experiences, setExperiences] = useState<Row[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            experiencesApi.getAll()
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
    }, [updater]);

    return { experiences };
}
