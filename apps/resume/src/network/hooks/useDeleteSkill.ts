/**
 * useDeleteSkill — skillsApi.deleteSkill 훅 래퍼 (mutation).
 */
import { useCallback, useRef } from 'react';
import {
    useShowGlobalLoading,
    useToast,
    useAdminReadOnlyGuard,
} from '@sonhoseong/mfa-lib';
import { skillsApi } from '@/network/apis/supabase';

export function useDeleteSkill(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();
    const guard = useAdminReadOnlyGuard();

    return useCallback(
        async (id: string): Promise<true | false> => {
            if (guard()) return false as const;
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                skillsApi.deleteSkill(id)
                    .then(({ error }) => {
                        if (error) throw error;
                        toastSuccess('스킬이 삭제되었습니다');
                        return true as const;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) {
                            toastError(err?.message || '스킬 삭제 실패');
                        }
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent, guard],
    );
}
