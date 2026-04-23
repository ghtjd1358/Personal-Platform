import { getSupabase } from '@sonhoseong/mfa-lib';

export const getByUserId = (userId: string) =>
    getSupabase().from('features').select('*').eq('user_id', userId).order('order_index');
