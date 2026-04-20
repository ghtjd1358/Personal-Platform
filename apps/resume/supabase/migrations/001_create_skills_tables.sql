-- =============================================
-- Skills 관련 테이블
-- =============================================

-- 1. 스킬 카테고리 테이블
CREATE TABLE IF NOT EXISTS skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(100) NOT NULL,          -- 카테고리명 (프론트엔드, 백엔드 등)
  order_index INTEGER DEFAULT 0,         -- 정렬 순서
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 스킬 테이블
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,            -- 스킬명 (React, TypeScript 등)
  icon VARCHAR(50),                      -- 아이콘 (이모지 or 아이콘명)
  icon_color VARCHAR(20),                -- 아이콘 색상
  order_index INTEGER DEFAULT 0,         -- 정렬 순서
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 (모든 사용자)
CREATE POLICY "skill_categories_read" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "skills_read" ON skills FOR SELECT USING (true);

-- 쓰기 정책 (인증된 사용자)
CREATE POLICY "skill_categories_write" ON skill_categories FOR ALL USING (true);
CREATE POLICY "skills_write" ON skills FOR ALL USING (true);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(order_index);
CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories(order_index);

-- =============================================
-- 초기 데이터 삽입
-- =============================================

-- 카테고리 추가
INSERT INTO skill_categories (id, label, order_index) VALUES
  ('11111111-1111-1111-1111-111111111111', '프론트엔드', 1),
  ('22222222-2222-2222-2222-222222222222', '상태관리', 2),
  ('33333333-3333-3333-3333-333333333333', '도구', 3),
  ('44444444-4444-4444-4444-444444444444', '백엔드', 4)
ON CONFLICT (id) DO NOTHING;

-- 프론트엔드 스킬
INSERT INTO skills (category_id, name, order_index) VALUES
  ('11111111-1111-1111-1111-111111111111', 'React', 1),
  ('11111111-1111-1111-1111-111111111111', 'Next.js', 2),
  ('11111111-1111-1111-1111-111111111111', 'TypeScript', 3),
  ('11111111-1111-1111-1111-111111111111', 'JavaScript', 4),
  ('11111111-1111-1111-1111-111111111111', 'HTML5', 5),
  ('11111111-1111-1111-1111-111111111111', 'CSS3', 6),
  ('11111111-1111-1111-1111-111111111111', 'Styled Components', 7),
  ('11111111-1111-1111-1111-111111111111', 'Tailwind CSS', 8),
  ('11111111-1111-1111-1111-111111111111', 'Sass', 9)
ON CONFLICT DO NOTHING;

-- 상태관리 스킬
INSERT INTO skills (category_id, name, order_index) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Redux', 1),
  ('22222222-2222-2222-2222-222222222222', 'Redux Toolkit', 2),
  ('22222222-2222-2222-2222-222222222222', 'React Query', 3),
  ('22222222-2222-2222-2222-222222222222', 'Zustand', 4),
  ('22222222-2222-2222-2222-222222222222', 'React Hook Form', 5)
ON CONFLICT DO NOTHING;

-- 도구 스킬
INSERT INTO skills (category_id, name, order_index) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Git', 1),
  ('33333333-3333-3333-3333-333333333333', 'GitHub', 2),
  ('33333333-3333-3333-3333-333333333333', 'Webpack', 3),
  ('33333333-3333-3333-3333-333333333333', 'Vite', 4),
  ('33333333-3333-3333-3333-333333333333', 'Vercel', 5),
  ('33333333-3333-3333-3333-333333333333', 'npm', 6),
  ('33333333-3333-3333-3333-333333333333', 'Jest', 7),
  ('33333333-3333-3333-3333-333333333333', 'Figma', 8),
  ('33333333-3333-3333-3333-333333333333', 'Jira', 9),
  ('33333333-3333-3333-3333-333333333333', 'Confluence', 10),
  ('33333333-3333-3333-3333-333333333333', 'AWS', 11),
  ('33333333-3333-3333-3333-333333333333', 'S3', 12),
  ('33333333-3333-3333-3333-333333333333', 'Supabase', 13)
ON CONFLICT DO NOTHING;

-- 백엔드 스킬
INSERT INTO skills (category_id, name, order_index) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Node.js', 1),
  ('44444444-4444-4444-4444-444444444444', 'Express', 2),
  ('44444444-4444-4444-4444-444444444444', 'Spring Boot', 3),
  ('44444444-4444-4444-4444-444444444444', 'MySQL', 4),
  ('44444444-4444-4444-4444-444444444444', 'PostgreSQL', 5)
ON CONFLICT DO NOTHING;
