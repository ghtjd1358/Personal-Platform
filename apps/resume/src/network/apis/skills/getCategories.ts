import { getSupabase } from '@sonhoseong/mfa-lib';
import type { SkillCategoryWithSkills } from './types';

/**
 * skill_categories + skills 를 분리 쿼리로 fetch 후 클라이언트에서 조인.
 * nested select 대신 2-query 를 쓰는 이유는 관계명 충돌 방지 + 단순성 우선.
 */
export const getCategories = async (): Promise<SkillCategoryWithSkills[]> => {
    const { data: categories, error: catError } = await getSupabase()
        .from('skill_categories')
        .select('*')
        .order('order_index');

    if (catError) throw catError;
    if (!categories) return [];

    const { data: skills, error: skillError } = await getSupabase()
        .from('skills')
        .select('*')
        .order('order_index');

    if (skillError) throw skillError;

    return categories.map((cat) => ({
        id: cat.id,
        label: cat.label,
        order_index: cat.order_index,
        skills: (skills || [])
            .filter((s) => s.category_id === cat.id)
            .map((s) => ({
                id: s.id,
                name: s.name,
                icon: s.icon,
                icon_color: s.icon_color,
                order_index: s.order_index,
            })),
    }));
};
