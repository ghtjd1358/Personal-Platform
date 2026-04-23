import { getSupabase } from '@sonhoseong/mfa-lib';

export const getAll = () =>
    getSupabase().from('portfolios').select('*').order('order_index');
