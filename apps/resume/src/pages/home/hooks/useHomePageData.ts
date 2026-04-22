/**
 * useHomePageData - 로그인 유저의 이력서 데이터를 Supabase 에서 fetch.
 * 빈 상태(비로그인 / 데이터 없음)에선 mock 데이터로 fallback → UI 보존.
 */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '@sonhoseong/mfa-lib';
import {
    experiencesApi,
    portfoliosApi,
    skillsApi,
    featuresApi,
    type SkillCategoryWithSkills,
} from '../../../network/apis/supabase';
import type { Feature } from '../../../network/apis/types';
import {
    mockResumeProfile,
    mockSkillCategories,
    mockExperiences,
    mockProjects,
    mockPortfolioData,
    mockFeatures,
    mockContactLinks,
} from '../../../data';
import { getSupabase } from '@sonhoseong/mfa-lib';

type HomeData = {
    profile: typeof mockResumeProfile;
    skillCategories: typeof mockSkillCategories;
    experiences: typeof mockExperiences;
    projects: typeof mockProjects;
    portfolioData: typeof mockPortfolioData;
    features: typeof mockFeatures;
    contactLinks: typeof mockContactLinks;
    loading: boolean;
    isLive: boolean; // Supabase 데이터가 실제로 왔는지 (UI 뱃지용, 선택)
};

/** Supabase SkillCategoryWithSkills → mockSkillCategories 호환 shape 변환 */
const mapSkillCategories = (raw: SkillCategoryWithSkills[]) =>
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
    const [profile, setProfile] = useState(mockResumeProfile);
    const [skillCategories, setSkillCategories] = useState(mockSkillCategories);
    const [experiences, setExperiences] = useState(mockExperiences);
    const [projects, setProjects] = useState(mockProjects);
    const [features, setFeatures] = useState<typeof mockFeatures | Feature[]>(mockFeatures);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        console.log('[useHomePageData] effect tick', { hasAccessToken: !!accessToken });
        if (!accessToken) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const run = async () => {
            try {
                // 현재 로그인 유저 id
                const { data: userResp } = await getSupabase().auth.getUser();
                const userId = userResp?.user?.id;
                console.log('[useHomePageData] resolved userId', userId);
                if (!userId || cancelled) {
                    setLoading(false);
                    return;
                }

                // 현재 이력서 id — 프로젝트는 resume_id 기준으로 fetch (포트폴리오 remote 용과 분리)
                const { data: primaryResume } = await getSupabase()
                    .from('resume_profile')
                    .select('id')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle();
                const resumeId = primaryResume?.id;

                // 병렬 fetch (experiences + projects 모두 nested tasks/tags 포함)
                const [profileResp, skillsResp, expWithDetails, projWithDetails, featuresResp] = await Promise.all([
                    getSupabase().from('resume_profile').select('*').eq('user_id', userId).maybeSingle(),
                    skillsApi.getCategories().catch((e) => { console.error('[useHomePageData] skills fetch error', e); return [] as SkillCategoryWithSkills[]; }),
                    experiencesApi.getByUserIdWithDetails(userId).catch((e) => { console.error('[useHomePageData] exp fetch error', e); return []; }),
                    resumeId
                        ? portfoliosApi.getByResumeIdWithDetails(resumeId).catch((e) => { console.error('[useHomePageData] proj fetch error', e); return []; })
                        : Promise.resolve([]),
                    featuresApi.getByUserId(userId).then((r) => r.data ?? []).catch((e) => { console.error('[useHomePageData] features fetch error', e); return [] as Feature[]; }),
                ]);

                if (cancelled) return;

                console.log('[useHomePageData] fetched', {
                    profile: profileResp.data ? 'yes' : 'no',
                    skillsCount: skillsResp.length,
                    expCount: expWithDetails.length,
                    projCount: projWithDetails.length,
                });

                let gotAnyLiveData = false;

                // profile
                if (profileResp.data) {
                    setProfile({ ...mockResumeProfile, ...profileResp.data });
                    gotAnyLiveData = true;
                }

                // skills
                if (Array.isArray(skillsResp) && skillsResp.length > 0) {
                    setSkillCategories(mapSkillCategories(skillsResp) as typeof mockSkillCategories);
                    gotAnyLiveData = true;
                }

                // experiences (이미 tasks/tags 가 배열로 쉐이핑되어 mock shape 호환)
                if (expWithDetails.length > 0) {
                    setExperiences(expWithDetails as typeof mockExperiences);
                    gotAnyLiveData = true;
                }

                // projects (portfolios 에서 resume_id 필터 + tasks/tags nested)
                if (projWithDetails.length > 0) {
                    setProjects(projWithDetails as typeof mockProjects);
                    gotAnyLiveData = true;
                }

                // features ("이런 개발자입니다")
                if (Array.isArray(featuresResp) && featuresResp.length > 0) {
                    setFeatures(featuresResp as Feature[]);
                    gotAnyLiveData = true;
                }

                setIsLive(gotAnyLiveData);
            } catch (err) {
                console.error('[useHomePageData] Supabase fetch 실패, mock 유지:', err);
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
        features,   // DB 에서 fetch, 비어있으면 mock fallback
        // portfolioData/contactLinks 는 admin 페이지가 없어 mock 그대로
        portfolioData: mockPortfolioData,
        contactLinks: mockContactLinks,
        loading,
        isLive,
    };
};
