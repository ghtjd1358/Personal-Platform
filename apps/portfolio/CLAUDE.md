# Portfolio App (Remote)

프로젝트 포트폴리오 마이크로 프론트엔드.

## 개발 서버
- **Port:** 5003
- **실행:** `npm run dev:portfolio` (루트) 또는 `npm start` (앱 내)

## Module Federation
- **Name:** `portfolio` (remote3)
- **Exposes:** `./App` → Host에서 로드

## 주요 기능
- 프로젝트 쇼케이스
- AOS 스크롤 애니메이션
- Tiptap 에디터 (프로젝트 설명)

## 주요 의존성
- AOS (Animate On Scroll)
- Tiptap (에디터)
- UUID (고유 ID 생성)
