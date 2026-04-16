-- 더미 포트폴리오 데이터 삽입
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. 포트폴리오 데이터 삽입
INSERT INTO portfolios (title, slug, short_description, description, cover_image, badge, status, is_public, is_featured, view_count, order_index)
VALUES
  ('E-Commerce Platform', 'e-commerce-platform', '현대적인 온라인 쇼핑몰 플랫폼 개발', 'React와 Node.js를 활용한 풀스택 이커머스 플랫폼입니다. 결제 시스템 연동, 재고 관리, 주문 추적 등의 기능을 구현했습니다.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', 'Featured', 'published', true, true, 245, 1),
  ('Task Management App', 'task-management-app', '팀 협업을 위한 태스크 관리 앱', '실시간 협업이 가능한 태스크 관리 애플리케이션입니다. 드래그앤드롭, 실시간 알림, 간트차트 등의 기능을 제공합니다.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800', 'New', 'published', true, true, 189, 2),
  ('AI Chat Bot', 'ai-chat-bot', 'OpenAI API 기반 AI 챗봇 서비스', 'GPT-4를 활용한 지능형 챗봇 서비스입니다. 자연어 처리, 맥락 이해, 다국어 지원 기능을 갖추고 있습니다.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', NULL, 'published', true, false, 156, 3),
  ('Health & Fitness Tracker', 'health-fitness-tracker', '개인 건강 관리 모바일 앱', 'React Native로 개발한 크로스플랫폼 건강 관리 앱입니다. 운동 기록, 식단 관리, 수면 추적 기능을 제공합니다.', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', NULL, 'published', true, false, 98, 4),
  ('Real Estate Platform', 'real-estate-platform', '부동산 매물 검색 및 중개 플랫폼', '지도 기반 부동산 매물 검색 플랫폼입니다. 필터링, 가상 투어, 중개사 연결 기능을 포함합니다.', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Popular', 'published', true, false, 312, 5);

-- 2. 포트폴리오 상세 정보 삽입
INSERT INTO portfolio_details (portfolio_id, period, role, team_size, contribution)
SELECT id, '2024.01 - 2024.06', 'Full Stack Developer', 5, 80 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL
SELECT id, '2023.08 - 2024.02', 'Frontend Lead', 4, 70 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL
SELECT id, '2024.03 - 2024.05', 'AI Engineer', 3, 90 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL
SELECT id, '2023.06 - 2023.12', 'Mobile Developer', 2, 100 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL
SELECT id, '2024.02 - 진행중', 'Backend Developer', 6, 60 FROM portfolios WHERE slug = 'real-estate-platform';

-- 3. 포트폴리오 태그 삽입
-- E-Commerce Platform
INSERT INTO portfolio_tags (portfolio_id, tag, order_index)
SELECT id, 'React', 0 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, 'Node.js', 1 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, 'E-Commerce', 2 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, 'Payment', 3 FROM portfolios WHERE slug = 'e-commerce-platform';

-- Task Management App
INSERT INTO portfolio_tags (portfolio_id, tag, order_index)
SELECT id, 'React', 0 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, 'WebSocket', 1 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, 'Collaboration', 2 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, 'Productivity', 3 FROM portfolios WHERE slug = 'task-management-app';

-- AI Chat Bot
INSERT INTO portfolio_tags (portfolio_id, tag, order_index)
SELECT id, 'AI', 0 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, 'ChatGPT', 1 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, 'NLP', 2 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, 'Python', 3 FROM portfolios WHERE slug = 'ai-chat-bot';

-- Health & Fitness Tracker
INSERT INTO portfolio_tags (portfolio_id, tag, order_index)
SELECT id, 'React Native', 0 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, 'Mobile', 1 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, 'Health', 2 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, 'iOS/Android', 3 FROM portfolios WHERE slug = 'health-fitness-tracker';

-- Real Estate Platform
INSERT INTO portfolio_tags (portfolio_id, tag, order_index)
SELECT id, 'Next.js', 0 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, 'Maps', 1 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, 'Real Estate', 2 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, 'TypeScript', 3 FROM portfolios WHERE slug = 'real-estate-platform';

-- 4. 기술 스택 삽입
-- E-Commerce Platform
INSERT INTO portfolio_tech_stack (portfolio_id, name, icon, icon_color, category, order_index)
SELECT id, 'React', 'SiReact', '#61DAFB', 'Frontend', 0 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, 'Node.js', 'SiNodedotjs', '#339933', 'Backend', 1 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, 'PostgreSQL', 'SiPostgresql', '#4169E1', 'Database', 2 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, 'Stripe', 'SiStripe', '#008CDD', 'Payment', 3 FROM portfolios WHERE slug = 'e-commerce-platform';

-- Task Management App
INSERT INTO portfolio_tech_stack (portfolio_id, name, icon, icon_color, category, order_index)
SELECT id, 'React', 'SiReact', '#61DAFB', 'Frontend', 0 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, 'Socket.io', 'SiSocketdotio', '#010101', 'Realtime', 1 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, 'Redis', 'SiRedis', '#DC382D', 'Cache', 2 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, 'Docker', 'SiDocker', '#2496ED', 'DevOps', 3 FROM portfolios WHERE slug = 'task-management-app';

-- AI Chat Bot
INSERT INTO portfolio_tech_stack (portfolio_id, name, icon, icon_color, category, order_index)
SELECT id, 'Python', 'SiPython', '#3776AB', 'Backend', 0 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, 'OpenAI', 'SiOpenai', '#412991', 'AI', 1 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, 'FastAPI', 'SiFastapi', '#009688', 'Backend', 2 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, 'MongoDB', 'SiMongodb', '#47A248', 'Database', 3 FROM portfolios WHERE slug = 'ai-chat-bot';

-- Health & Fitness Tracker
INSERT INTO portfolio_tech_stack (portfolio_id, name, icon, icon_color, category, order_index)
SELECT id, 'React Native', 'SiReact', '#61DAFB', 'Mobile', 0 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, 'Firebase', 'SiFirebase', '#FFCA28', 'Backend', 1 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, 'Expo', 'SiExpo', '#000020', 'Mobile', 2 FROM portfolios WHERE slug = 'health-fitness-tracker';

-- Real Estate Platform
INSERT INTO portfolio_tech_stack (portfolio_id, name, icon, icon_color, category, order_index)
SELECT id, 'Next.js', 'SiNextdotjs', '#000000', 'Frontend', 0 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, 'TypeScript', 'SiTypescript', '#3178C6', 'Language', 1 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, 'Supabase', 'SiSupabase', '#3ECF8E', 'Backend', 2 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, 'Mapbox', 'SiMapbox', '#000000', 'Maps', 3 FROM portfolios WHERE slug = 'real-estate-platform';

-- 5. 포트폴리오 태스크 삽입
-- E-Commerce Platform
INSERT INTO portfolio_tasks (portfolio_id, task, order_index)
SELECT id, '프론트엔드 UI/UX 설계 및 구현', 0 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, '결제 시스템 연동 (Stripe)', 1 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, 'RESTful API 설계 및 개발', 2 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, '주문/배송 추적 시스템 구현', 3 FROM portfolios WHERE slug = 'e-commerce-platform';

-- Task Management App
INSERT INTO portfolio_tasks (portfolio_id, task, order_index)
SELECT id, '실시간 협업 기능 구현 (WebSocket)', 0 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, '드래그앤드롭 UI 개발', 1 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, '알림 시스템 설계', 2 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, '간트차트 컴포넌트 개발', 3 FROM portfolios WHERE slug = 'task-management-app';

-- AI Chat Bot
INSERT INTO portfolio_tasks (portfolio_id, task, order_index)
SELECT id, 'GPT-4 API 연동', 0 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, '대화 맥락 관리 시스템 구현', 1 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, '다국어 응답 처리', 2 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, '응답 스트리밍 구현', 3 FROM portfolios WHERE slug = 'ai-chat-bot';

-- Health & Fitness Tracker
INSERT INTO portfolio_tasks (portfolio_id, task, order_index)
SELECT id, '크로스플랫폼 앱 개발', 0 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, '건강 데이터 시각화', 1 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, '운동 추적 알고리즘 개발', 2 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, 'Apple Health/Google Fit 연동', 3 FROM portfolios WHERE slug = 'health-fitness-tracker';

-- Real Estate Platform
INSERT INTO portfolio_tasks (portfolio_id, task, order_index)
SELECT id, '지도 기반 매물 검색 구현', 0 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, '필터링 시스템 개발', 1 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, '가상 투어 기능 구현', 2 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, '중개사 매칭 시스템', 3 FROM portfolios WHERE slug = 'real-estate-platform';

-- 6. 포트폴리오 결과 삽입
-- E-Commerce Platform
INSERT INTO portfolio_results (portfolio_id, result, metric_value, order_index)
SELECT id, '월간 매출 300% 증가', '300%', 0 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, '평균 주문 처리 시간 50% 단축', '50%', 1 FROM portfolios WHERE slug = 'e-commerce-platform'
UNION ALL SELECT id, '고객 만족도 4.8/5.0', '4.8', 2 FROM portfolios WHERE slug = 'e-commerce-platform';

-- Task Management App
INSERT INTO portfolio_results (portfolio_id, result, metric_value, order_index)
SELECT id, '팀 생산성 40% 향상', '40%', 0 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, '프로젝트 완료율 25% 증가', '25%', 1 FROM portfolios WHERE slug = 'task-management-app'
UNION ALL SELECT id, '사용자 리텐션 85%', '85%', 2 FROM portfolios WHERE slug = 'task-management-app';

-- AI Chat Bot
INSERT INTO portfolio_results (portfolio_id, result, metric_value, order_index)
SELECT id, '고객 문의 응답률 95%', '95%', 0 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, '평균 응답 시간 2초', '2s', 1 FROM portfolios WHERE slug = 'ai-chat-bot'
UNION ALL SELECT id, '사용자 만족도 4.7/5.0', '4.7', 2 FROM portfolios WHERE slug = 'ai-chat-bot';

-- Health & Fitness Tracker
INSERT INTO portfolio_results (portfolio_id, result, metric_value, order_index)
SELECT id, '앱스토어 평점 4.6', '4.6', 0 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, '월간 활성 사용자 10만+', '100K+', 1 FROM portfolios WHERE slug = 'health-fitness-tracker'
UNION ALL SELECT id, '데일리 목표 달성률 78%', '78%', 2 FROM portfolios WHERE slug = 'health-fitness-tracker';

-- Real Estate Platform
INSERT INTO portfolio_results (portfolio_id, result, metric_value, order_index)
SELECT id, '매물 조회수 200% 증가', '200%', 0 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, '중개 성사율 35% 향상', '35%', 1 FROM portfolios WHERE slug = 'real-estate-platform'
UNION ALL SELECT id, '평균 체류 시간 5분', '5min', 2 FROM portfolios WHERE slug = 'real-estate-platform';

-- 완료 확인
SELECT 'Portfolios: ' || COUNT(*) FROM portfolios
UNION ALL SELECT 'Details: ' || COUNT(*) FROM portfolio_details
UNION ALL SELECT 'Tags: ' || COUNT(*) FROM portfolio_tags
UNION ALL SELECT 'Tech Stacks: ' || COUNT(*) FROM portfolio_tech_stack
UNION ALL SELECT 'Tasks: ' || COUNT(*) FROM portfolio_tasks
UNION ALL SELECT 'Results: ' || COUNT(*) FROM portfolio_results;