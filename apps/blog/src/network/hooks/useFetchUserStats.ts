import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getUserStats } from '@/network/apis/profile/get-user-stats';
import type { UserStats } from '@/network/apis/profile/types';

export function useFetchUserStats(
    userId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [stats, setStats] = useState<UserStats | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!userId) { setStats(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getUserStats(userId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '유저 통계 조회 실패');
                    setStats(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setStats(null);
                    if (!options.silent) toastError(err?.message || '유저 통계 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, updater]);

    return { stats };
}
