import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getCommentCount } from '@/network/apis/comments/comments-api';

export function useFetchCommentCount(
    portfolioId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = { silent: true },
) {
    const [count, setCount] = useState(0);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!portfolioId) { setCount(0); return; }
        let cancelled = false;

        showGlobalLoading(
            getCommentCount(portfolioId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '댓글 수 조회 실패');
                    setCount(res.data || 0);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setCount(0);
                    if (!options.silent) toastError(err?.message || '댓글 수 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [portfolioId, updater]);

    return { count };
}
