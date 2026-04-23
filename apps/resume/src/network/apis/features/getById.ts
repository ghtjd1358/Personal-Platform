import { getSupabase } from '@sonhoseong/mfa-lib';

export const getById = (id: string) =>
    getSupabase().from('features').select('*').eq('id', id).single();
