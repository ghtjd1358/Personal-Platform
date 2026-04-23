/**
 * useFetchSkillCategories — skillsApi.getCategories() 훅 래퍼.
 * KOMCA 패턴: useEffect eager fetch + cancel + showGlobalLoading + 실패 시 toast.
 * 로딩 상태는 Root `<GlobalLoading/>` 이 전담 — 훅은 data 만 반환.
 * 페이지는 `const { categories } = useFetchSkillCategories(updater)` 한 줄로 끝.
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { skillsApi, type SkillCategoryWithSkills } from '@/network/apis/supabase';

/**
 * @param updater 수동 refetch 트리거 (`setUpdater(n+1)` 로 재조회). React Query 의 invalidate 대용.
 * @param options.silent true 면 실패 toast 표시 안 함 — empty state 로만 처리할 때.
 */
export function useFetchSkillCategories(
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [categories, setCategories] = useState<SkillCategoryWithSkills[]>([]);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        let cancelled = false;

        showGlobalLoading(
            skillsApi.getCategories()
                .then((data) => {
                    if (cancelled) return;
                    setCategories(data);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setCategories([]);
                    if (!options.silent) {
                        toastError(err?.message || '기술 카테고리 조회 실패');
                    }
                }),
        );

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updater]);

    return { categories };
}
