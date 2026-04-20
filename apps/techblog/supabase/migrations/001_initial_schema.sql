-- ============================================
-- TechBlog (Job Tracker) Database Schema
-- Version: 1.0.0
-- Created: 2026-04-17
-- ============================================

-- ============================================
-- TABLE: jobs (채용공고)
-- ============================================
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
  -- Company Info (embedded JSON for flexibility)
  company_info JSONB DEFAULT '{}',
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for jobs
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);

-- RLS: Jobs are public read, authenticated write
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (true);

CREATE POLICY "Jobs are insertable by authenticated users"
  ON jobs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Jobs are updatable by authenticated users"
  ON jobs FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Jobs are deletable by authenticated users"
  ON jobs FOR DELETE
  USING (auth.role() = 'authenticated');


-- ============================================
-- TABLE: job_applications (지원현황)
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  -- Denormalized for when job is deleted or manual entry
  company_name VARCHAR(100) NOT NULL,
  position VARCHAR(200) NOT NULL,
  job_url VARCHAR(500),
  salary_range VARCHAR(100),
  location VARCHAR(100),
  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'interested'
    CHECK (status IN ('interested', 'applied', 'interview', 'result')),
  result VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (result IN ('pending', 'passed', 'failed')),
  -- Dates
  applied_at DATE,
  interview_at TIMESTAMPTZ,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for job_applications
CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_updated ON job_applications(updated_at DESC);

-- RLS: Users can only access their own applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
  ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON job_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON job_applications FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- TABLE: job_notes (메모)
-- ============================================
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

-- Indexes for job_notes
CREATE INDEX IF NOT EXISTS idx_notes_application ON job_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON job_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created ON job_notes(created_at DESC);

-- RLS: Users can only access their own notes
ALTER TABLE job_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON job_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes"
  ON job_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON job_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON job_notes FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- TABLE: calendar_events (일정)
-- ============================================
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

-- Indexes for calendar_events
CREATE INDEX IF NOT EXISTS idx_events_user ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_events_application ON calendar_events(application_id);

-- RLS: Users can only access their own events
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON calendar_events FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- TABLE: job_bookmarks (북마크)
-- ============================================
CREATE TABLE IF NOT EXISTS job_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Indexes for job_bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON job_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_job ON job_bookmarks(job_id);

-- RLS: Users can only access their own bookmarks
ALTER TABLE job_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON job_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON job_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON job_bookmarks FOR DELETE
  USING (auth.uid() = user_id);


-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notes_updated_at
  BEFORE UPDATE ON job_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- COMMENTS: Table descriptions
-- ============================================
COMMENT ON TABLE jobs IS '채용공고 정보';
COMMENT ON TABLE job_applications IS '사용자별 지원 현황';
COMMENT ON TABLE job_notes IS '지원별 메모/노트';
COMMENT ON TABLE calendar_events IS '면접/마감 등 일정';
COMMENT ON TABLE job_bookmarks IS '채용공고 북마크';

COMMENT ON COLUMN job_applications.status IS 'interested: 관심, applied: 지원완료, interview: 면접, result: 결과';
COMMENT ON COLUMN job_applications.result IS 'pending: 대기, passed: 합격, failed: 불합격';
COMMENT ON COLUMN job_notes.note_type IS 'memo: 메모, interview: 면접준비, analysis: 분석';
COMMENT ON COLUMN calendar_events.event_type IS 'interview: 면접, deadline: 마감, applied: 지원일, reminder: 알림';
