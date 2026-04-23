/**
 * useReplaceExperienceChildren — experiencesApi.replaceChildren 훅 래퍼 (mutation).
 * tasks/tags 자식 테이블 delete-all + re-insert. 에디터의 save flow 에서 사용.
 * API 가 async void 반환 — throw 만 catch. 성공 토스트는 상위 save 핸들러에서 처리하는 경우가 많아
 * 기본 silent 처리 (editor 페이지에서 "저장되었습니다" 한 번만 띄우기 위함).
 */
import { useCallback, useRef } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { experiencesApi } from '@/network/apis/supabase';

export function useReplaceExperienceChildren(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (experienceId: string, tasks: string[], tags: string[]): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                experiencesApi.replaceChildren(experienceId, tasks, tags)
                    .then(() => true as const)
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '경력 tasks/tags 저장 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
