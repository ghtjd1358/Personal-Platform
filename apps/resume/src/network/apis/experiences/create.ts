import { getSupabase } from '@sonhoseong/mfa-lib';
import type { ExperienceInput } from '../types';

/** experience 생성 */
export const create = (data: ExperienceInput) =>
    getSupabase().from('experiences').insert(data).select().single();
