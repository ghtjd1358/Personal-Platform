import { getSupabase } from '@sonhoseong/mfa-lib';

/** 특정 user 의 experiences 조회 */
export const getByUserId = (userId: string) =>
    getSupabase().from('experiences').select('*').eq('user_id', userId).order('order_index');
