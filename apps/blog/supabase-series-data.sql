-- ============================================
-- Blog Series 초기 데이터 삽입
-- Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- user_id는 본인 ID로 변경하세요
INSERT INTO public.blog_series (user_id, title, slug, description, order_index) VALUES
  ('9878b01c-1d9e-4b54-8323-f77735445b39', '파이썬 코테', 'python-coding-test', '파이썬으로 푸는 코딩 테스트 문제 풀이', 1),
  ('9878b01c-1d9e-4b54-8323-f77735445b39', 'React', 'react', 'React 관련 학습 및 프로젝트 기록', 2),
  ('9878b01c-1d9e-4b54-8323-f77735445b39', '타입스크립트', 'typescript', 'TypeScript 학습 및 실전 활용', 3),
  ('9878b01c-1d9e-4b54-8323-f77735445b39', '프로젝트 도런도런', 'project-dogundorun', 'MFA 프로젝트 개발 기록', 4),
  ('9878b01c-1d9e-4b54-8323-f77735445b39', '인간 JS 엔진', 'human-js-engine', 'JavaScript 동작 원리 깊이 파헤치기', 5),
  ('9878b01c-1d9e-4b54-8323-f77735445b39', 'Deep Dive', 'deep-dive', '모던 자바스크립트 Deep Dive 시리즈', 6);

-- 확인
SELECT * FROM public.blog_series ORDER BY order_index;
