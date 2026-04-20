-- ============================================
-- TechBlog (Job Tracker) Seed Data
-- Version: 1.0.0
-- Created: 2026-04-17
-- ============================================
-- Note: Run this after 001_initial_schema.sql
-- Dates are set relative to 2026-04-17

-- ============================================
-- SEED: jobs (채용공고 8개)
-- ============================================
INSERT INTO jobs (id, company, position, location, salary, deadline, skills, description, job_url, posted_at, company_info)
VALUES
  -- 1. 네이버
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    '네이버',
    '프론트엔드 개발자',
    '경기 성남시 분당구',
    '5,000 ~ 7,000만원',
    '2026-05-15',
    ARRAY['React', 'TypeScript', 'Next.js', 'Redux'],
    '네이버 검색 서비스의 프론트엔드 개발을 담당합니다.

주요 업무:
- 검색 결과 페이지 UI/UX 개선
- 성능 최적화 및 접근성 향상
- 디자인 시스템 컴포넌트 개발
- A/B 테스트 및 데이터 기반 개선

자격 요건:
- React, TypeScript 실무 경험 3년 이상
- 웹 표준 및 접근성에 대한 이해
- 협업 및 커뮤니케이션 능력',
    'https://recruit.navercorp.com/',
    '2026-04-01',
    '{"industry": "IT/인터넷", "employees": "4,000명 이상", "founded": "1999년", "logo": "https://via.placeholder.com/80?text=N"}'::jsonb
  ),

  -- 2. 카카오
  (
    'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
    '카카오',
    '웹 프론트엔드 개발자',
    '경기 성남시 분당구',
    '5,500 ~ 8,000만원',
    '2026-05-20',
    ARRAY['React', 'TypeScript', 'GraphQL', 'Emotion'],
    '카카오톡 웹 버전 개발을 담당합니다.

주요 업무:
- 카카오톡 PC 웹 클라이언트 개발
- 실시간 메시징 UI 구현
- 크로스 브라우저 호환성 확보

자격 요건:
- 웹 프론트엔드 개발 경력 5년 이상
- 실시간 통신 (WebSocket) 경험
- 대용량 트래픽 서비스 경험',
    'https://careers.kakao.com/',
    '2026-04-05',
    '{"industry": "IT/인터넷", "employees": "6,000명 이상", "founded": "2010년", "logo": "https://via.placeholder.com/80?text=K"}'::jsonb
  ),

  -- 3. 토스
  (
    'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
    '토스',
    'Frontend Engineer',
    '서울 강남구',
    '6,000 ~ 9,000만원',
    '2026-05-25',
    ARRAY['React', 'TypeScript', 'React Query', 'Recoil'],
    '토스 금융 서비스의 웹 프론트엔드를 개발합니다.

주요 업무:
- 금융 서비스 UI/UX 개발
- 모바일 웹뷰 최적화
- 보안 관련 프론트엔드 구현

자격 요건:
- 프론트엔드 개발 경력 4년 이상
- 금융/핀테크 도메인 경험 우대
- 보안 관련 지식 보유',
    'https://toss.im/career',
    '2026-04-10',
    '{"industry": "금융/핀테크", "employees": "2,000명 이상", "founded": "2013년", "logo": "https://via.placeholder.com/80?text=T"}'::jsonb
  ),

  -- 4. 쿠팡
  (
    'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
    '쿠팡',
    '프론트엔드 개발자',
    '서울 송파구',
    '5,500 ~ 7,500만원',
    '2026-05-18',
    ARRAY['React', 'JavaScript', 'Node.js', 'AWS'],
    '쿠팡 이커머스 플랫폼의 프론트엔드 개발을 담당합니다.

주요 업무:
- 상품 상세 페이지 개발
- 결제 프로세스 UI 구현
- 성능 최적화 (Core Web Vitals)

자격 요건:
- 프론트엔드 개발 경력 3년 이상
- 대규모 트래픽 처리 경험
- E-commerce 도메인 이해',
    'https://www.coupang.jobs/',
    '2026-04-08',
    '{"industry": "유통/이커머스", "employees": "15,000명 이상", "founded": "2010년", "logo": "https://via.placeholder.com/80?text=C"}'::jsonb
  ),

  -- 5. 당근마켓
  (
    'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
    '당근마켓',
    '웹 개발자',
    '서울 서초구',
    '5,000 ~ 7,000만원',
    '2026-05-30',
    ARRAY['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    '당근마켓 웹 서비스 개발을 담당합니다.

주요 업무:
- 중고거래 웹 플랫폼 개발
- SEO 최적화
- 모바일 반응형 구현

자격 요건:
- 웹 개발 경력 2년 이상
- Next.js SSR/SSG 경험
- UI/UX에 대한 관심',
    'https://about.daangn.com/jobs/',
    '2026-04-12',
    '{"industry": "IT/스타트업", "employees": "500명 이상", "founded": "2015년", "logo": "https://via.placeholder.com/80?text=D"}'::jsonb
  ),

  -- 6. 라인
  (
    'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
    '라인',
    'Frontend Developer',
    '경기 성남시 분당구',
    '5,500 ~ 8,000만원',
    '2026-06-01',
    ARRAY['Vue.js', 'TypeScript', 'Webpack', 'SCSS'],
    'LINE 메신저 관련 웹 서비스 개발을 담당합니다.

주요 업무:
- LINE 웹 스토어 개발
- 글로벌 서비스 다국어 지원
- 크로스 플랫폼 호환성

자격 요건:
- 프론트엔드 개발 경력 4년 이상
- Vue.js 또는 React 숙련
- 영어 커뮤니케이션 가능',
    'https://careers.linecorp.com/',
    '2026-04-15',
    '{"industry": "IT/인터넷", "employees": "3,000명 이상", "founded": "2000년", "logo": "https://via.placeholder.com/80?text=L"}'::jsonb
  ),

  -- 7. 배달의민족
  (
    'a7b8c9d0-e1f2-0a1b-4c5d-6e7f8a9b0c1d',
    '배달의민족',
    '프론트엔드 엔지니어',
    '서울 송파구',
    '5,000 ~ 7,500만원',
    '2026-05-28',
    ARRAY['React', 'TypeScript', 'MobX', 'Storybook'],
    '배달의민족 서비스의 웹 프론트엔드를 개발합니다.

주요 업무:
- 사장님 관리 페이지 개발
- 배달 현황 실시간 대시보드
- 디자인 시스템 구축

자격 요건:
- 프론트엔드 개발 경력 3년 이상
- 상태 관리 라이브러리 경험
- 컴포넌트 설계 능력',
    'https://career.woowahan.com/',
    '2026-04-18',
    '{"industry": "IT/O2O", "employees": "4,000명 이상", "founded": "2010년", "logo": "https://via.placeholder.com/80?text=B"}'::jsonb
  ),

  -- 8. NHN
  (
    'b8c9d0e1-f2a3-1b2c-5d6e-7f8a9b0c1d2e',
    'NHN',
    '웹 프론트엔드 개발자',
    '경기 성남시 분당구',
    '4,500 ~ 6,500만원',
    '2026-06-05',
    ARRAY['JavaScript', 'React', 'jQuery', 'CSS'],
    'NHN의 다양한 웹 서비스 개발을 담당합니다.

주요 업무:
- 페이코 웹 서비스 개발
- 게임 포털 UI 구현
- 레거시 코드 현대화

자격 요건:
- 웹 개발 경력 2년 이상
- JavaScript 깊은 이해
- 레거시 마이그레이션 경험 우대',
    'https://recruit.nhn.com/',
    '2026-04-20',
    '{"industry": "IT/게임", "employees": "5,000명 이상", "founded": "2013년", "logo": "https://via.placeholder.com/80?text=NHN"}'::jsonb
  );

-- ============================================
-- Verification Query
-- ============================================
-- SELECT id, company, position, deadline FROM jobs ORDER BY deadline;
