# Blog App (Remote)

개인 블로그 마이크로 프론트엔드.

## 개발 서버
- **Port:** 5002
- **실행:** `npm run dev:blog` (루트) 또는 `npm start` (앱 내)

## Module Federation
- **Name:** `blog`
- **Exposes:** `./App` → Host에서 로드

## 주요 기능
- 블로그 포스트 CRUD
- Tiptap 리치 텍스트 에디터
- Shiki/Lowlight 코드 하이라이팅
- DOMPurify XSS 방지

## 주요 의존성
- Tiptap (에디터)
- Shiki + Lowlight (구문 강조)
- Marked (마크다운 파싱)

## 스크립트
`scripts/` 폴더에 포스트 변환/정리 스크립트 존재
