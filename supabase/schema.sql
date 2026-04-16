-- =============================================
-- MFA Portfolio Supabase Schema
-- 이력서(remote1), 블로그(remote2), 포트폴리오(remote3)
-- =============================================

-- =============================================
-- 1. 사용자 및 권한 관리
-- =============================================

-- 사용자 역할 ENUM
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer', 'guest');

-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'viewer',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 권한 테이블 (세분화된 권한 관리)
CREATE TABLE permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role user_role NOT NULL,
  resource TEXT NOT NULL, -- 'resume', 'blog', 'portfolio', 'admin'
  action TEXT NOT NULL,   -- 'create', 'read', 'update', 'delete'
  allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기본 권한 설정 삽입
INSERT INTO permissions (role, resource, action, allowed) VALUES
-- Admin: 모든 권한
('admin', 'resume', 'create', true),
('admin', 'resume', 'read', true),
('admin', 'resume', 'update', true),
('admin', 'resume', 'delete', true),
('admin', 'blog', 'create', true),
('admin', 'blog', 'read', true),
('admin', 'blog', 'update', true),
('admin', 'blog', 'delete', true),
('admin', 'portfolio', 'create', true),
('admin', 'portfolio', 'read', true),
('admin', 'portfolio', 'update', true),
('admin', 'portfolio', 'delete', true),
('admin', 'admin', 'create', true),
('admin', 'admin', 'read', true),
('admin', 'admin', 'update', true),
('admin', 'admin', 'delete', true),
-- Editor: 읽기/쓰기
('editor', 'resume', 'create', true),
('editor', 'resume', 'read', true),
('editor', 'resume', 'update', true),
('editor', 'resume', 'delete', false),
('editor', 'blog', 'create', true),
('editor', 'blog', 'read', true),
('editor', 'blog', 'update', true),
('editor', 'blog', 'delete', false),
('editor', 'portfolio', 'create', true),
('editor', 'portfolio', 'read', true),
('editor', 'portfolio', 'update', true),
('editor', 'portfolio', 'delete', false),
-- Viewer: 읽기만
('viewer', 'resume', 'read', true),
('viewer', 'blog', 'read', true),
('viewer', 'portfolio', 'read', true),
-- Guest: 공개 콘텐츠만
('guest', 'resume', 'read', true),
('guest', 'blog', 'read', true),
('guest', 'portfolio', 'read', true);

-- 리프레시 토큰 테이블 (세션 관리)
CREATE TABLE refresh_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  ip_address INET
);

-- 로그인 히스토리
CREATE TABLE login_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  login_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  failure_reason TEXT
);

-- =============================================
-- 2. 이력서 (Remote1) 관련 테이블
-- =============================================

-- 개인 정보
CREATE TABLE resume_profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT, -- 직함 (예: 프론트엔드 개발자)
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  summary TEXT, -- 자기소개
  profile_image TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기술 카테고리
CREATE TABLE skill_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'frontend', 'state', 'tools'
  label TEXT NOT NULL, -- '프론트엔드', '상태관리', '도구'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기술 스택
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT, -- 아이콘 이름 (예: 'SiReact')
  icon_color TEXT, -- 아이콘 색상 (예: '#61DAFB')
  level INTEGER DEFAULT 0, -- 숙련도 1-5
  years_of_experience NUMERIC(3,1), -- 경력 년수
  order_index INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false, -- 주요 기술 여부
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 경력
CREATE TABLE experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL이면 현재 재직중
  is_current BOOLEAN DEFAULT false,
  location TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 경력 상세 업무
CREATE TABLE experience_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 경력 기술 태그
CREATE TABLE experience_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES experiences(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학력
CREATE TABLE education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  degree TEXT, -- 학위
  field_of_study TEXT, -- 전공
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  grade TEXT, -- 학점
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 자격증
CREATE TABLE certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT, -- 발급 기관
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT, -- 자격증 번호
  credential_url TEXT, -- 확인 URL
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 수상 이력
CREATE TABLE awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT,
  date DATE,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 언어 능력
CREATE TABLE languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  proficiency TEXT, -- 'native', 'fluent', 'advanced', 'intermediate', 'basic'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. 블로그 (Remote2) 관련 테이블
-- =============================================

-- 블로그 카테고리
CREATE TABLE blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT, -- 카테고리 색상
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 블로그 태그
CREATE TABLE blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 블로그 게시글
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT, -- 요약
  content TEXT, -- 본문 (Markdown)
  cover_image TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  is_featured BOOLEAN DEFAULT false, -- 추천 글
  is_pinned BOOLEAN DEFAULT false, -- 상단 고정
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  reading_time INTEGER, -- 예상 읽기 시간 (분)
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 게시글-태그 연결 (다대다)
CREATE TABLE blog_post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- 블로그 댓글
CREATE TABLE blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- 대댓글
  author_name TEXT, -- 비로그인 사용자용
  author_email TEXT,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 블로그 좋아요
CREATE TABLE blog_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 블로그 조회 기록
CREATE TABLE blog_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 블로그 시리즈 (연재물)
CREATE TABLE blog_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 시리즈-게시글 연결
CREATE TABLE blog_series_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID REFERENCES blog_series(id) ON DELETE CASCADE,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(series_id, post_id)
);

-- =============================================
-- 4. 포트폴리오 (Remote3) 관련 테이블
-- =============================================

-- 포트폴리오 카테고리
CREATE TABLE portfolio_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 프로젝트
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES portfolio_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  badge TEXT, -- '실무', '사이드', '오픈소스' 등
  short_description TEXT, -- 카드에 표시될 짧은 설명
  description TEXT, -- 상세 설명
  cover_image TEXT,
  thumbnail TEXT,
  demo_url TEXT, -- 데모 링크
  github_url TEXT,
  figma_url TEXT,
  other_url TEXT,
  status TEXT DEFAULT 'completed', -- 'in_progress', 'completed', 'archived'
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  order_index INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 상세 정보
CREATE TABLE portfolio_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE UNIQUE,
  period TEXT, -- 기간 문자열
  role TEXT, -- 역할
  team_size INTEGER, -- 팀 규모
  contribution INTEGER, -- 기여도 (%)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 업무 내용
CREATE TABLE portfolio_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 성과
CREATE TABLE portfolio_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  result TEXT NOT NULL,
  metric_value TEXT, -- 수치 (예: '40%')
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 기술 태그
CREATE TABLE portfolio_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 이미지/스크린샷
CREATE TABLE portfolio_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 기술 스택 상세
CREATE TABLE portfolio_tech_stack (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  category TEXT, -- 'frontend', 'backend', 'database', 'devops', 'etc'
  name TEXT NOT NULL,
  icon TEXT,
  icon_color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포트폴리오 타임라인/마일스톤
CREATE TABLE portfolio_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. 공통 테이블
-- =============================================

-- 파일 업로드 관리
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  mime_type TEXT,
  bucket TEXT DEFAULT 'uploads',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 연락처 문의
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사이트 설정
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 방문자 통계
CREATE TABLE visitor_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  view_count INTEGER DEFAULT 1,
  unique_visitors INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, date)
);

-- =============================================
-- 6. RLS (Row Level Security) 정책
-- =============================================

-- 모든 테이블에 RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_series_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_stats ENABLE ROW LEVEL SECURITY;

-- Profiles 정책
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Resume 관련 정책 (공개)
CREATE POLICY "Resume profile is viewable by everyone" ON resume_profile
  FOR SELECT USING (is_public = true);
CREATE POLICY "Owner can manage resume profile" ON resume_profile
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Skills are viewable by everyone" ON skills
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage skills" ON skills
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Skill categories are viewable by everyone" ON skill_categories
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage skill categories" ON skill_categories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Experiences are viewable by everyone" ON experiences
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage experiences" ON experiences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Experience tasks are viewable by everyone" ON experience_tasks
  FOR SELECT USING (true);

CREATE POLICY "Experience tags are viewable by everyone" ON experience_tags
  FOR SELECT USING (true);

CREATE POLICY "Education is viewable by everyone" ON education
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage education" ON education
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Certifications are viewable by everyone" ON certifications
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage certifications" ON certifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Awards are viewable by everyone" ON awards
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage awards" ON awards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Languages are viewable by everyone" ON languages
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage languages" ON languages
  FOR ALL USING (auth.uid() = user_id);

-- Blog 관련 정책
CREATE POLICY "Published posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (status = 'published');
CREATE POLICY "Owner can manage posts" ON blog_posts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Blog categories are viewable by everyone" ON blog_categories
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage blog categories" ON blog_categories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Blog tags are viewable by everyone" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Approved comments are viewable" ON blog_comments
  FOR SELECT USING (is_approved = true AND is_deleted = false);
CREATE POLICY "Users can create comments" ON blog_comments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own comments" ON blog_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can like posts" ON blog_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Blog series are viewable by everyone" ON blog_series
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage blog series" ON blog_series
  FOR ALL USING (auth.uid() = user_id);

-- Portfolio 관련 정책
CREATE POLICY "Public portfolios are viewable by everyone" ON portfolios
  FOR SELECT USING (is_public = true);
CREATE POLICY "Owner can manage portfolios" ON portfolios
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Portfolio categories are viewable by everyone" ON portfolio_categories
  FOR SELECT USING (true);
CREATE POLICY "Owner can manage portfolio categories" ON portfolio_categories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Portfolio details are viewable" ON portfolio_details
  FOR SELECT USING (true);

CREATE POLICY "Portfolio tasks are viewable" ON portfolio_tasks
  FOR SELECT USING (true);

CREATE POLICY "Portfolio results are viewable" ON portfolio_results
  FOR SELECT USING (true);

CREATE POLICY "Portfolio tags are viewable" ON portfolio_tags
  FOR SELECT USING (true);

CREATE POLICY "Portfolio images are viewable" ON portfolio_images
  FOR SELECT USING (true);

CREATE POLICY "Portfolio tech stack is viewable" ON portfolio_tech_stack
  FOR SELECT USING (true);

CREATE POLICY "Portfolio milestones are viewable" ON portfolio_milestones
  FOR SELECT USING (true);

-- 공통 정책
CREATE POLICY "Anyone can submit contact form" ON contacts
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view contacts" ON contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admin can manage site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Visitor stats are viewable" ON visitor_stats
  FOR SELECT USING (true);
CREATE POLICY "Anyone can update visitor stats" ON visitor_stats
  FOR INSERT WITH CHECK (true);

-- =============================================
-- 7. 트리거 및 함수
-- =============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_profile_updated_at
  BEFORE UPDATE ON resume_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 새 사용자 프로필 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 블로그 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_blog_view(post_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET view_count = view_count + 1
  WHERE id = post_uuid;
END;
$$ language 'plpgsql';

-- 포트폴리오 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_portfolio_view(portfolio_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE portfolios
  SET view_count = view_count + 1
  WHERE id = portfolio_uuid;
END;
$$ language 'plpgsql';

-- 방문자 통계 업데이트 함수
CREATE OR REPLACE FUNCTION update_visitor_stats(page_path TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO visitor_stats (page, date, view_count, unique_visitors)
  VALUES (page_path, CURRENT_DATE, 1, 1)
  ON CONFLICT (page, date)
  DO UPDATE SET view_count = visitor_stats.view_count + 1;
END;
$$ language 'plpgsql';

-- =============================================
-- 8. 인덱스 (성능 최적화)
-- =============================================

-- 자주 조회되는 컬럼에 인덱스
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_skills_user ON skills(user_id);

CREATE INDEX idx_experiences_user ON experiences(user_id);
CREATE INDEX idx_experiences_dates ON experiences(start_date, end_date);

CREATE INDEX idx_blog_posts_user ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

CREATE INDEX idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_parent ON blog_comments(parent_id);

CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolios_category ON portfolios(category_id);
CREATE INDEX idx_portfolios_status ON portfolios(status);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_featured ON portfolios(is_featured);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_date ON login_history(login_at);

CREATE INDEX idx_visitor_stats_page_date ON visitor_stats(page, date);
