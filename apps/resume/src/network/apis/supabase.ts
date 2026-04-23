/**
 * ⚠️ 구 supabase.ts 는 도메인별 폴더로 완전 이관됨.
 * 이 파일은 기존 consumer 호환 용도의 얇은 re-export 층만 유지한다.
 * 새 코드는 `@/network/apis` barrel 또는 각 도메인 폴더에서 직접 import 할 것.
 *
 *   - experiencesApi  → ./experiences/
 *   - portfoliosApi   → ./portfolios/
 *   - skillsApi       → ./skills/
 *   - featuresApi     → ./features/
 */

export { experiencesApi } from './experiences';
export type { ExperienceWithDetails } from './experiences';

export { portfoliosApi } from './portfolios';
export type { PortfolioWithDetails } from './portfolios';

export { skillsApi } from './skills';
export type {
    SkillCategoryWithSkills,
    SkillCategoryInput,
    SkillInput,
} from './skills';

export { featuresApi } from './features';
