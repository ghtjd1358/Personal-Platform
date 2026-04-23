/**
 * useCountPortfoliosByResumeId — portfoliosApi.countByResumeId 훅 래퍼.
 * 카운트는 UI 보조 정보라 기본 silent.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi } from '@/network/apis/supabase';

export function useCountPortfoliosByResumeId(
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
            portfoliosApi.countByResumeId(resumeId)
                .then((n) => {
                    if (cancelled) return;
                    setCount(n);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setCount(0);
                    if (!options.silent) toastError(err?.message || '포트폴리오 개수 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeId, updater]);

    return { count };
}
