import { useState, useCallback } from 'react';
import {
    createSeries,
    updateSeries,
    deleteSeries,
    SeriesDetail,
    CreateSeriesRequest,
    UpdateSeriesRequest,
} from '@/network';

interface MutationOptions {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

interface UseSeriesMutationReturn {
    create: (data: CreateSeriesRequest) => Promise<SeriesDetail | null>;
    isCreating: boolean;
    update: (id: string, data: UpdateSeriesRequest) => Promise<boolean>;
    isUpdating: boolean;
    remove: (id: string) => Promise<boolean>;
    isDeleting: boolean;
    error: string | null;
    resetError: () => void;
}

/**
 * 시리즈 CRUD (create/update/delete) — 각 액션별 loading state 분리.
 * 헤드리스: toast/navigate 없음, `onSuccess`/`onError` 콜백으로 UI 채널 wiring.
 */
export function useSeriesMutation(options: MutationOptions = {}): UseSeriesMutationReturn {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback((data: CreateSeriesRequest): Promise<SeriesDetail | null> => {
        setIsCreating(true);
        setError(null);

        return createSeries(data)
            .then((response) => {
                if (response.success && response.data) {
                    options.onSuccess?.();
                    return response.data;
                }
                const msg = response.error || '시리즈 생성에 실패했습니다.';
                setError(msg);
                options.onError?.(msg);
                return null;
            })
            .catch(() => {
                const msg = '시리즈 생성 중 오류가 발생했습니다.';
                setError(msg);
                options.onError?.(msg);
                return null;
            })
            .finally(() => setIsCreating(false));
    }, [options]);

    const update = useCallback((id: string, data: UpdateSeriesRequest): Promise<boolean> => {
        setIsUpdating(true);
        setError(null);

        return updateSeries(id, data)
            .then((response) => {
                if (response.success) {
                    options.onSuccess?.();
                    return true;
                }
                const msg = response.error || '시리즈 수정에 실패했습니다.';
                setError(msg);
                options.onError?.(msg);
                return false;
            })
            .catch(() => {
                const msg = '시리즈 수정 중 오류가 발생했습니다.';
                setError(msg);
                options.onError?.(msg);
                return false;
            })
            .finally(() => setIsUpdating(false));
    }, [options]);

    const remove = useCallback((id: string): Promise<boolean> => {
        setIsDeleting(true);
        setError(null);

        return deleteSeries(id)
            .then((response) => {
                if (response.success) {
                    options.onSuccess?.();
                    return true;
                }
                const msg = response.error || '시리즈 삭제에 실패했습니다.';
                setError(msg);
                options.onError?.(msg);
                return false;
            })
            .catch(() => {
                const msg = '시리즈 삭제 중 오류가 발생했습니다.';
                setError(msg);
                options.onError?.(msg);
                return false;
            })
            .finally(() => setIsDeleting(false));
    }, [options]);

    const resetError = useCallback(() => setError(null), []);

    return {
        create,
        isCreating,
        update,
        isUpdating,
        remove,
        isDeleting,
        error,
        resetError,
    };
}
