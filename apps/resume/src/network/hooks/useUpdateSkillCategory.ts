/**
 * useUpdateSkillCategory — skillsApi.updateCategory 훅 래퍼 (mutation).
 */
import { useCallback, useRef } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { skillsApi, type SkillCategoryInput } from '@/network/apis/supabase';

type UpdatedRow = Awaited<ReturnType<typeof skillsApi.updateCategory>>['data'];

export function useUpdateSkillCategory(options: { silent?: boolean } = {}) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (id: string, payload: Partial<SkillCategoryInput>): Promise<UpdatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                skillsApi.updateCategory(id, payload)
                    .then(({ data, error }) => {
                        if (error) throw error;
                        toastSuccess('카테고리가 수정되었습니다');
                        return data;
                    })
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) {
                            toastError(err?.message || '카테고리 수정 실패');
                        }
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
