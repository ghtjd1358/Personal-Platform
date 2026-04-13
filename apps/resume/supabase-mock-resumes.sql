-- ============================================
-- Mock Resume Profiles 데이터
-- Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- 먼저 본인 이력서를 public으로 변경 (이미 있다면)
UPDATE public.resume_profile
SET visibility = 'public'
WHERE user_id = '9878b01c-1d9e-4b54-8323-f77735445b39';

-- Mock 사용자 생성 (auth.users 테이블에 직접 삽입은 불가하므로 users 뷰/테이블 확인 필요)
-- 대신 기존 사용자 ID로 추가 이력서 생성하거나,
-- resume_profile 테이블 구조에 맞게 삽입

-- resume_profile 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'resume_profile'
ORDER BY ordinal_position;

-- users 테이블 구조 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 기존 이력서 확인
SELECT * FROM public.resume_profile;
