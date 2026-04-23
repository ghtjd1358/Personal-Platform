import { getSupabase } from '@sonhoseong/mfa-lib';
import type { SkillCategoryInput } from './types';

export const updateCategory = (id: string, data: Partial<SkillCategoryInput>) =>
    getSupabase().from('skill_categories').update(data).eq('id', id).select().single();
