-- =============================================
-- Homepage Config Table
-- 홈페이지 섹션별 설정을 저장하는 테이블
-- =============================================

-- 테이블 생성
CREATE TABLE IF NOT EXISTS homepage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Hero 섹션 설정 (JSON)
  hero JSONB DEFAULT '{
    "title": "프론트엔드 개발자",
    "summary": "안녕하세요, 저는 프론트엔드 개발자입니다.",
    "contact_email": "",
    "github": "",
    "blog": ""
  }'::jsonb,

  -- 선택된 항목 ID 배열
  selected_skill_ids TEXT[] DEFAULT '{}',
  selected_experience_ids TEXT[] DEFAULT '{}',
  selected_project_ids TEXT[] DEFAULT '{}',

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_homepage_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS homepage_config_updated_at ON homepage_config;
CREATE TRIGGER homepage_config_updated_at
  BEFORE UPDATE ON homepage_config
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_config_updated_at();

-- RLS (Row Level Security) 정책
ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능
CREATE POLICY "homepage_config_read_policy" ON homepage_config
  FOR SELECT
  USING (true);

-- 인증된 사용자만 수정 가능
CREATE POLICY "homepage_config_update_policy" ON homepage_config
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 인증된 사용자만 삽입 가능
CREATE POLICY "homepage_config_insert_policy" ON homepage_config
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 초기 데이터 삽입 (테이블이 비어있을 경우에만)
INSERT INTO homepage_config (hero, selected_skill_ids, selected_experience_ids, selected_project_ids)
SELECT
  '{
    "title": "프론트엔드 개발자",
    "summary": "사용자 경험을 중심으로 생각하는 프론트엔드 개발자입니다.\n끊임없이 배우고 성장하며, 더 나은 웹을 만들기 위해 노력합니다.",
    "contact_email": "hoseong1358@gmail.com",
    "github": "https://github.com/ghtjd1358",
    "blog": "https://velog.io/@ghtjd1358/series"
  }'::jsonb,
  '{}',
  '{}',
  '{}'
WHERE NOT EXISTS (SELECT 1 FROM homepage_config LIMIT 1);

-- 인덱스 생성 (배열 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_homepage_config_skill_ids ON homepage_config USING GIN (selected_skill_ids);
CREATE INDEX IF NOT EXISTS idx_homepage_config_experience_ids ON homepage_config USING GIN (selected_experience_ids);
CREATE INDEX IF NOT EXISTS idx_homepage_config_project_ids ON homepage_config USING GIN (selected_project_ids);

-- 테이블 코멘트
COMMENT ON TABLE homepage_config IS '홈페이지 섹션별 설정 저장 테이블';
COMMENT ON COLUMN homepage_config.hero IS 'Hero 섹션 설정 (title, summary, contact_email, github, blog)';
COMMENT ON COLUMN homepage_config.selected_skill_ids IS '홈페이지에 표시할 스킬 ID 목록';
COMMENT ON COLUMN homepage_config.selected_experience_ids IS '홈페이지에 표시할 경력 ID 목록';
COMMENT ON COLUMN homepage_config.selected_project_ids IS '홈페이지에 표시할 프로젝트 ID 목록';
