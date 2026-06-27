import { useState, useCallback } from 'react';
import {
    addPostToSeries,
    removePostFromSeries,
    reorderSeriesPosts,
} from '@/network';

interface MutationOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

interface UseSeriesPostsMutationReturn {
    addPost: (seriesId: string, postId: string) => Promise<boolean>;
    removePost: (seriesId: string, postId: string) => Promise<boolean>;
    reorderPosts: (seriesId: string, postOrders: { post_id: string; order_index: number }[]) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
}

/**
 * 시리즈-포스트 관계 mutation — add / remove / reorder.
 * 세 액션이 단일 isLoading 공유 (사용 패턴상 동시 진행 케이스가 거의 없음 가정).
 */
export function useSeriesPostsMutation(options: MutationOptions = {}): UseSeriesPostsMutationReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addPost = useCallback((seriesId: string, postId: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        return addPostToSeries({ series_id: seriesId, post_id: postId })
            .then((response) => {
                if (response.success) {
                    options.onSuccess?.();
                    return true;
                }
                setError(response.error || '포스트 추가에 실패했습니다.');
                options.onError?.(response.error || '');
                return false;
            })
            .catch(() => {
                setError('포스트 추가 중 오류가 발생했습니다.');
                return false;
            })
            .finally(() => setIsLoading(false));
    }, [options]);

    const removePost = useCallback((seriesId: string, postId: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        return removePostFromSeries(seriesId, postId)
            .then((response) => {
                if (response.success) {
                    options.onSuccess?.();
                    return true;
                }
                setError(response.error || '포스트 제거에 실패했습니다.');
                options.onError?.(response.error || '');
                return false;
            })
            .catch(() => {
                setError('포스트 제거 중 오류가 발생했습니다.');
                return false;
            })
            .finally(() => setIsLoading(false));
    }, [options]);

    const reorderPosts = useCallback((
        seriesId: string,
        postOrders: { post_id: string; order_index: number }[]
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        return reorderSeriesPosts({ series_id: seriesId, post_orders: postOrders })
            .then((response) => {
                if (response.success) {
                    options.onSuccess?.();
                    return true;
                }
                setError(response.error || '순서 변경에 실패했습니다.');
                return false;
            })
            .catch(() => {
                setError('순서 변경 중 오류가 발생했습니다.');
                return false;
            })
            .finally(() => setIsLoading(false));
    }, [options]);

    return { addPost, removePost, reorderPosts, isLoading, error };
}
