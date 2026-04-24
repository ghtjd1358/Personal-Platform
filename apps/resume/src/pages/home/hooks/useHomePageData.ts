/**
 * useHomePageData - 사이트 공개 컨텐츠를 Supabase 에서 fetch.
 *
 * 원칙: 일반 웹사이트 패턴 ("public content + ID 기반 조회").
 *  - 이 사이트는 single-owner 포트폴리오. multi-tenant 아님.
 *  - 모든 read 에서 user_id 필터 제거 → DB 에 있는 데이터를 그대로 노출.
 *  - 로그인 필요 없음. auth.getUser() 호출도 불필요.
 *  - write path (admin 편집) 은 여전히 user_id 기반 (본인 것만 수정) — 이 훅과 별개.
 */
import { useEffect, useState } from 'react';
import { getSupabase } from '@sonhoseong/mfa-lib';
import { skillsApi, type SkillCategoryWithSkills } from '../../../network/apis/supabase';
import type { Feature } from '../../../network/apis/types';
import type {
    SkillCategoryDetail,
    ExperienceDetail,
    ProjectDetail,
    PortfolioItem,
    FeatureItem,
    ContactLink,
} from '../../../types';

type HomeData = {
    skillCategories: SkillCategoryDetail[];
    experiences: ExperienceDetail[];
    projects: ProjectDetail[];
    portfolioData: PortfolioItem[];
    features: FeatureItem[] | Feature[];
    contactLinks: ContactLink[];
    loading: boolean;
    isLive: boolean;
};

/** Supabase SkillCategoryWithSkills → SkillCategoryDetail shape 변환 */
const mapSkillCategories = (raw: SkillCategoryWithSkills[]): SkillCategoryDetail[] =>
    raw.map((cat) => ({
        id: cat.id,
        name: cat.label,
        skills: cat.skills.map((s) => ({
            id: s.id,
            name: s.name,
            icon: s.icon,
            icon_color: s.icon_color,
        })),
    }));

/** DB experiences row (+ tasks + tags) → ExperienceDetail shape 변환 */
interface ExperienceRow {
    id: string;
    company: string;
    position: string;
    start_date: string | null;
    end_date: string | null;
    is_current: boolean;
    is_dev: boolean;
    experience_tasks?: { id: string; task: string; order_index: number }[];
    experience_tags?: { tag: string }[];
}
const mapExperiences = (rows: ExperienceRow[]): ExperienceDetail[] =>
    rows.map((row) => ({
        id: row.id,
        company: row.company,
        position: row.position,
        start_date: row.start_date,
        end_date: row.end_date,
        is_current: row.is_current,
        is_dev: row.is_dev,
        tasks: (row.experience_tasks ?? [])
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((t) => ({ id: t.id, task: t.task })),
        tags: (row.experience_tags ?? []).map((t) => t.tag),
    }));

/** DB portfolios row (+ portfolio_tags + portfolio_tasks) → PortfolioItem shape 변환.
 *  "주요 작업물" 섹션이 요구하는 리치 shape (badge, desc, detail.links 등) 를 DB 필드에서 구성. */
interface PortfolioRow {
    id: string;
    title: string;
    badge: string | null;
    short_description: string | null;
    description: string | null;
    cover_image: string | null;
    image_url: string | null;
    demo_url: string | null;
    github_url: string | null;
    figma_url: string | null;
    other_url: string | null;
    role: string | null;
    start_date: string | null;
    end_date: string | null;
    portfolio_tasks?: { task: string; order_index: number }[];
    portfolio_tags?: { tag: string; order_index: number }[];
}

const mapPortfolios = (rows: PortfolioRow[]): PortfolioItem[] =>
    rows.map((row, idx) => {
        const links: { label: string; url: string }[] = [];
        if (row.demo_url) links.push({ label: 'Demo', url: row.demo_url });
        if (row.github_url) links.push({ label: 'GitHub', url: row.github_url });
        if (row.figma_url) links.push({ label: 'Figma', url: row.figma_url });
        if (row.other_url) links.push({ label: '블로그', url: row.other_url });

        const period = row.start_date && row.end_date
            ? `${row.start_date} ~ ${row.end_date}`
            : row.start_date ?? undefined;

        const tags = (row.portfolio_tags ?? [])
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((t) => t.tag);

        const tasks = (row.portfolio_tasks ?? [])
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((t) => t.task);

        return {
            id: idx + 1,
            badge: row.badge ?? '',
            title: row.title,
            image: row.cover_image ?? row.image_url ?? undefined,
            link: row.demo_url ?? undefined,
            desc: row.short_description ?? '',
            tags,
            detail: {
                period,
                role: row.role ?? undefined,
                description: row.description ?? undefined,
                tasks,
                links,
            },
        };
    });

export const useHomePageData = (): HomeData => {
    const [loading, setLoading] = useState(true);
    const [skillCategories, setSkillCategories] = useState<SkillCategoryDetail[]>([]);
    const [experiences, setExperiences] = useState<ExperienceDetail[]>([]);
    const [projects, setProjects] = useState<ProjectDetail[]>([]);
    const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                console.log('[useHomePageData] start (public fetch, no user filter)');
                const sb = getSupabase();

                // resume_profile fetch 제거 — Hero summary 는 하드코딩으로 전환 (FOUC 제거).
                // 모든 read 에 user_id 필터 없음. DB 에 존재하는 데이터를 그대로 읽음.
                const [skillsResp, expResp, portfolioResp, featuresResp] = await Promise.all([
                    skillsApi.getCategories().catch(() => [] as SkillCategoryWithSkills[]),
                    sb.from('experiences')
                        .select('*, experience_tasks(id, task, order_index), experience_tags(tag)')
                        .order('order_index', { ascending: true })
                        .then((r) => (r.data ?? []) as ExperienceRow[])
                        .catch(() => [] as ExperienceRow[]),
                    sb.from('portfolios')
                        .select('*, portfolio_tags(tag, order_index), portfolio_tasks(task, order_index)')
                        .eq('is_public', true)
                        .order('order_index', { ascending: true })
                        .then((r) => (r.data ?? []) as PortfolioRow[])
                        .catch(() => [] as PortfolioRow[]),
                    sb.from('features')
                        .select('*')
                        .order('order_index', { ascending: true })
                        .then((r) => (r.data ?? []) as Feature[])
                        .catch(() => [] as Feature[]),
                ]);

                if (cancelled) return;

                console.log('[useHomePageData] fetched', {
                    skillsCount: skillsResp.length,
                    expCount: expResp.length,
                    portfolioCount: portfolioResp.length,
                    featuresCount: featuresResp.length,
                });

                let gotAnyLiveData = false;

                if (skillsResp.length > 0) {
                    setSkillCategories(mapSkillCategories(skillsResp));
                    gotAnyLiveData = true;
                }

                if (expResp.length > 0) {
                    setExperiences(mapExperiences(expResp));
                    gotAnyLiveData = true;
                }

                if (portfolioResp.length > 0) {
                    setPortfolioData(mapPortfolios(portfolioResp));
                    // "경력 섹션 - 프로젝트 timeline" 도 portfolios 를 재사용. ProjectDetail shape 로 매핑.
                    setProjects(portfolioResp.map((row): ProjectDetail => ({
                        id: row.id,
                        title: row.title,
                        role: row.role ?? '',
                        start_date: row.start_date,
                        end_date: row.end_date,
                        is_current: false,
                        tasks: (row.portfolio_tasks ?? [])
                            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                            .map((t, i) => ({ id: `${row.id}-${i}`, task: t.task })),
                        tags: (row.portfolio_tags ?? [])
                            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
                            .map((t) => t.tag),
                        image: row.cover_image ?? row.image_url ?? undefined,
                    })));
                    gotAnyLiveData = true;
                }

                if (featuresResp.length > 0) {
                    setFeatures(featuresResp);
                    gotAnyLiveData = true;
                }

                setIsLive(gotAnyLiveData);
            } catch (err) {
                console.error('[useHomePageData] Supabase fetch 실패:', err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, []);

    return {
        skillCategories,
        experiences,
        projects,
        portfolioData,
        features,
        // contactLinks: 별도 테이블 도입 전까지 빈 배열
        contactLinks: [],
        loading,
        isLive,
    };
};
