import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getTags } from '@/network/apis/tag/get-tags';
import type { TagDetail } from '@/network/apis/tag/types';

export function useFetchTags(updater?: number, options: { silent?: boolean } = {}) {
    const [tags, setTags] = useState<TagDetail[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getTags()
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '태그 조회 실패');
                    setTags(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setTags([]);
                    if (!options.silent) toastError(err?.message || '태그 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { tags };
}
