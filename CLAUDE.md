# MFA Portfolio - Micro Frontend Architecture

## 기술 스택
- React 19 + TypeScript
- Webpack 5 Module Federation
- Redux Toolkit + React Redux
- Supabase (PostgreSQL + Auth)

## 빌드 명령어
```bash
# 루트 레벨
npm run dev           # 모든 앱 동시 실행
npm run dev:host      # Host만 실행 (port 5000)
npm run dev:resume    # Resume 앱 (port 5001)
npm run dev:blog      # Blog 앱 (port 5002)
npm run dev:portfolio # Portfolio 앱 (port 5003)
npm run dev:techblog  # TechBlog 앱 (port 5004)

npm run build:all     # 전체 빌드 (lib → remotes → host)
npm run build:lib     # 공유 라이브러리 빌드
```

## 아키텍처
```
mfa-portfolio/
├── packages/
│   └── lib/          # @sonhoseong/mfa-lib (공유 컴포넌트, 훅, 유틸)
└── apps/
    ├── host/         # 컨테이너 앱 (port 5000)
    ├── resume/       # 이력서 앱 (port 5001)
    ├── blog/         # 블로그 앱 (port 5002)
    ├── portfolio/    # 포트폴리오 앱 (port 5003)
    └── techblog/     # 기술블로그 앱 (port 5004)
```

## 핵심 패턴
- **동적 리모트 로딩:** 런타임에 remoteEntry.js 로드
- **캐시 무효화:** 1분 타임스탬프로 캐시 버스팅
- **Graceful Fallback:** 리모트 로드 실패 시 null 반환
- **Host App Flag:** `sessionStorage.isHostApp`로 컨텍스트 구분
- **Store 공유:** `window.__REDUX_STORE__`로 호스트 스토어 노출

## 환경변수
```bash
REACT_APP_SUPABASE_URL=...
REACT_APP_SUPABASE_ANON_KEY=...
REMOTE1_URL=https://...vercel.app
REMOTE2_URL=https://...vercel.app
REMOTE3_URL=https://...vercel.app
```

## 배포 (Vercel)
각 앱별 Vercel 프로젝트:
- host: Root Directory = `apps/host`
- resume: Root Directory = `apps/resume`
- blog: Root Directory = `apps/blog`
- portfolio: Root Directory = `apps/portfolio`
