/**
 * useReplacePortfolioChildren — portfoliosApi.replaceChildren 훅 래퍼 (mutation).
 * portfolio_tasks / portfolio_tags 자식 테이블 delete-all + re-insert.
 * editor save flow 에서 상위 update 와 묶여 호출 → 기본 silent (상위에서 최종 토스트 1회).
 */
import { useCallback, useRef } from 'react';
import { useShowGlobalLoading, useToast } from '@sonhoseong/mfa-lib';
import { portfoliosApi } from '@/network/apis/supabase';

export function useReplacePortfolioChildren(options: { silent?: boolean } = { silent: true }) {
    const prevAbortRef = useRef<AbortController | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    return useCallback(
        async (portfolioId: string, tasks: string[], tags: string[]): Promise<true | false> => {
            if (prevAbortRef.current) prevAbortRef.current.abort();
            const controller = new AbortController();
            prevAbortRef.current = controller;

            return showGlobalLoading(
                portfoliosApi.replaceChildren(portfolioId, tasks, tags)
                    .then(() => true as const)
                    .catch((err) => {
                        if (err?.name === 'AbortError' || controller.signal.aborted) return false;
                        if (!options.silent) toastError(err?.message || '포트폴리오 tasks/tags 저장 실패');
                        return false as const;
                    }),
            );
        },
        [showGlobalLoading, toastError, options.silent],
    );
}
