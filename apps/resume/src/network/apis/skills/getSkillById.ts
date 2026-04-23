import { getSupabase } from '@sonhoseong/mfa-lib';

export const getSkillById = (id: string) =>
    getSupabase().from('skills').select('*').eq('id', id).single();
