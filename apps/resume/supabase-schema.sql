-- ============================================
-- Resume Feature - Supabase Schema
-- 실행: Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- 1. resumes 테이블 생성
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  profile_image TEXT,
  contact_email VARCHAR(255),
  github TEXT,
  blog TEXT,
  visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 한 유저당 하나의 이력서만 허용 (선택사항)
  CONSTRAINT unique_user_resume UNIQUE (user_id)
);

-- 2. experiences 테이블에 user_id 추가 (없을 경우)
ALTER TABLE public.experiences
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. portfolios 테이블에 user_id 추가 (없을 경우)
ALTER TABLE public.portfolios
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. RLS (Row Level Security) 정책 설정 - resumes
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- 공개 이력서는 누구나 읽기 가능
CREATE POLICY "Public resumes are viewable by everyone"
ON public.resumes FOR SELECT
USING (visibility = 'public');

-- 본인의 이력서는 항상 읽기 가능 (비공개 포함)
CREATE POLICY "Users can view own resume"
ON public.resumes FOR SELECT
USING (auth.uid() = user_id);

-- 본인만 이력서 생성 가능
CREATE POLICY "Users can create own resume"
ON public.resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 본인만 이력서 수정 가능
CREATE POLICY "Users can update own resume"
ON public.resumes FOR UPDATE
USING (auth.uid() = user_id);

-- 본인만 이력서 삭제 가능
CREATE POLICY "Users can delete own resume"
ON public.resumes FOR DELETE
USING (auth.uid() = user_id);

-- 5. RLS 정책 설정 - experiences (user_id 기반)
-- 기존 RLS가 있다면 스킵, 없으면 추가
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'experiences' AND policyname = 'Users can view all experiences'
  ) THEN
    ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view all experiences"
    ON public.experiences FOR SELECT USING (true);

    CREATE POLICY "Users can manage own experiences"
    ON public.experiences FOR ALL
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 6. RLS 정책 설정 - portfolios (user_id 기반)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'portfolios' AND policyname = 'Users can view all portfolios'
  ) THEN
    ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view all portfolios"
    ON public.portfolios FOR SELECT USING (true);

    CREATE POLICY "Users can manage own portfolios"
    ON public.portfolios FOR ALL
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- 7. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- resumes 테이블에 트리거 적용
DROP TRIGGER IF EXISTS update_resumes_updated_at ON public.resumes;
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_visibility ON public.resumes(visibility);
CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);

-- ============================================
-- 실행 완료 메시지
-- ============================================
SELECT 'Resume schema created successfully!' as message;
