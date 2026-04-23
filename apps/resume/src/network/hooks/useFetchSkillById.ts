/**
 * useFetchSkillById — skillsApi.getSkillById() 훅 래퍼.
 * id 바뀌면 자동 재조회. id 가 falsy 면 fetch 생략 (new 모드 편집 페이지용).
 */
import { useEffect, useState } from 'react';
import {
    useShowGlobalLoading,
    useToast,
} from '@sonhoseong/mfa-lib';
import { skillsApi } from '@/network/apis/supabase';

type SkillRow = NonNullable<Awaited<ReturnType<typeof skillsApi.getSkillById>>['data']>;

export function useFetchSkillById(
    id: string | undefined,
    updater?: number,
    options: { silent?: boolean } = {},
) {
    const [skill, setSkill] = useState<SkillRow | null>(null);
    const showGlobalLoading = useShowGlobalLoading();
    const { error: toastError } = useToast();

    useEffect(() => {
        if (!id) {
            setSkill(null);
            return;
        }
        let cancelled = false;

        showGlobalLoading(
            skillsApi.getSkillById(id)
                .then(({ data, error }) => {
                    if (cancelled) return;
                    if (error) throw error;
                    setSkill(data as SkillRow);
                })
                .catch((err) => {
                    if (cancelled) return;
                    setSkill(null);
                    if (!options.silent) {
                        toastError(err?.message || '스킬 조회 실패');
                    }
                }),
        );

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, updater]);

    return { skill };
}
