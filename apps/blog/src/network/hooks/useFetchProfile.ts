import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getProfile } from '@/network/apis/profile/get-profile';
import type { ProfileDetail } from '@/network/apis/profile/types';

export function useFetchProfile(
    userId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [profile, setProfile] = useState<ProfileDetail | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!userId) { setProfile(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getProfile(userId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '프로필 조회 실패');
                    setProfile(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setProfile(null);
                    if (!options.silent) toastError(err?.message || '프로필 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, updater]);

    return { profile };
}
