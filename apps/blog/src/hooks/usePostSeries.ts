import { useState, useEffect } from 'react';
import { getSeriesByPostId } from '@/network';

interface UsePostSeriesReturn {
    series: { series_id: string; title: string }[];
    isLoading: boolean;
}

/**
 * 특정 포스트가 속한 시리즈 목록 조회.
 * 에러는 console 만 — caller 가 empty array 로 graceful degrade.
 */
export function usePostSeries(postId: string | undefined): UsePostSeriesReturn {
    const [series, setSeries] = useState<{ series_id: string; title: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!postId) return;

        setIsLoading(true);

        getSeriesByPostId(postId)
            .then((response) => {
                if (response.success && response.data) {
                    setSeries(response.data);
                }
            })
            .catch((err) => console.error('Failed to fetch post series:', err))
            .finally(() => setIsLoading(false));
    }, [postId]);

    return { series, isLoading };
}
