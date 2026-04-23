/**
 * useHomePageData - 로그인 유저의 이력서 데이터를 Supabase 에서 fetch.
 * mock 데이터는 제거됨 — 비로그인/빈 상태는 빈 배열로 정직하게 렌더.
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

export const useHomePageData = (): HomeData => {
    const accessToken = useSelector(selectAccessToken);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ResumeProfileDetail | null>(null);
    const [skillCategories, setSkillCategories] = useState<SkillCategoryDetail[]>([]);
    const [experiences, setExperiences] = useState<ExperienceDetail[]>([]);
    const [projects, setProjects] = useState<ProjectDetail[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const run = async () => {
            try {
                const { data: userResp } = await getSupabase().auth.getUser();
                const userId = userResp?.user?.id;
                if (!userId || cancelled) {
                    setLoading(false);
                    return;
                }

                // 현재 이력서 id — 프로젝트는 resume_id 기준으로 fetch
                const { data: primaryResume } = await getSupabase()
                    .from('resume_profile')
                    .select('id')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle();
                const resumeId = primaryResume?.id;

                const [profileResp, skillsResp, expWithDetails, projWithDetails, featuresResp] = await Promise.all([
                    getSupabase().from('resume_profile').select('*').eq('user_id', userId).maybeSingle(),
                    skillsApi.getCategories().catch(() => [] as SkillCategoryWithSkills[]),
                    experiencesApi.getByUserIdWithDetails(userId).catch(() => []),
                    resumeId
                        ? portfoliosApi.getByResumeIdWithDetails(resumeId).catch(() => [])
                        : Promise.resolve([]),
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
        features,
        // portfolioData / contactLinks: 별도 테이블 도입 전까지 빈 배열 (mock 제거)
        portfolioData: [],
        contactLinks: [],
        loading,
        isLive,
    };
};
