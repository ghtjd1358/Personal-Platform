import { useState, useEffect } from 'react';
import { getSeriesDetail, SeriesDetailFull } from '@/network';

interface UseSeriesDetailReturn {
    series: SeriesDetailFull | null;
    isLoading: boolean;
    error: string | null;
}

/**
 * 시리즈 상세 조회 — slug 기준.
 * 에러는 state 로 반환 (`useSeries` 처럼 throw 하지 않음 — caller 가 inline UI 표시).
 */
export function useSeriesDetail(slug: string | undefined): UseSeriesDetailReturn {
    const [series, setSeries] = useState<SeriesDetailFull | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setError('시리즈 ID가 없습니다.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        getSeriesDetail(slug)
            .then((response) => {
                if (response.success && response.data) {
                    setSeries(response.data);
                } else {
                    setError(response.error || '시리즈를 불러올 수 없습니다.');
                }
            })
            .catch(() => setError('시리즈 조회 중 오류가 발생했습니다.'))
            .finally(() => setIsLoading(false));
    }, [slug]);

    return { series, isLoading, error };
}
