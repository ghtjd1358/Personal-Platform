/**
 * skills 도메인 barrel — `skillsApi.xxx` 호출 호환 유지용 aggregator.
 * 각 메서드는 자기 파일에 분리 (한 파일 = 한 기능).
 */
import { getCategories } from './getCategories';
import { createCategory } from './createCategory';
import { updateCategory } from './updateCategory';
import { deleteCategory } from './deleteCategory';
import { getSkillById } from './getSkillById';
import { createSkill } from './createSkill';
import { updateSkill } from './updateSkill';
import { deleteSkill } from './deleteSkill';

export const skillsApi = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill,
};

export type {
    SkillCategoryWithSkills,
    SkillCategoryInput,
    SkillInput,
} from './types';
