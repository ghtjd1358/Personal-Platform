/**
 * useFetchPosts — blog post.getPosts 훅 래퍼.
 * 페이지네이션 + 정렬 + 필터 검색 지원. params 바뀔 때마다 자동 재조회.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getPosts, type PostsWithStats } from '@/network/apis/post/get-posts';
import type { PostSearchCondition } from '@/network/apis/post/types';

const EMPTY: PostsWithStats = {
    data: [], total: 0, page: 1, limit: 10, totalPages: 0,
    stats: { totalPosts: 0, totalViews: 0, totalLikes: 0, daysRunning: 0 },
};

export function useFetchPosts(
    params: PostSearchCondition,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [result, setResult] = useState<PostsWithStats>(EMPTY);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getPosts(params)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '게시글 조회 실패');
                    setResult(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setResult(EMPTY);
                    if (!options.silent) toastError(err?.message || '게시글 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params, updater]);

    return { result };
}
