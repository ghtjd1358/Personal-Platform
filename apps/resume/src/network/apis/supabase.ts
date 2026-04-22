import { getSupabase } from '@sonhoseong/mfa-lib'
import type { ExperienceInput, PortfolioInput } from './types'

// experiences 와 child 테이블(experience_tasks / experience_tags) 을
// 한 왕복으로 가져와 ExperienceDetail 모양(tasks: {id,task}[], tags: string[])으로 맞춰주는 쉐이퍼
export interface ExperienceWithDetails {
    id: string;
    user_id: string;
    resume_id: string | null;
    company: string;
    position: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    is_dev: boolean;
    description?: string | null;
    order_index: number;
    tasks: { id: string; task: string }[];
    tags: string[];
}

type NestedExpRow = {
    id: string;
    experience_tasks?: { id: string; task: string; order_index: number }[];
    experience_tags?: { tag: string }[];
    [key: string]: unknown;
};

const shapeExperience = (row: NestedExpRow): ExperienceWithDetails => {
    const { experience_tasks, experience_tags, ...rest } = row;
    return {
        ...(rest as Omit<ExperienceWithDetails, 'tasks' | 'tags'>),
        tasks: (experience_tasks || [])
            .slice()
            .sort((a, b) => a.order_index - b.order_index)
            .map((t) => ({ id: t.id, task: t.task })),
        tags: (experience_tags || []).map((t) => t.tag),
    };
};

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

    // nested fetch — home / edit 에서 tasks·tags 포함 필요할 때
    getByUserIdWithDetails: async (userId: string): Promise<ExperienceWithDetails[]> => {
        const { data, error } = await getSupabase()
            .from('experiences')
            .select('*, experience_tasks(id, task, order_index), experience_tags(tag)')
            .eq('user_id', userId)
            .order('order_index');
        if (error) throw error;
        return (data || []).map(shapeExperience);
    },

    getByIdWithDetails: async (id: string): Promise<ExperienceWithDetails | null> => {
        const { data, error } = await getSupabase()
            .from('experiences')
            .select('*, experience_tasks(id, task, order_index), experience_tags(tag)')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data ? shapeExperience(data) : null;
    },

    // tasks / tags 저장 — delete-all + re-insert (experience_tasks 엔 자식 FK 없어 안전)
    replaceChildren: async (experienceId: string, tasks: string[], tags: string[]) => {
        const sb = getSupabase();
        const [delTasks, delTags] = await Promise.all([
            sb.from('experience_tasks').delete().eq('experience_id', experienceId),
            sb.from('experience_tags').delete().eq('experience_id', experienceId),
        ]);
        if (delTasks.error) throw delTasks.error;
        if (delTags.error) throw delTags.error;

        if (tasks.length > 0) {
            const rows = tasks.map((t, i) => ({ experience_id: experienceId, task: t, order_index: i }));
            const { error } = await sb.from('experience_tasks').insert(rows);
            if (error) throw error;
        }
        if (tags.length > 0) {
            const rows = tags.map((t) => ({ experience_id: experienceId, tag: t }));
            const { error } = await sb.from('experience_tags').insert(rows);
            if (error) throw error;
        }
    },
}

// 프로젝트(= portfolios) 를 mockProjects 모양으로 쉐이핑한 타입
export interface PortfolioWithDetails {
    id: string;
    user_id: string;
    resume_id: string | null;
    title: string;
    role: string | null;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    image_url?: string | null;
    order_index: number;
    tasks: { id: string; task: string }[];
    tags: string[];
}

type NestedPortfolioRow = {
    id: string;
    portfolio_tasks?: { id: string; task: string; order_index: number }[];
    portfolio_tags?: { tag: string; order_index?: number }[];
    [key: string]: unknown;
};

const shapePortfolio = (row: NestedPortfolioRow): PortfolioWithDetails => {
    const { portfolio_tasks, portfolio_tags, ...rest } = row;
    return {
        ...(rest as Omit<PortfolioWithDetails, 'tasks' | 'tags'>),
        tasks: (portfolio_tasks || [])
            .slice()
            .sort((a, b) => a.order_index - b.order_index)
            .map((t) => ({ id: t.id, task: t.task })),
        tags: (portfolio_tags || [])
            .slice()
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((t) => t.tag),
    };
};

// Portfolios CRUD (= Projects on resume side)
export const portfoliosApi = {
    getAll: () => getSupabase().from('portfolios').select('*').order('order_index'),
    getByUserId: (userId: string) => getSupabase().from('portfolios').select('*').eq('user_id', userId).order('order_index'),
    getByResumeId: (resumeId: string) => getSupabase().from('portfolios').select('*').eq('resume_id', resumeId).order('order_index'),
    getById: (id: string) => getSupabase().from('portfolios').select('*').eq('id', id).single(),
    // slug NOT NULL 이므로 client 가 안 주면 title 기반 자동 생성 + uniqueness 보장 timestamp suffix
    create: async (data: PortfolioInput) => {
        const autoSlug = (() => {
            if (data.slug) return data.slug;
            const ascii = (data.title || '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            const suffix = Date.now().toString(36).slice(-5);
            return ascii.length >= 3 ? `${ascii}-${suffix}` : `proj-${suffix}`;
        })();
        return getSupabase()
            .from('portfolios')
            .insert({ ...data, slug: autoSlug })
            .select()
            .single();
    },
    update: (id: string, data: Partial<PortfolioInput>) => getSupabase().from('portfolios').update(data).eq('id', id).select().single(),
    delete: (id: string) => getSupabase().from('portfolios').delete().eq('id', id),
    countByResumeId: async (resumeId: string) => {
        const { count, error } = await getSupabase()
            .from('portfolios')
            .select('*', { count: 'exact', head: true })
            .eq('resume_id', resumeId);
        if (error) throw error;
        return count || 0;
    },

    // nested fetch for home & admin
    getByResumeIdWithDetails: async (resumeId: string): Promise<PortfolioWithDetails[]> => {
        const { data, error } = await getSupabase()
            .from('portfolios')
            .select('*, portfolio_tasks(id, task, order_index), portfolio_tags(tag, order_index)')
            .eq('resume_id', resumeId)
            .order('order_index');
        if (error) throw error;
        return (data || []).map(shapePortfolio);
    },

    getByIdWithDetails: async (id: string): Promise<PortfolioWithDetails | null> => {
        const { data, error } = await getSupabase()
            .from('portfolios')
            .select('*, portfolio_tasks(id, task, order_index), portfolio_tags(tag, order_index)')
            .eq('id', id)
            .maybeSingle();
        if (error) throw error;
        return data ? shapePortfolio(data) : null;
    },

    replaceChildren: async (portfolioId: string, tasks: string[], tags: string[]) => {
        const sb = getSupabase();
        const [delTasks, delTags] = await Promise.all([
            sb.from('portfolio_tasks').delete().eq('portfolio_id', portfolioId),
            sb.from('portfolio_tags').delete().eq('portfolio_id', portfolioId),
        ]);
        if (delTasks.error) throw delTasks.error;
        if (delTags.error) throw delTags.error;

        if (tasks.length > 0) {
            const rows = tasks.map((t, i) => ({ portfolio_id: portfolioId, task: t, order_index: i }));
            const { error } = await sb.from('portfolio_tasks').insert(rows);
            if (error) throw error;
        }
        if (tags.length > 0) {
            const rows = tags.map((t, i) => ({ portfolio_id: portfolioId, tag: t, order_index: i }));
            const { error } = await sb.from('portfolio_tags').insert(rows);
            if (error) throw error;
        }
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

export interface SkillCategoryInput {
    label: string;
    order_index?: number;
}

export interface SkillInput {
    category_id: string;
    name: string;
    icon?: string;
    icon_color?: string;
    order_index?: number;
}

export const skillsApi = {
    // 모든 카테고리 + 스킬 조회 (read)
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

    // ===== Category CRUD =====
    // RLS (auth.uid() = user_id) + 스키마 NOT NULL (name, label) 두 제약을 한 번에 만족시킴.
    // - user_id: payload 없으면 세션 uid 주입
    // - name: 별도로 안 주면 label 값 재사용 (내부 slug 역할)
    createCategory: async (data: SkillCategoryInput & { user_id?: string; name?: string }) => {
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
    },
    updateCategory: (id: string, data: Partial<SkillCategoryInput>) =>
        getSupabase().from('skill_categories').update(data).eq('id', id).select().single(),
    deleteCategory: (id: string) =>
        getSupabase().from('skill_categories').delete().eq('id', id),

    // ===== Skill CRUD =====
    getSkillById: (id: string) =>
        getSupabase().from('skills').select('*').eq('id', id).single(),
    createSkill: async (data: SkillInput & { user_id?: string }) => {
        const uid = data.user_id ?? (await getSupabase().auth.getUser()).data.user?.id;
        return getSupabase()
            .from('skills')
            .insert({ ...data, user_id: uid })
            .select()
            .single();
    },
    updateSkill: (id: string, data: Partial<SkillInput>) =>
        getSupabase().from('skills').update(data).eq('id', id).select().single(),
    deleteSkill: (id: string) =>
        getSupabase().from('skills').delete().eq('id', id),
}
