/**
 * useDeleteSkillCategory — skillsApi.deleteCategory 훅 래퍼 (mutation).
 */
import { useCallback, useRef } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { skillsApi } from '@/network/apis/supabase';

export function useDeleteSkillCategory(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (id: string): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                skillsApi.deleteCategory(id)
                    .then(({ error }) => {
                        if (error) throw error;
                        toastSuccess('카테고리가 삭제되었습니다');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) {
                            toastError(err?.message || '카테고리 삭제 실패');
                        }
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
