import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getComments } from '@/network/apis/comment/get-comments';
import type { CommentDetail } from '@/network/apis/comment/types';

export function useFetchComments(
    postId: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [comments, setComments] = useState<CommentDetail[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!postId) { setComments([]); return; }
        let cancelled = false;

        showGlobalLoading(
            getComments(postId)
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
    }, [postId, updater]);

    return { comments };
}
