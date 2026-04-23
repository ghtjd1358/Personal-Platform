import { getSupabase } from '@sonhoseong/mfa-lib';

/** id 로 단일 experience 조회 */
export const getById = (id: string) =>
    getSupabase().from('experiences').select('*').eq('id', id).single();
