/**
 * Supabase Storage bucket 상수.
 * public read, owner-only write. 경로 규칙: `{user_id}/{timestamp}-{safe_filename}`
 * → Storage RLS 가 auth.uid() 와 foldername[1] 을 비교해 소유자 검증.
 */
export const FEATURES_BUCKET = 'resume-features';
