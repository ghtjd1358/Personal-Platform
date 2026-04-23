/**
 * Resume remote — API hook barrel.
 * 모든 API 호출은 여기 훅을 통해서. 페이지/컴포넌트는 직접 `skillsApi.xxx` 호출 금지
 * (loading / error toast / abort 중복 구현 방지).
 *
 * 규칙:
 *   - fetch 훅: `{ data }` 만 반환. 로딩은 Root `<GlobalLoading/>` 담당
 *   - mutation 훅: `Promise<data | false>` 반환. 훅 내부에서 성공/실패 토스트
 *   - silent 옵션으로 토스트 끌 수 있음 (optimistic UI, composed save flow 등)
 */

// ===== skills =====
export { useFetchSkillCategories } from './useFetchSkillCategories';
export { useFetchSkillById } from './useFetchSkillById';
export { useCreateSkillCategory } from './useCreateSkillCategory';
export { useUpdateSkillCategory } from './useUpdateSkillCategory';
export { useDeleteSkillCategory } from './useDeleteSkillCategory';
export { useCreateSkill } from './useCreateSkill';
export { useUpdateSkill } from './useUpdateSkill';
export { useDeleteSkill } from './useDeleteSkill';

// ===== experiences =====
export { useFetchExperiences } from './useFetchExperiences';
export { useFetchExperiencesByUserId } from './useFetchExperiencesByUserId';
export { useFetchExperiencesByResumeId } from './useFetchExperiencesByResumeId';
export { useFetchExperienceById } from './useFetchExperienceById';
export { useFetchExperiencesByUserIdWithDetails } from './useFetchExperiencesByUserIdWithDetails';
export { useFetchExperienceByIdWithDetails } from './useFetchExperienceByIdWithDetails';
export { useCountExperiencesByResumeId } from './useCountExperiencesByResumeId';
export { useCreateExperience } from './useCreateExperience';
export { useUpdateExperience } from './useUpdateExperience';
export { useDeleteExperience } from './useDeleteExperience';
export { useReplaceExperienceChildren } from './useReplaceExperienceChildren';

// ===== portfolios =====
export { useFetchPortfolios } from './useFetchPortfolios';
export { useFetchPortfoliosByUserId } from './useFetchPortfoliosByUserId';
export { useFetchPortfoliosByResumeId } from './useFetchPortfoliosByResumeId';
export { useFetchPortfolioById } from './useFetchPortfolioById';
export { useFetchPortfoliosByResumeIdWithDetails } from './useFetchPortfoliosByResumeIdWithDetails';
export { useFetchPortfolioByIdWithDetails } from './useFetchPortfolioByIdWithDetails';
export { useCountPortfoliosByResumeId } from './useCountPortfoliosByResumeId';
export { useCreatePortfolio } from './useCreatePortfolio';
export { useUpdatePortfolio } from './useUpdatePortfolio';
export { useDeletePortfolio } from './useDeletePortfolio';
export { useReplacePortfolioChildren } from './useReplacePortfolioChildren';

// ===== features =====
export { useFetchFeatures } from './useFetchFeatures';
export { useFetchFeaturesByUserId } from './useFetchFeaturesByUserId';
export { useFetchFeatureById } from './useFetchFeatureById';
export { useCreateFeature } from './useCreateFeature';
export { useUpdateFeature } from './useUpdateFeature';
export { useDeleteFeature } from './useDeleteFeature';
export { useUploadFeatureImage } from './useUploadFeatureImage';
export { useDeleteFeatureImage } from './useDeleteFeatureImage';
