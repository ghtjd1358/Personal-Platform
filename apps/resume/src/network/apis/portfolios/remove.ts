import { getSupabase } from '@sonhoseong/mfa-lib';

/** portfolio 삭제 (파일명 remove — JS 'delete' 예약어 회피) */
export const remove = (id: string) =>
    getSupabase().from('portfolios').delete().eq('id', id);
