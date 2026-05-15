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
    PortfolioTag,
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
    /** Hero summary 두 줄 — DB resume_profile.summary (user_id IS NULL row, '\n' 으로 join).
     *  fetch 전엔 null → HeroSection 이 fallback 하드코딩 사용 (FOUC 회피). */
    heroSummary: string | null;
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

/** Skill 메타 JOIN — portfolio_tags / experience_tags 의 skill_id 가 가리키는 skills row.
 *  skill_categories 는 정렬용으로 order_index 끌어옴 (frontend → state → tools).
 *  null 가능 (niche tag 가 어떤 skill 도 매칭 안 된 경우 → 정렬 시 999 로 후순위). */
type SkillJoin = {
    icon: string | null;
    icon_color: string | null;
    skill_categories?: { order_index: number | null } | null;
} | null;

type TagRow = { tag: string; order_index?: number | null; skills?: SkillJoin };

/** DB tag row → PortfolioTag shape 변환. */
const mapTag = (t: TagRow): PortfolioTag => ({
    name: t.tag,
    iconKey: t.skills?.icon ?? null,
    iconColor: t.skills?.icon_color ?? null,
});

/** category order → tag order_index 순으로 정렬. 카테고리 미매칭 (skill_id NULL) 은 후순위. */
const sortTags = (a: TagRow, b: TagRow) => {
    const ca = a.skills?.skill_categories?.order_index ?? 999;
    const cb = b.skills?.skill_categories?.order_index ?? 999;
    if (ca !== cb) return ca - cb;
    return (a.order_index ?? 0) - (b.order_index ?? 0);
};

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
    experience_tags?: { tag: string; skills?: SkillJoin }[];
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
        tags: (row.experience_tags ?? []).slice().sort(sortTags).map(mapTag),
    }));

/** DB portfolios row (+ portfolio_tags + portfolio_tasks) → PortfolioItem shape 변환.
 *  "주요 작업물" 섹션이 요구하는 리치 shape (badge, desc, detail.links 등) 를 DB 필드에서 구성. */
interface PortfolioRow {
    id: string;
    title: string;
    badge: string | null;
    short_description: string | null;
    cover_image: string | null;
    image_url: string | null;
    demo_url: string | null;
    github_url: string | null;
    figma_url: string | null;
    other_url: string | null;
    notion_url: string | null;
    role: string | null;
    start_date: string | null;
    end_date: string | null;
    portfolio_tasks?: { task: string; order_index: number }[];
    portfolio_tags?: { tag: string; order_index: number; skills?: SkillJoin }[];
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

        const tags: PortfolioTag[] = (row.portfolio_tags ?? [])
            .slice()
            .sort(sortTags)
            .map(mapTag);

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
                tasks,
                links,
                notion_url: row.notion_url ?? undefined,
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
    const [heroSummary, setHeroSummary] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                console.log('[useHomePageData] start (public fetch, no user filter)');
                const sb = getSupabase();

                // resume_profile (user_id IS NULL row) → Hero summary 두 줄. fetch 결과 오기 전엔
                // HeroSection 이 fallback 하드코딩 사용 → FOUC 회피. 양치기 카피 다듬을 땐 SQL UPDATE 1번이면 끝.
                // 모든 read 에 user_id 필터 없음. DB 에 존재하는 데이터를 그대로 읽음.
                const [skillsResp, expResp, portfolioResp, featuresResp, profileResp] = await Promise.all([
                    skillsApi.getCategories().catch(() => [] as SkillCategoryWithSkills[]),
                    sb.from('experiences')
                        // experience_tags JOIN skills JOIN skill_categories — 카테고리 order 까지 끌어와 정렬용
                        .select('*, experience_tasks(id, task, order_index), experience_tags(tag, skills(icon, icon_color, skill_categories(order_index)))')
                        .order('order_index', { ascending: true })
                        .then((r) => (r.data ?? []) as ExperienceRow[])
                        .catch(() => [] as ExperienceRow[]),
                    sb.from('portfolios')
                        // portfolio_tags 도 동일하게 nested JOIN
                        .select('*, portfolio_tags(tag, order_index, skills(icon, icon_color, skill_categories(order_index))), portfolio_tasks(task, order_index)')
                        .eq('is_public', true)
                        .eq('show_on_resume', true)
                        .order('order_index', { ascending: true })
                        .then((r) => (r.data ?? []) as PortfolioRow[])
                        .catch(() => [] as PortfolioRow[]),
                    sb.from('features')
                        .select('*')
                        .order('order_index', { ascending: true })
                        .then((r) => (r.data ?? []) as Feature[])
                        .catch(() => [] as Feature[]),
                    sb.from('resume_profile')
                        .select('summary')
                        .is('user_id', null)
                        .maybeSingle()
                        .then((r) => (r.data?.summary as string | undefined) ?? null)
                        .catch(() => null as string | null),
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
                            .slice()
                            .sort(sortTags)
                            .map(mapTag),
                        image: row.cover_image ?? row.image_url ?? undefined,
                    })));
                    gotAnyLiveData = true;
                }

                if (featuresResp.length > 0) {
                    setFeatures(featuresResp);
                    gotAnyLiveData = true;
                }

                if (profileResp) {
                    setHeroSummary(profileResp);
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
        heroSummary,
        // contactLinks: 별도 테이블 도입 전까지 빈 배열
        contactLinks: [],
        loading,
        isLive,
    };
};
