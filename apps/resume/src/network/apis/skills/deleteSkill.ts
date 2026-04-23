import { getSupabase } from '@sonhoseong/mfa-lib';

export const deleteSkill = (id: string) =>
    getSupabase().from('skills').delete().eq('id', id);
