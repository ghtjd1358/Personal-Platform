-- ============================================================
-- MFA Portfolio - Master Consolidated Migration
-- ============================================================
-- 이 파일은 모든 앱의 마이그레이션을 통합한 마스터 스크립트입니다.
-- 새 환경에서 전체 스키마를 한 번에 생성할 때 사용합니다.
--
-- 생성일: 2026-04-21
-- 실행 순서:
--   1. Common (공통 함수/트리거)
--   2. Resume (이력서 앱)
--   3. Blog (블로그 앱)
--   4. Portfolio (포트폴리오 앱)
--   5. TechBlog (취업 추적 앱)
-- ============================================================


-- ============================================================
-- SECTION 1: Common Functions (공통 함수)
-- ============================================================

-- updated_at 자동 업데이트 함수 (모든 앱에서 공통 사용)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SECTION 2: Resume App (Port 5001)
-- ============================================================

-- -----------------------------
-- 2.1: Skills Tables
-- -----------------------------

-- 스킬 카테고리 테이블
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 스킬 테이블
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  icon_color VARCHAR(20),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS & Policies
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skill_categories_read" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "skills_read" ON skills FOR SELECT USING (true);
CREATE POLICY "skill_categories_write" ON skill_categories FOR ALL USING (true);
CREATE POLICY "skills_write" ON skills FOR ALL USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);
CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories(order_index);

-- 초기 데이터
INSERT INTO skill_categories (id, label, order_index) VALUES
  ('11111111-1111-1111-1111-111111111111', '프론트엔드', 1),
  ('22222222-2222-2222-2222-222222222222', '상태관리', 2),
  ('33333333-3333-3333-3333-333333333333', '도구', 3),
  ('44444444-4444-4444-4444-444444444444', '백엔드', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO skills (category_id, name, order_index) VALUES
  ('11111111-1111-1111-1111-111111111111', 'React', 1),
  ('11111111-1111-1111-1111-111111111111', 'Next.js', 2),
  ('11111111-1111-1111-1111-111111111111', 'TypeScript', 3),
  ('22222222-2222-2222-2222-222222222222', 'Redux', 1),
  ('22222222-2222-2222-2222-222222222222', 'Redux Toolkit', 2),
  ('33333333-3333-3333-3333-333333333333', 'Git', 1),
  ('33333333-3333-3333-3333-333333333333', 'GitHub', 2),
  ('44444444-4444-4444-4444-444444444444', 'Node.js', 1)
ON CONFLICT DO NOTHING;

-- -----------------------------
-- 2.2: Homepage Config
-- -----------------------------

CREATE TABLE IF NOT EXISTS homepage_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero JSONB DEFAULT '{
    "title": "프론트엔드 개발자",
    "summary": "안녕하세요, 저는 프론트엔드 개발자입니다.",
    "contact_email": "",
    "github": "",
    "blog": ""
  }'::jsonb,
  selected_skill_ids TEXT[] DEFAULT '{}',
  selected_experience_ids TEXT[] DEFAULT '{}',
  selected_project_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS homepage_config_updated_at ON homepage_config;
CREATE TRIGGER homepage_config_updated_at
  BEFORE UPDATE ON homepage_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE homepage_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "homepage_config_read_policy" ON homepage_config
  FOR SELECT USING (true);

CREATE POLICY "homepage_config_update_policy" ON homepage_config
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "homepage_config_insert_policy" ON homepage_config
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_homepage_config_skill_ids ON homepage_config USING GIN (selected_skill_ids);
CREATE INDEX IF NOT EXISTS idx_homepage_config_experience_ids ON homepage_config USING GIN (selected_experience_ids);
CREATE INDEX IF NOT EXISTS idx_homepage_config_project_ids ON homepage_config USING GIN (selected_project_ids);

-- 초기 데이터
INSERT INTO homepage_config (hero, selected_skill_ids, selected_experience_ids, selected_project_ids)
SELECT '{
  "title": "프론트엔드 개발자",
  "summary": "사용자 경험을 중심으로 생각하는 프론트엔드 개발자입니다.",
  "contact_email": "hoseong1358@gmail.com",
  "github": "https://github.com/ghtjd1358",
  "blog": "https://velog.io/@ghtjd1358/series"
}'::jsonb, '{}', '{}', '{}'
WHERE NOT EXISTS (SELECT 1 FROM homepage_config LIMIT 1);

-- -----------------------------
-- 2.3: Multi-Resume Support
-- -----------------------------

ALTER TABLE IF EXISTS resume_profile
  ADD COLUMN IF NOT EXISTS resume_name VARCHAR(100) DEFAULT '기본 이력서',
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

UPDATE resume_profile
SET is_primary = true
WHERE (is_primary IS NULL OR is_primary = false)
  AND EXISTS (SELECT 1 FROM resume_profile LIMIT 1);

ALTER TABLE IF EXISTS experiences
  ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resume_profile(id) ON DELETE CASCADE;

UPDATE experiences e
SET resume_id = (
  SELECT r.id FROM resume_profile r
  WHERE r.user_id = e.user_id
  ORDER BY r.created_at ASC LIMIT 1
)
WHERE e.resume_id IS NULL AND EXISTS (SELECT 1 FROM resume_profile);

ALTER TABLE IF EXISTS portfolios
  ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resume_profile(id) ON DELETE CASCADE;

UPDATE portfolios p
SET resume_id = (
  SELECT r.id FROM resume_profile r
  WHERE r.user_id = p.user_id
  ORDER BY r.created_at ASC LIMIT 1
)
WHERE p.resume_id IS NULL AND EXISTS (SELECT 1 FROM resume_profile);

CREATE INDEX IF NOT EXISTS idx_experiences_resume_id ON experiences(resume_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_resume_id ON portfolios(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_profile_user_id_primary ON resume_profile(user_id, is_primary);


-- ============================================================
-- SECTION 3: Blog App (Port 5002)
-- ============================================================

-- 시리즈 테이블
CREATE TABLE IF NOT EXISTS blog_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, slug)
);

-- 시리즈-포스트 연결 테이블
CREATE TABLE IF NOT EXISTS blog_series_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID NOT NULL REFERENCES blog_series(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_id, post_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_series_user_id ON blog_series(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_series_slug ON blog_series(slug);
CREATE INDEX IF NOT EXISTS idx_blog_series_posts_series_id ON blog_series_posts(series_id);
CREATE INDEX IF NOT EXISTS idx_blog_series_posts_post_id ON blog_series_posts(post_id);

-- RLS
ALTER TABLE blog_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_series_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "시리즈 공개 읽기" ON blog_series FOR SELECT USING (true);
CREATE POLICY "시리즈 작성자만 생성" ON blog_series FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "시리즈 작성자만 수정" ON blog_series FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "시리즈 작성자만 삭제" ON blog_series FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "시리즈 포스트 공개 읽기" ON blog_series_posts FOR SELECT USING (true);
CREATE POLICY "시리즈 포스트 소유자만 생성" ON blog_series_posts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM blog_series WHERE id = series_id AND user_id = auth.uid())
  );
CREATE POLICY "시리즈 포스트 소유자만 삭제" ON blog_series_posts
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM blog_series WHERE id = series_id AND user_id = auth.uid())
  );

-- Triggers
CREATE TRIGGER update_blog_series_updated_at
  BEFORE UPDATE ON blog_series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helper function
CREATE OR REPLACE FUNCTION get_series_post_count(series_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM blog_series_posts WHERE series_id = series_uuid);
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SECTION 4: Portfolio App (Port 5003)
-- ============================================================

-- Portfolio Likes 테이블
CREATE TABLE IF NOT EXISTS portfolio_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(portfolio_id, user_id)
);

ALTER TABLE IF EXISTS portfolios ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_portfolio_id ON portfolio_likes(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_likes_user_id ON portfolio_likes(user_id);

-- RLS
ALTER TABLE portfolio_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON portfolio_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert own likes" ON portfolio_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON portfolio_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers for like_count
CREATE OR REPLACE FUNCTION increment_portfolio_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE portfolios SET like_count = like_count + 1 WHERE id = NEW.portfolio_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_portfolio_like_insert
  AFTER INSERT ON portfolio_likes
  FOR EACH ROW
  EXECUTE FUNCTION increment_portfolio_like_count();

CREATE OR REPLACE FUNCTION decrement_portfolio_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE portfolios SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.portfolio_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_portfolio_like_delete
  AFTER DELETE ON portfolio_likes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_portfolio_like_count();


-- ============================================================
-- SECTION 5: TechBlog App (Port 5004)
-- ============================================================

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company VARCHAR(100) NOT NULL,
  position VARCHAR(200) NOT NULL,
  location VARCHAR(100),
  salary VARCHAR(100),
  deadline DATE,
  skills TEXT[] DEFAULT '{}',
  description TEXT,
  job_url VARCHAR(500),
  posted_at DATE,
  company_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  company_name VARCHAR(100) NOT NULL,
  position VARCHAR(200) NOT NULL,
  job_url VARCHAR(500),
  salary_range VARCHAR(100),
  location VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'interested'
    CHECK (status IN ('interested', 'applied', 'interview', 'result')),
  result VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (result IN ('pending', 'passed', 'failed')),
  applied_at DATE,
  interview_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Notes table
CREATE TABLE IF NOT EXISTS job_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type VARCHAR(20) NOT NULL DEFAULT 'memo'
    CHECK (note_type IN ('memo', 'interview', 'analysis')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calendar Events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  event_type VARCHAR(20) NOT NULL DEFAULT 'deadline'
    CHECK (event_type IN ('interview', 'deadline', 'applied', 'reminder')),
  color VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Bookmarks table
CREATE TABLE IF NOT EXISTS job_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_updated ON job_applications(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_application ON job_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON job_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created ON job_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_user ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_events_application ON calendar_events(application_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON job_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_job ON job_bookmarks(job_id);

-- RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_bookmarks ENABLE ROW LEVEL SECURITY;

-- Jobs policies (public read, authenticated write)
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Jobs are insertable by authenticated users" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Jobs are updatable by authenticated users" ON jobs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Jobs are deletable by authenticated users" ON jobs FOR DELETE USING (auth.role() = 'authenticated');

-- Applications policies (user-owned)
CREATE POLICY "Users can view own applications" ON job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own applications" ON job_applications FOR DELETE USING (auth.uid() = user_id);

-- Notes policies (user-owned)
CREATE POLICY "Users can view own notes" ON job_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own notes" ON job_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON job_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON job_notes FOR DELETE USING (auth.uid() = user_id);

-- Events policies (user-owned)
CREATE POLICY "Users can view own events" ON calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own events" ON calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own events" ON calendar_events FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks policies (user-owned)
CREATE POLICY "Users can view own bookmarks" ON job_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON job_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON job_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notes_updated_at
  BEFORE UPDATE ON job_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE jobs IS '채용공고 정보';
COMMENT ON TABLE job_applications IS '사용자별 지원 현황';
COMMENT ON TABLE job_notes IS '지원별 메모/노트';
COMMENT ON TABLE calendar_events IS '면접/마감 등 일정';
COMMENT ON TABLE job_bookmarks IS '채용공고 북마크';


-- ============================================================
-- END OF MASTER MIGRATION
-- ============================================================
-- 이 스크립트는 모든 테이블/인덱스/RLS/트리거를 포함합니다.
-- CREATE IF NOT EXISTS를 사용하여 멱등성을 보장합니다.
-- 프로덕션 환경에 적용 시 백업 필수!
-- ============================================================
