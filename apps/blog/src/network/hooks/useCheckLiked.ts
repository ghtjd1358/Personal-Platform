import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { checkLiked } from '@/network/apis/like/toggle-like';

export function useCheckLiked(
    postId: string | undefined,
    userId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [liked, setLiked] = useState(false);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!postId || !userId) { setLiked(false); return; }
        let cancelled = false;

        showGlobalLoading(
            checkLiked(postId, userId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '좋아요 상태 조회 실패');
                    setLiked(res.data === true);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setLiked(false);
                    if (!options.silent) toastError(err?.message || '좋아요 상태 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId, userId, updater]);

    return { liked };
}
