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
mfa-monorepo/
├── packages/
│   └── lib/          # @sonhoseong/mfa-lib (공유 컴포넌트, 훅, 유틸)
└── apps/
    ├── host/         # 컨테이너 앱 (port 5000) - CLAUDE.md 참조
    ├── resume/       # 이력서 앱 (port 5001) - CLAUDE.md 참조
    ├── blog/         # 블로그 앱 (port 5002) - CLAUDE.md 참조
    ├── portfolio/    # 포트폴리오 앱 (port 5003) - CLAUDE.md 참조
    └── techblog/     # 기술블로그 앱 (port 5004) - CLAUDE.md 참조
```

각 앱/패키지 폴더에 상세 CLAUDE.md가 있음. 해당 앱 작업 시 참조.

## 핵심 패턴
- **동적 리모트 로딩:** 런타임에 remoteEntry.js 로드
- **캐시 무효화:** 1분 타임스탬프로 캐시 버스팅
- **Graceful Fallback:** 리모트 로드 실패 시 null 반환
- **Host App Flag:** `sessionStorage.isHostApp`로 컨텍스트 구분
- **Store 공유:** `window.__REDUX_STORE__`로 호스트 스토어 노출

## ⚠️ 절대 규칙 (MUST FOLLOW)

### Remote 레이아웃 일관성
**resume(remote1), blog(remote2), portfolio(remote3), techblog(remote4)의 레이아웃은 반드시 동일해야 한다.**

- Hero 섹션 크기/구조, 스크롤 동작, floating 버튼 위치, z-index 전부 일관성 유지
- 한 remote 수정 시 나머지 3개도 같이 맞춰야 함
- 기준: blog(remote2) 레이아웃을 따른다
- Host 모드에서: 모든 remote의 floating 버튼(`ScrollTopButton`, `UserFloatingMenu`, `floating-buttons`)은 `sessionStorage.getItem('isHostApp') === 'true'` 체크로 숨긴다
- Standalone 모드에서: floating 요소는 서로 겹치지 않도록 `.user-floating-menu` 컨테이너 안에 stack되거나 bottom 값이 충분히 분리되어야 함

### mfa-lib 사용 시 주의
- `packages/lib/src`의 변경은 `npm run build:lib` 전에는 `node_modules/@sonhoseong/mfa-lib/dist`에 반영되지 않음
- lib에 없는 export를 import하면 런타임 에러로 전체 remote가 빈화면이 됨
- 새 export가 필요하면 먼저 lib 빌드 후 사용

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
- techblog: Root Directory = `apps/techblog`
