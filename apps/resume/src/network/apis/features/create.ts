import { getSupabase } from '@sonhoseong/mfa-lib';
import type { FeatureInput } from '../types';

/** payload 에 user_id 없으면 세션 uid 주입 — RLS `auth.uid() = user_id` 정책과 맞물림. */
export const create = async (data: FeatureInput & { user_id?: string }) => {
    const uid = data.user_id ?? (await getSupabase().auth.getUser()).data.user?.id;
    return getSupabase()
        .from('features')
        .insert({ ...data, user_id: uid })
        .select()
        .single();
};
