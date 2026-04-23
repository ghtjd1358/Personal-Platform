import { getSupabase } from '@sonhoseong/mfa-lib';

/** 파일명은 delete 예약어 회피를 위해 deleteCategory. barrel 에서 deleteCategory 그대로 노출. */
export const deleteCategory = (id: string) =>
    getSupabase().from('skill_categories').delete().eq('id', id);
