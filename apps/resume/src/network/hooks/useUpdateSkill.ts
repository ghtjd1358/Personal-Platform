/**
 * useUpdateSkill — skillsApi.updateSkill 훅 래퍼 (mutation).
 */
import { useCallback, useRef } from 'react';
import {
    useShowGlobalLoading,
    useToast,
    useAdminReadOnlyGuard,
} from '@sonhoseong/mfa-lib';
import { skillsApi, type SkillInput } from '@/network/apis/supabase';

type UpdatedRow = Awaited<ReturnType<typeof skillsApi.updateSkill>>['data'];

export function useUpdateSkill(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();
    const guard = useAdminReadOnlyGuard();

    return useCallback(
        async (id: string, payload: Partial<SkillInput>): Promise<UpdatedRow | false> => {
            if (guard()) return false as const;
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                skillsApi.updateSkill(id, payload)
                    .then(({ data, error }) => {
                        if (error) throw error;
                        toastSuccess('스킬이 수정되었습니다');
                        return data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) {
                            toastError(err?.message || '스킬 수정 실패');
                        }
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent, guard],
    );
}
