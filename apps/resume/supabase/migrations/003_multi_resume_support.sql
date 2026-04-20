-- =====================================================
-- Multi-Resume Support Migration
-- 1인 1이력서 → 1인 N이력서 지원
-- =====================================================

-- 1. resume_profile 테이블에 새 컬럼 추가
ALTER TABLE resume_profile
  ADD COLUMN IF NOT EXISTS resume_name VARCHAR(100) DEFAULT '기본 이력서',
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- 기존 이력서를 대표 이력서로 설정
UPDATE resume_profile
SET is_primary = true
WHERE is_primary IS NULL OR is_primary = false;

-- 2. experiences 테이블에 resume_id 추가
ALTER TABLE experiences
  ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resume_profile(id) ON DELETE CASCADE;

-- 기존 experiences 데이터 마이그레이션: user_id로 resume_id 연결
UPDATE experiences e
SET resume_id = (
  SELECT r.id
  FROM resume_profile r
  WHERE r.user_id = e.user_id
  ORDER BY r.created_at ASC
  LIMIT 1
)
WHERE e.resume_id IS NULL;

-- 3. portfolios 테이블에 resume_id 추가
ALTER TABLE portfolios
  ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resume_profile(id) ON DELETE CASCADE;

-- 기존 portfolios 데이터 마이그레이션
UPDATE portfolios p
SET resume_id = (
  SELECT r.id
  FROM resume_profile r
  WHERE r.user_id = p.user_id
  ORDER BY r.created_at ASC
  LIMIT 1
)
WHERE p.resume_id IS NULL;

-- 4. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_experiences_resume_id ON experiences(resume_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_resume_id ON portfolios(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_profile_user_id_primary ON resume_profile(user_id, is_primary);

-- 5. RLS 정책 업데이트 (resume_id 기반 접근 제어)
-- experiences: resume 소유자만 수정 가능
DROP POLICY IF EXISTS "experiences_update_own" ON experiences;
CREATE POLICY "experiences_update_own" ON experiences
  FOR UPDATE
  USING (
    user_id = auth.uid() OR
    resume_id IN (SELECT id FROM resume_profile WHERE user_id = auth.uid())
  );

-- portfolios: resume 소유자만 수정 가능
DROP POLICY IF EXISTS "portfolios_update_own" ON portfolios;
CREATE POLICY "portfolios_update_own" ON portfolios
  FOR UPDATE
  USING (
    user_id = auth.uid() OR
    resume_id IN (SELECT id FROM resume_profile WHERE user_id = auth.uid())
  );
