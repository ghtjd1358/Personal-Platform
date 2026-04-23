/**
 * useCreateSkill — skillsApi.createSkill 훅 래퍼 (mutation).
 * KOMCA 패턴: useCallback 으로 trigger 반환 + prev in-flight 취소 + showGlobalLoading + 실패 toast.
 * 페이지는 `const create = useCreateSkill(); const res = await create(payload);` — 성공(데이터) / 실패(false) 분기만.
 */
import { useCallback, useRef } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { skillsApi, type SkillInput } from '@/network/apis/supabase';

type CreatePayload = SkillInput & { user_id?: string };

type CreatedRow = Awaited<ReturnType<typeof skillsApi.createSkill>>['data'];

export function useCreateSkill(options: { silent?: boolean } = {}) {
    // prev 요청 취소용 — Supabase 는 AbortController 지원. 중복 클릭 방어.
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError, success: toastSuccess } = useToast();

    return useCallback(
        async (payload: CreatePayload): Promise<CreatedRow | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                skillsApi.createSkill(payload)
                    .then(({ data, error }) => {
                        if (error) throw error;
                        toastSuccess('스킬이 추가되었습니다');
                        return data;
                    })
                    .catch((err) => {
                        // abort 는 의도된 취소 — silent
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) {
                            toastError(err?.message || '스킬 추가 실패');
                        }
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, toastSuccess, options.silent],
    );
}
