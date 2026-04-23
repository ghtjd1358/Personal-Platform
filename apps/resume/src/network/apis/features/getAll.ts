import { getSupabase } from '@sonhoseong/mfa-lib';

export const getAll = () =>
    getSupabase().from('features').select('*').order('order_index');
