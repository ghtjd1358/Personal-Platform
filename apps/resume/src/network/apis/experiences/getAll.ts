import { getSupabase } from '@sonhoseong/mfa-lib';

/** 모든 experiences 조회 (order_index 오름차순) */
export const getAll = () =>
    getSupabase().from('experiences').select('*').order('order_index');
