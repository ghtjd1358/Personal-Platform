import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getComments } from '@/network/apis/comments/comments-api';

type Comment = NonNullable<Awaited<ReturnType<typeof getComments>>['data']>[number];

export function useFetchComments(
    portfolioId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [comments, setComments] = useState<Comment[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!portfolioId) { setComments([]); return; }
        let cancelled = false;

        showGlobalLoading(
            getComments(portfolioId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '댓글 조회 실패');
                    setComments(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setComments([]);
                    if (!options.silent) toastError(err?.message || '댓글 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [portfolioId, updater]);

    return { comments };
}
