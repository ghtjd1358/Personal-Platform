import { getSupabase } from '@sonhoseong/mfa-lib';
import { FEATURES_BUCKET } from './constants';

/**
 * Features 섹션 이미지 업로드 → public URL 반환.
 * 파일명은 "timestamp-원본파일명(특수문자 sanitize)" 로 중복 방지.
 * 경로: `{userId}/{timestamp}-{safe}` — Storage RLS 가 foldername[1] 과 auth.uid() 비교로 검증.
 */
export const uploadImage = async (userId: string, file: File): Promise<string> => {
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${userId}/${Date.now()}-${safe}`;
    const { error } = await getSupabase().storage
        .from(FEATURES_BUCKET)
        .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
        });
    if (error) throw error;
    const { data } = getSupabase().storage.from(FEATURES_BUCKET).getPublicUrl(path);
    return data.publicUrl;
};
