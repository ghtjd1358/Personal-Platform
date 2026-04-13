-- ============================================
-- Resume Profile 테이블 업데이트 및 Mock 데이터
-- Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- 0. RLS 정책 설정 (공개 이력서는 누구나 읽을 수 있음)
ALTER TABLE public.resume_profile ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있으면)
DROP POLICY IF EXISTS "Public resumes are viewable by everyone" ON public.resume_profile;
DROP POLICY IF EXISTS "Users can insert own resume" ON public.resume_profile;
DROP POLICY IF EXISTS "Users can update own resume" ON public.resume_profile;
DROP POLICY IF EXISTS "Users can delete own resume" ON public.resume_profile;

-- 공개 이력서는 누구나 읽기 가능
CREATE POLICY "Public resumes are viewable by everyone"
ON public.resume_profile FOR SELECT
USING (visibility = 'public');

-- 본인 이력서는 항상 읽기 가능
CREATE POLICY "Users can view own resume"
ON public.resume_profile FOR SELECT
USING (auth.uid() = user_id);

-- 본인만 생성/수정/삭제 가능
CREATE POLICY "Users can insert own resume"
ON public.resume_profile FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resume"
ON public.resume_profile FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resume"
ON public.resume_profile FOR DELETE
USING (auth.uid() = user_id);

-- 1. name 컬럼 추가 (없으면)
ALTER TABLE public.resume_profile
ADD COLUMN IF NOT EXISTS name VARCHAR(100);

-- 2. 현재 이력서 확인
-- 먼저 어떤 이력서가 있는지 확인
SELECT id, user_id, name, title, visibility FROM public.resume_profile;

-- 3. 본인 이력서 업데이트 (이름 + 공개)
-- user_id를 본인 것으로 변경하세요!
-- 예시: UPDATE ... WHERE user_id = '여기에-본인-user_id-입력';
UPDATE public.resume_profile
SET
  name = '손호성',
  visibility = 'public'
WHERE user_id = '9878b01c-1d9e-4b54-8323-f77735445b39';

-- 3. Mock 이력서 데이터 삽입 (user_id는 실제 존재하는 사용자 또는 임의 UUID)
-- 주의: user_id에 foreign key 제약이 있으면 실제 사용자 ID 필요

-- Mock 1: 백엔드 개발자
INSERT INTO public.resume_profile (user_id, name, title, summary, profile_image, contact_email, github, visibility)
VALUES (
  gen_random_uuid(),
  '김철수',
  '백엔드 개발자',
  'Node.js와 Python을 활용한 서버 개발 경험이 있습니다. MSA 아키텍처와 클라우드 인프라에 관심이 많습니다.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Backend',
  'backend@example.com',
  'https://github.com/example-backend',
  'public'
)
ON CONFLICT DO NOTHING;

-- Mock 2: 풀스택 개발자
INSERT INTO public.resume_profile (user_id, name, title, summary, profile_image, contact_email, github, blog, visibility)
VALUES (
  gen_random_uuid(),
  '이영희',
  '풀스택 개발자',
  'React와 Spring Boot를 활용한 웹 서비스 개발 경험이 있습니다. 사용자 경험을 중시하며 효율적인 코드를 작성하려 노력합니다.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Fullstack',
  'fullstack@example.com',
  'https://github.com/example-fullstack',
  'https://velog.io/@example',
  'public'
)
ON CONFLICT DO NOTHING;

-- Mock 3: 데이터 엔지니어
INSERT INTO public.resume_profile (user_id, name, title, summary, profile_image, contact_email, github, visibility)
VALUES (
  gen_random_uuid(),
  '박지민',
  '데이터 엔지니어',
  'Spark, Airflow를 활용한 데이터 파이프라인 구축 경험이 있습니다. 대용량 데이터 처리와 최적화에 강점이 있습니다.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=DataEngineer',
  'data@example.com',
  'https://github.com/example-data',
  'public'
)
ON CONFLICT DO NOTHING;

-- 4. 결과 확인
SELECT id, user_id, name, title, visibility, created_at
FROM public.resume_profile
ORDER BY created_at DESC;
