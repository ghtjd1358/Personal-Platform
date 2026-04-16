# Host App (Container)

Module Federation 컨테이너 앱. 모든 리모트 앱을 통합하는 Shell 역할.

## 개발 서버
- **Port:** 5000
- **실행:** `npm run dev:host` (루트) 또는 `npm start` (앱 내)

## 역할
- 리모트 앱 동적 로딩 (remoteEntry.js)
- 전역 상태 관리 (Redux Store를 `window.__REDUX_STORE__`로 노출)
- 라우팅 통합 (React Router)
- 인증 처리 (Firebase, Supabase)

## 주요 의존성
- Firebase (인증)
- Lottie (애니메이션)
- Redux Toolkit

## 환경변수
```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REMOTE1_URL, REMOTE2_URL, REMOTE3_URL
```

## 빌드 순서
lib → remotes (resume, blog, portfolio, techblog) → **host** (마지막)
