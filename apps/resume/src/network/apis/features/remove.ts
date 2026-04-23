import { getSupabase } from '@sonhoseong/mfa-lib';

/** 파일명은 remove (delete 예약어 회피). barrel 에서 `delete: remove` alias 로 노출. */
export const remove = (id: string) =>
    getSupabase().from('features').delete().eq('id', id);
