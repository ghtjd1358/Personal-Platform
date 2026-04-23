import { getSupabase } from '@sonhoseong/mfa-lib';

/** experience 삭제. 파일명은 JS 예약어 'delete' 충돌 회피 위해 remove. */
export const remove = (id: string) =>
    getSupabase().from('experiences').delete().eq('id', id);
