import { getSupabase } from '@sonhoseong/mfa-lib';

export const getById = (id: string) =>
    getSupabase().from('portfolios').select('*').eq('id', id).single();
