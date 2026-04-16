# Resume App (Remote)

이력서/포트폴리오 마이크로 프론트엔드.

## 개발 서버
- **Port:** 5001
- **실행:** `npm run dev:resume` (루트) 또는 `npm start` (앱 내)

## Module Federation
- **Name:** `resume`
- **Exposes:** `./App` → Host에서 로드

## 주요 기능
- 이력서 표시
- Supabase 데이터 연동
- react-icons 아이콘

## Host 연동
```typescript
// Host에서 사용 시
const ResumeApp = lazy(() => import('resume/App'));
```
