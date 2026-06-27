import { useState, useEffect } from 'react';
import { getSeries, SeriesDetail } from '@/network';

interface UseSeriesReturn {
    series: SeriesDetail[];
    isLoading: boolean;
}

/**
 * 시리즈 목록 조회 — userId 필터 옵션.
 * 에러 시 throw → ErrorBoundary 처리 위임.
 */
export function useSeries(userId?: string): UseSeriesReturn {
    const [series, setSeries] = useState<SeriesDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        getSeries(userId)
            .then((response) => {
                if (response.success && response.data) {
                    setSeries(response.data);
                } else {
                    setError(response.error || '시리즈를 불러올 수 없습니다.');
                }
            })
            .catch(() => setError('시리즈 조회 중 오류가 발생했습니다.'))
            .finally(() => setIsLoading(false));
    }, [userId]);

    if (error) {
        throw new Error(error);
    }

    return { series, isLoading };
}
