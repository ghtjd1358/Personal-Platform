import { getSupabase } from '@sonhoseong/mfa-lib';
import type { ExperienceInput } from '../types';

/** experience 부분 수정 */
export const update = (id: string, data: Partial<ExperienceInput>) =>
    getSupabase().from('experiences').update(data).eq('id', id).select().single();
