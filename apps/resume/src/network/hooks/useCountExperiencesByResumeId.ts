/**
 * useCountExperiencesByResumeId — experiencesApi.countByResumeId 훅 래퍼.
 * API 가 숫자 직접 반환. 실패 시 0 으로 fallback (카운트는 UI 보조 정보라 silent 가 기본값).
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { experiencesApi } from '@/network/apis/supabase';

export function useCountExperiencesByResumeId(
    resumeId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [count, setCount] = useState(0);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!resumeId) {
            setCount(0);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            experiencesApi.countByResumeId(resumeId)
                .then((n) => {
                    if (cancelled) return;
                    setCount(n);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setCount(0);
                    if (!options.silent) toastError(err?.message || '경력 개수 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeId, updater]);

    return { count };
}
