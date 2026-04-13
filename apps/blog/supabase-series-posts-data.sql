-- ============================================
-- Blog Series Posts 연결 데이터 삽입
-- supabase-series-data.sql 실행 후에 실행하세요
-- Supabase Dashboard > SQL Editor에서 실행
-- ============================================

-- 1. 파이썬 코테 시리즈 - 백준 문제 (PYTHON)
INSERT INTO public.blog_series_posts (series_id, post_id, order_index)
SELECT
  s.id,
  p.id,
  ROW_NUMBER() OVER (ORDER BY p.created_at) as order_index
FROM public.blog_series s
CROSS JOIN public.blog_posts p
WHERE s.slug = 'python-coding-test'
  AND (p.title ILIKE '%백준%' OR p.title ILIKE '%(PYTHON)%' OR p.title ILIKE '%코딩테스트%')
ON CONFLICT (series_id, post_id) DO NOTHING;

-- 2. React 시리즈
INSERT INTO public.blog_series_posts (series_id, post_id, order_index)
SELECT
  s.id,
  p.id,
  ROW_NUMBER() OVER (ORDER BY p.created_at) as order_index
FROM public.blog_series s
CROSS JOIN public.blog_posts p
WHERE s.slug = 'react'
  AND (p.title ILIKE '%React%' OR p.title ILIKE '%리액트%')
  AND p.title NOT ILIKE '%mfa%'
  AND p.title NOT ILIKE '%module federation%'
ON CONFLICT (series_id, post_id) DO NOTHING;

-- 3. 타입스크립트 시리즈
INSERT INTO public.blog_series_posts (series_id, post_id, order_index)
SELECT
  s.id,
  p.id,
  ROW_NUMBER() OVER (ORDER BY p.created_at) as order_index
FROM public.blog_series s
CROSS JOIN public.blog_posts p
WHERE s.slug = 'typescript'
  AND (p.title ILIKE '%TypeScript%' OR p.title ILIKE '%타입스크립트%')
  AND p.title NOT ILIKE '%mfa%'
ON CONFLICT (series_id, post_id) DO NOTHING;

-- 4. 프로젝트 도런도런 (MFA 관련)
INSERT INTO public.blog_series_posts (series_id, post_id, order_index)
SELECT
  s.id,
  p.id,
  ROW_NUMBER() OVER (ORDER BY p.created_at) as order_index
FROM public.blog_series s
CROSS JOIN public.blog_posts p
WHERE s.slug = 'project-dogundorun'
  AND (
    p.title ILIKE '%mfa%'
    OR p.title ILIKE '%module federation%'
    OR p.title ILIKE '%Remote%App%'
    OR p.title ILIKE '%Host%App%'
    OR p.title ILIKE '%마이크로 프론트엔드%'
    OR p.title ILIKE '%도런도런%'
  )
ON CONFLICT (series_id, post_id) DO NOTHING;

-- 5. 인간 JS 엔진 시리즈
INSERT INTO public.blog_series_posts (series_id, post_id, order_index)
SELECT
  s.id,
  p.id,
  ROW_NUMBER() OVER (ORDER BY p.created_at) as order_index
FROM public.blog_series s
CROSS JOIN public.blog_posts p
WHERE s.slug = 'human-js-engine'
  AND (
    p.title ILIKE '%인간 JS 엔진%'
    OR p.title ILIKE '%JavaScript 엔진%'
    OR p.title ILIKE '%JS 엔진%'
    OR p.title ILIKE '%실행 컨텍스트%'
    OR p.title ILIKE '%호이스팅%'
    OR p.title ILIKE '%클로저%'
    OR p.title ILIKE '%this%바인딩%'
    OR p.title ILIKE '%프로토타입%'
    OR p.title ILIKE '%이벤트 루프%'
  )
  AND p.title NOT ILIKE '%Deep Dive%'
ON CONFLICT (series_id, post_id) DO NOTHING;

-- 6. Deep Dive 시리즈 - 모던 자바스크립트 Deep Dive
INSERT INTO public.blog_series_posts (series_id, post_id, order_index)
SELECT
  s.id,
  p.id,
  ROW_NUMBER() OVER (ORDER BY p.created_at) as order_index
FROM public.blog_series s
CROSS JOIN public.blog_posts p
WHERE s.slug = 'deep-dive'
  AND (
    p.title ILIKE '%Deep Dive%'
    OR p.title ILIKE '%딥다이브%'
    OR p.title ILIKE '%모던 자바스크립트%'
  )
ON CONFLICT (series_id, post_id) DO NOTHING;

-- ============================================
-- 결과 확인
-- ============================================

-- 시리즈별 포스트 수 확인
SELECT
  s.title as series_title,
  s.slug,
  COUNT(sp.id) as post_count
FROM public.blog_series s
LEFT JOIN public.blog_series_posts sp ON s.id = sp.series_id
GROUP BY s.id, s.title, s.slug
ORDER BY s.order_index;

-- 시리즈에 연결된 포스트 목록 확인
SELECT
  s.title as series_title,
  p.title as post_title,
  sp.order_index
FROM public.blog_series s
JOIN public.blog_series_posts sp ON s.id = sp.series_id
JOIN public.blog_posts p ON sp.post_id = p.id
ORDER BY s.order_index, sp.order_index;
