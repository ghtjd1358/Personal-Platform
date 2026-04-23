import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getLikeStatus } from '@/network/apis/likes/get-like-status';

type Status = NonNullable<Awaited<ReturnType<typeof getLikeStatus>>['data']>;

export function useFetchLikeStatus(
    portfolioId: string | undefined,
    userId: string | null | undefined,
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [status, setStatus] = useState<Status | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!portfolioId) { setStatus(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getLikeStatus(portfolioId, userId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '좋아요 상태 조회 실패');
                    setStatus(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setStatus(null);
                    if (!options.silent) toastError(err?.message || '좋아요 상태 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [portfolioId, userId, updater]);

    return { status };
}
