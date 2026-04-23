/**
 * useFetchCategories — blog category.getCategories 훅 래퍼.
 * blog API 는 ApiResponse<T> 래핑 shape — { success, data, error } 언래핑.
 */
import { useEffect, useState } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { getCategories } from '@/network/apis/category/get-categories';
import type { CategoryDetail } from '@/network/apis/category/types';

export function useFetchCategories(
    userId?: string,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [categories, setCategories] = useState<CategoryDetail[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            getCategories(userId)
                .then((res) => {
                    if (cancelled) return;
                    if (!res.success) throw new Error(res.error || '카테고리 조회 실패');
                    setCategories(res.data || []);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setCategories([]);
                    if (!options.silent) toastError(err?.message || '카테고리 조회 실패');
                }),
        );

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, updater]);

    return { categories };
}
