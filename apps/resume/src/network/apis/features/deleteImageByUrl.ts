import { getSupabase } from '@sonhoseong/mfa-lib';
import { FEATURES_BUCKET } from './constants';

/**
 * 교체/삭제 시 orphan 파일 제거. public URL 에서 bucket path 만 뽑아 삭제.
 * 실패는 throw 하지 않음 — orphan 으로 남아도 치명적이지 않음 (최대 5MB 파일).
 */
export const deleteImageByUrl = async (publicUrl: string): Promise<void> => {
    if (!publicUrl) return;
    const marker = `/${FEATURES_BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = publicUrl.substring(idx + marker.length);
    const { error } = await getSupabase().storage.from(FEATURES_BUCKET).remove([path]);
    if (error) console.warn('[featuresApi.deleteImageByUrl] 삭제 실패 (무시):', error.message);
};
