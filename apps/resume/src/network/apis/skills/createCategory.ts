import { getSupabase } from '@sonhoseong/mfa-lib';
import type { SkillCategoryInput } from './types';

/**
 * Category 생성.
 * RLS (auth.uid() = user_id) + NOT NULL (name, label) 두 제약을 한 번에 만족시킨다.
 * - user_id: payload 없으면 세션 uid 주입
 * - name: 별도로 안 주면 label 값 재사용 (내부 slug 역할)
 */
export const createCategory = async (
    data: SkillCategoryInput & { user_id?: string; name?: string },
) => {
    const uid = data.user_id ?? (await getSupabase().auth.getUser()).data.user?.id;
    return getSupabase()
        .from('skill_categories')
        .insert({
            ...data,
            name: data.name ?? data.label,
            user_id: uid,
        })
        .select()
        .single();
};
