import { getSupabase } from '@sonhoseong/mfa-lib';
import type { SkillInput } from './types';

export const updateSkill = (id: string, data: Partial<SkillInput>) =>
    getSupabase().from('skills').update(data).eq('id', id).select().single();
