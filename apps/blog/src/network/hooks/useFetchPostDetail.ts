import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getPostDetail } from '@/network/apis/post/get-post-detail';

type PostDetail = NonNullable<Awaited<ReturnType<typeof getPostDetail>>['data']>;

export function useFetchPostDetail(
    slug: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [post, setPost] = useState<PostDetail | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!slug) { setPost(null); return; }
        let cancelled = false;

        showGlobalLoading(
            getPostDetail(slug)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success || !res.data) throw new Error(res.error || '게시글 조회 실패');
                    setPost(res.data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setPost(null);
                    if (!options.silent) toastError(err?.message || '게시글 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, updater]);

    return { post };
}
