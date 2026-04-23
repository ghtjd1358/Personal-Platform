import { getSupabase } from '@sonhoseong/mfa-lib';
import type { SkillInput } from './types';

/** payload 에 user_id 없으면 세션 uid 주입 — RLS `auth.uid() = user_id` 정책과 맞물리는 안전장치. */
export const createSkill = async (data: SkillInput & { user_id?: string }) => {
    const uid = data.user_id ?? (await getSupabase().auth.getUser()).data.user?.id;
    return getSupabase()
        .from('skills')
        .insert({ ...data, user_id: uid })
        .select()
        .single();
};
