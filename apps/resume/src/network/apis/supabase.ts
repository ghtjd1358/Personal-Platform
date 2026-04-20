import { getSupabase } from '@sonhoseong/mfa-lib'
import type { ExperienceInput, PortfolioInput } from './types'

// Experiences CRUD
export const experiencesApi = {
    getAll: () => getSupabase().from('experiences').select('*').order('order_index'),
    getByUserId: (userId: string) => getSupabase().from('experiences').select('*').eq('user_id', userId).order('order_index'),
    getByResumeId: (resumeId: string) => getSupabase().from('experiences').select('*').eq('resume_id', resumeId).order('order_index'),
    getById: (id: string) => getSupabase().from('experiences').select('*').eq('id', id).single(),
    create: (data: ExperienceInput) => getSupabase().from('experiences').insert(data).select().single(),
    update: (id: string, data: Partial<ExperienceInput>) => getSupabase().from('experiences').update(data).eq('id', id).select().single(),
    delete: (id: string) => getSupabase().from('experiences').delete().eq('id', id),
    // 이력서에 연결된 경력 개수 조회
    countByResumeId: async (resumeId: string) => {
        const { count, error } = await getSupabase()
            .from('experiences')
            .select('*', { count: 'exact', head: true })
            .eq('resume_id', resumeId);
        if (error) throw error;
        return count || 0;
    },
}

// Portfolios CRUD
export const portfoliosApi = {
    getAll: () => getSupabase().from('portfolios').select('*').order('order_index'),
    getByUserId: (userId: string) => getSupabase().from('portfolios').select('*').eq('user_id', userId).order('order_index'),
    getByResumeId: (resumeId: string) => getSupabase().from('portfolios').select('*').eq('resume_id', resumeId).order('order_index'),
    getById: (id: string) => getSupabase().from('portfolios').select('*').eq('id', id).single(),
    create: (data: PortfolioInput) => getSupabase().from('portfolios').insert(data).select().single(),
    update: (id: string, data: Partial<PortfolioInput>) => getSupabase().from('portfolios').update(data).eq('id', id).select().single(),
    delete: (id: string) => getSupabase().from('portfolios').delete().eq('id', id),
    // 이력서에 연결된 프로젝트 개수 조회
    countByResumeId: async (resumeId: string) => {
        const { count, error } = await getSupabase()
            .from('portfolios')
            .select('*', { count: 'exact', head: true })
            .eq('resume_id', resumeId);
        if (error) throw error;
        return count || 0;
    },
}

// Skills API - 기술 스택 조회
export interface SkillCategoryWithSkills {
    id: string;
    label: string;
    order_index: number;
    skills: {
        id: string;
        name: string;
        icon?: string;
        icon_color?: string;
        order_index: number;
    }[];
}

export const skillsApi = {
    // 모든 카테고리 + 스킬 조회
    getCategories: async (): Promise<SkillCategoryWithSkills[]> => {
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
    },
}
