/**
 * useHomePageData - 사이트 owner 의 이력서/포트폴리오 데이터를 Supabase 에서 fetch.
 * 비로그인 방문자도 owner 데이터를 볼 수 있도록 OWNER_USER_ID fallback 사용.
 * 로그인 사용자는 자신의 데이터를 봄.
 */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken, getSupabase } from '@sonhoseong/mfa-lib';
import {
    experiencesApi,
    portfoliosApi,
    skillsApi,
    featuresApi,
    type SkillCategoryWithSkills,
} from '../../../network/apis/supabase';
import type { Feature } from '../../../network/apis/types';
import { OWNER_USER_ID } from '../../../config/constants';
import type {
    ResumeProfileDetail,
    SkillCategoryDetail,
    ExperienceDetail,
    ProjectDetail,
    PortfolioItem,
    FeatureItem,
    ContactLink,
} from '../../../types';

type HomeData = {
    profile: ResumeProfileDetail | null;
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
    const accessToken = useSelector(selectAccessToken);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ResumeProfileDetail | null>(null);
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
                // 로그인 사용자가 있으면 그 사용자 id, 없으면 사이트 owner id.
                // 어느 쪽이든 DB RLS 정책은 공개 select 허용.
                let userId = OWNER_USER_ID;
                if (accessToken) {
                    const { data: userResp } = await getSupabase().auth.getUser();
                    if (userResp?.user?.id) userId = userResp.user.id;
                }
                if (cancelled) return;

                const { data: primaryResume } = await getSupabase()
                    .from('resume_profile')
                    .select('id')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle();
                const resumeId = primaryResume?.id;

                const [profileResp, skillsResp, expWithDetails, projWithDetails, portfolioRows, featuresResp] = await Promise.all([
                    getSupabase().from('resume_profile').select('*').eq('user_id', userId).maybeSingle(),
                    skillsApi.getCategories().catch(() => [] as SkillCategoryWithSkills[]),
                    experiencesApi.getByUserIdWithDetails(userId).catch(() => []),
                    resumeId
                        ? portfoliosApi.getByResumeIdWithDetails(resumeId).catch(() => [])
                        : Promise.resolve([]),
                    // "주요 작업물" 섹션 — portfolios 전체 필드 + tags/tasks 중첩 fetch
                    resumeId
                        ? getSupabase()
                            .from('portfolios')
                            .select('*, portfolio_tags(tag, order_index), portfolio_tasks(task, order_index)')
                            .eq('resume_id', resumeId)
                            .eq('is_public', true)
                            .order('order_index', { ascending: true })
                            .then((r) => (r.data ?? []) as PortfolioRow[])
                            .catch(() => [] as PortfolioRow[])
                        : Promise.resolve([] as PortfolioRow[]),
                    featuresApi.getByUserId(userId).then((r) => r.data ?? []).catch(() => [] as Feature[]),
                ]);

                if (cancelled) return;

                let gotAnyLiveData = false;

                if (profileResp.data) {
                    setProfile(profileResp.data as ResumeProfileDetail);
                    gotAnyLiveData = true;
                }

                if (Array.isArray(skillsResp) && skillsResp.length > 0) {
                    setSkillCategories(mapSkillCategories(skillsResp));
                    gotAnyLiveData = true;
                }

                if (expWithDetails.length > 0) {
                    setExperiences(expWithDetails as ExperienceDetail[]);
                    gotAnyLiveData = true;
                }

                if (projWithDetails.length > 0) {
                    setProjects(projWithDetails as ProjectDetail[]);
                    gotAnyLiveData = true;
                }

                if (portfolioRows.length > 0) {
                    setPortfolioData(mapPortfolios(portfolioRows));
                    gotAnyLiveData = true;
                }

                if (Array.isArray(featuresResp) && featuresResp.length > 0) {
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
    }, [accessToken]);

    return {
        profile,
        skillCategories,
        experiences,
        projects,
        portfolioData,
        features,
        // contactLinks: 별도 테이블 도입 전까지 빈 배열 (mock 제거)
        contactLinks: [],
        loading,
        isLive,
    };
};
