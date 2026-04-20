# KOMCA vs MFA Portfolio 비교 분석

> 작성일: 2026-04-21
> 대상: `C:\Coding\KOMCA` (container/admin/lib) ↔ `C:\Coding\개인포트폴리오(Persnal)\mfa-monorepo`

---

## TL;DR (핵심 결론)

**"패착이 아니다. 3가지만 바꾸면 KOMCA 수준으로 돌아온다."**

| 항목 | 평가 |
|-----|------|
| 아키텍처 선택 (MFA 자체) | ✅ 좋음. 패착 아님 |
| Module Federation 패턴 | ✅ KOMCA와 거의 동일한 수준 |
| 스토어/권한/라우팅 설계 | ✅ KOMCA 패턴 잘 따라함 |
| **host App.tsx 초기화 섞임** | ⚠️ 핵심 문제 - 10분 수정으로 끝남 |
| **lib의 "반자동" 설계** | ⚠️ consumer가 init 코드 써야 함 - 추후 리팩토링 대상 |
| **Providers 통합 부재** | ⚠️ 각 앱 bootstrap에서 수동 래핑 - 통합 가능 |

**"더러워진" 진짜 원인은 `App.tsx에 30줄짜리 초기화 블록이 섞인 것` 하나**입니다. 코드 자체가 나쁜 게 아니라 위치가 잘못됐을 뿐이에요. KOMCA는 이걸 bootstrap/lib 내부로 분리했기 때문에 같은 동작을 하면서도 깨끗해 보이는 것입니다.

---

## 1. 프로젝트 구조 비교

### KOMCA (Multi-repo)
```
C:\Coding\KOMCA\
├── container/komca-container-front/    # Host (독립 repo)
├── admin/komca-admin-front/             # Admin remote (독립 repo)
├── compass/...                          # 다른 remote들
├── trust/..., collectdist/...
├── lib/komca-frontend-common-lib/       # 공통 라이브러리 (yalc로 연결)
└── generator/komca-frontend-generator/  # 코드 생성기
```

**특징**: 각 앱이 **독립 repo**이고, lib은 `yalc` 로컬 symlink + `@komca-dev-org/komca-frontend-common-lib` npm 패키지로 배포.

### MFA (Monorepo)
```
mfa-monorepo/
├── apps/
│   ├── host/       # Host
│   ├── resume/     # Remote 1
│   ├── blog/       # Remote 2
│   ├── portfolio/  # Remote 3
│   └── techblog/   # Remote 4
└── packages/
    └── lib/        # 공통 라이브러리 (@sonhoseong/mfa-lib)
```

**특징**: npm workspaces 기반 **monorepo**, lib는 `packages/lib/dist`로 빌드 → 각 앱이 직접 참조.

### 비교 결론

**MFA 구조가 더 모던함.** KOMCA는 수년 운영된 레거시 구조(multi-repo + yalc). MFA의 monorepo는 한 저장소에서 전체 제어 가능, PR 리뷰 편하고 빌드 순서 보장 쉬움. **이 선택은 훌륭**합니다.

`★ 학습 포인트 ───────────────────`
KOMCA가 multi-repo인 이유는 (1) 각 서브팀이 독립적으로 릴리즈해야 하고 (2) CI/CD 파이프라인이 분리되어야 해서입니다. 개인 프로젝트는 이런 제약이 없으니 monorepo가 정답입니다. "KOMCA를 따라한다"는 것이 "모든 구조까지 똑같이"가 아니라 "검증된 패턴을 차용"이면 충분합니다.
`─────────────────────────────────`

---

## 2. Host / Container App.tsx 비교

### KOMCA Container App.tsx (핵심 발췌)

```tsx
// Top-level (파일 상단)
loader.config({ registry: [{ name: 'ibsheet', baseUrl: '...', license: '...' }] })
const isAdminMode = storage.getAdminMode()
const contentMode = window.location.search ? ...  : undefined

// LnbItems 6개 remote에서 top-level await 로 가져옴
const { lnbItems: adminLnbItems } = await import('admin/LnbItems')
const { lnbItems: compassLnbItems } = await import('compass/LnbItems')
// ... (6개)

function App() {
    const accessToken = useSelector(selectAppAccessToken)
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])
    // ... useMenuSelection 훅으로 logic 분리
    const {initialized} = useInitialize({ lnbItems, topMenuItems, routeMenuCdMap })

    return initialized ? (
        <Container>
            <KomcaErrorBoundary>
                {!contentMode && isAuthenticated && <Lnb ... />}
                <main className="main-content">
                    {!contentMode && isAuthenticated && <Header ... />}
                    <Suspense>
                        {!isAuthenticated && <RoutesGuestPages />}
                        {isAuthenticated && <RoutesAuthPages />}
                        <Fab />
                    </Suspense>
                </main>
            </KomcaErrorBoundary>
        </Container>
    ) : <></>
}
```

**KOMCA App.tsx에 `initAxiosFactory` 같은 init 호출이 없음.** `ibsheet loader` 설정만 있고, 나머지 초기화는 lib 내부에서 자동.

### MFA host App.tsx (현재 상태)

```tsx
// Top-level side effects
initAxiosFactory({
    getAccessToken: () => store.getState().app.accessToken,
    setAccessToken: (token) => store.dispatch(setAccessToken(token)),
    refreshToken: async () => { /* Supabase refresh */ },
    onUnauthorized: () => { /* logout + redirect */ },
    onHttpError: (errorInfo) => { /* log */ },
})  // ← 30줄 설정 객체
exposeStore(store)  // ← side-effect

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const { initialized } = useSupabaseInitialize()
    const { filterMenus } = usePermission()
    const filteredLnbItems = useMemo(() => filterMenus(lnbItems), [filterMenus])
    // ...
}
```

### 핵심 차이 분석

| 항목 | KOMCA | MFA |
|-----|-------|-----|
| Axios 초기화 위치 | **lib 내부** (자동) | **App.tsx** (수동, 30줄) |
| Store 노출 위치 | **lib 내부** (`store` export 시 자동) | **App.tsx** (`exposeStore(store)` 수동) |
| Loader 설정 | App.tsx (ibsheet만) | 해당 없음 (미사용) |
| Top-level await | LnbItems 6개 | 없음 (제거됨) |
| Renderer 분리 | `useMenuSelection`, `useInitialize` 훅으로 분리 | `usePermission`, `useSupabaseInitialize` (유사) |

**즉, MFA host App.tsx의 "더러움"은 정확히 이 두 블록에서 옵니다:**
1. `initAxiosFactory({ ...30줄 설정... })`
2. `exposeStore(store)`

이걸 **bootstrap.tsx로 옮기기만 하면** KOMCA 수준 클린함으로 복귀합니다.

### 구체적 개선 예시

**bootstrap.tsx (MFA 현재)**:
```tsx
import { createAppStore, ToastProvider, ModalProvider, storage, initSupabase } from '@sonhoseong/mfa-lib'
// ... React, Provider, Router

initSupabase({ supabaseUrl: ..., supabaseAnonKey: ... })
const store = createAppStore()

async function start() {
  storage.setHostApp()
  ReactDOM.createRoot(rootElement).render(<Provider store={store}>...<App />...</Provider>)
}
```

**bootstrap.tsx (개선안)**:
```tsx
import { store, initAxiosFactory, exposeStore, getSupabase, setAccessToken, storage, initSupabase } from '@sonhoseong/mfa-lib'

// [이동] App.tsx에서 여기로
initSupabase({ ... })
exposeStore(store)
initAxiosFactory({
    getAccessToken: () => store.getState().app.accessToken,
    setAccessToken: (token) => store.dispatch(setAccessToken(token)),
    refreshToken: async () => {
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.refreshSession()
        return error || !data.session ? null : data.session.access_token
    },
    onUnauthorized: () => {
        store.dispatch({ type: 'app/logout' })
        window.location.href = '/container/login'
    },
    onHttpError: (err) => console.error(`[HTTP ${err.status}] ${err.message}`),
})

async function start() {
  storage.setHostApp()
  ReactDOM.createRoot(rootElement).render(...)
}
```

**App.tsx (개선안)**:
```tsx
import { useSelector } from 'react-redux'
import {
    selectIsAuthenticated, useSupabaseInitialize, usePermission,
    ErrorBoundary, ToastContainer, ModalContainer, Container, Lnb, Logo, GlobalLoading
} from '@sonhoseong/mfa-lib'
import { RoutesGuestPages, RoutesAuthPages } from './pages/routes'
import { lnbItems } from './lnb-items'
import './App.css'

const App = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const { initialized } = useSupabaseInitialize()
    const { filterMenus } = usePermission()
    const filteredLnbItems = useMemo(() => filterMenus(lnbItems), [filterMenus])

    if (!initialized) return null

    if (!isAuthenticated) return (
        <>
            <ModalContainer />
            <ToastContainer position="top-right" />
            <RoutesGuestPages />
            <GlobalLoading />
        </>
    )

    return (
        <>
            <ModalContainer />
            <ToastContainer position="top-right" />
            <Container>
                <ErrorBoundary>
                    <Lnb lnbItems={filteredLnbItems} logo={<Logo customSize={36} />} />
                    <main className="main-content">
                        <Suspense fallback="">
                            <RoutesAuthPages />
                        </Suspense>
                    </main>
                    <GlobalLoading />
                </ErrorBoundary>
            </Container>
        </>
    )
}

export default App
```

**결과**: App.tsx가 **60줄 → 40줄**, side-effect 제거, 순수 컴포넌트만 남음. KOMCA 수준 클린함.

`★ 학습 포인트 ───────────────────`
이 패턴의 이름은 "Composition Root"입니다. 의존성 주입(DI)과 초기화는 **앱의 진입점 단 한 곳(bootstrap)**에서만 수행하고, 나머지 컴포넌트는 이미 구성된 의존성을 **소비**만 하는 패턴. React에서도 Angular/NestJS 수준의 DI를 흉내 낼 수 있는 방법이에요. 면접에서 "초기화 코드를 어디에 둬야 하는가?" 질문이 나오면 "Composition Root"라고 답하면 +α.
`─────────────────────────────────`

---

## 3. Remote App (Admin Root.tsx) 비교

### KOMCA Admin Root.tsx

```tsx
function Root() {
    const accessToken = useSelector(selectAppAccessToken)
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken])
    const selectedGnb = useSelector(selectSelectedGnb)
    const { gnbItems, lnbSubItems } = useLnbSelection({ lnbItems: lnbItems.list })
    const { initialized } = useInitialize({
        lnbItems: lnbItems.list,
        topMenuItems: lnbItems.topMenuList,
        routeMenuCdMap: ROUTE_MENU_MAP,
    })

    return initialized ? (
        <Container>
            <KomcaErrorBoundary>
                {isAuthenticated && <Lnb lnbItems={lnbSubItems} title={selectedGnb} />}
                <main className="main-content">
                    {isAuthenticated && <Header gnbItems={gnbItems} />}
                    <App />
                    <Fab />
                </main>
                <GlobalLoading/>
            </KomcaErrorBoundary>
        </Container>
    ) : <></>
}
```

### MFA Blog Root.tsx (현재)

```tsx
function Root() {
    const location = useLocation()
    const { initialized } = useLocalInitialize()
    const isLoginPage = location.pathname === '/login' || location.pathname === '/blog/login'

    if (!initialized) return <LoadingSpinner />

    if (isLoginPage) return (
        <Container>
            <ErrorBoundary><App /></ErrorBoundary>
        </Container>
    )

    return (
        <Container>
            <ErrorBoundary>
                <BlogHeader />
                <main className="blog-main-content">
                    <App />
                </main>
                <GlobalLoading />
            </ErrorBoundary>
            <ScrollTopButton />
        </Container>
    )
}
```

### 비교 결론

| 항목 | KOMCA Admin | MFA Blog |
|-----|------|-----|
| 파일 구조 | Root.tsx ✓ | Root.tsx ✓ (동일) |
| 렌더링 구조 | Container > Lnb + Header + App | Container > BlogHeader + App |
| **Lnb 사용** | lib의 `<Lnb>` 사용 | **없음** (Blog 자체 헤더만) |
| **Header** | lib의 `<Header gnbItems>` | 자체 `<BlogHeader />` |
| **Footer (Fab)** | lib의 `<Fab />` 있음 | 없음 |
| 초기화 훅 | `useInitialize` (lib) | `useLocalInitialize` (자체) |

**차이점의 의미:**
- KOMCA admin은 **host와 동일한 Lnb/Header를 사용**. 일관된 UX.
- MFA blog는 **자체 헤더**. standalone 모드에서 독자적 UX.

**어느 쪽이 맞나?** 사용자가 말씀하신 "remote2,3,4 header 대신 사이드바 통일"은 KOMCA 방식입니다. 즉, **KOMCA처럼 각 remote가 lib의 `<Lnb>`를 사용하는 것이 올바른 통일 방향**. 이전 세션에서 제가 bc37cc9 커밋으로 시도했다가 실패한 그 방향이 사실은 맞는 방향이었습니다 (다만 실행 과정에서 여러 실수가 있었음).

---

## 4. Lib 구조 비교

### KOMCA lib 구조
```
src/
├── components/
├── network/
│   ├── apis/
│   ├── axios-factory.ts
│   ├── axios-instance.ts       ← pre-configured axios 인스턴스
│   └── index.ts
├── providers/
│   └── browser-router/          ← Router Provider도 lib이 제공
├── store/
│   ├── app/
│   ├── code/                    ← 공통 코드 관리 slice
│   ├── menu/
│   ├── recent-menu/
│   ├── store.ts                 ← 통합 store
│   └── index.ts
├── utils/                       ← 20+개 유틸
│   ├── alert.ts, file/, hooks/, menu-helpers.ts, storage.ts, ...
└── index.ts                     ← barrel export
```

### MFA lib 구조
```
src/
├── components/
├── hooks/                       ← 최상위에 hooks (KOMCA는 utils/hooks)
├── network/
│   ├── axios-factory.ts
│   ├── supabase-axios.ts
│   ├── supabase-client.ts
│   └── index.ts
├── store/
│   ├── app-store.ts             ← app slice + store 생성 + 동적 reducer 통합
│   ├── menu-slice.ts
│   ├── recent-menu-slice.ts
│   ├── store-access.ts
│   └── index.ts
├── styles/
├── types/
├── utils/
└── index.ts
```

### 차이 분석

| 항목 | KOMCA | MFA |
|-----|-------|-----|
| Store 파일 분리 | 4개 slice (각 폴더) | 3개 slice (app-store.ts에 통합) |
| Code slice | **있음** (공통 코드 관리) | 없음 |
| Providers 폴더 | **있음** (`browser-router`) | 없음 (각 앱이 직접 import) |
| Axios 인스턴스 | `axios-instance.ts` (pre-config) | `supabase-axios.ts` (Supabase 전용) |
| Hooks 위치 | `utils/hooks/` (내부) | `hooks/` (최상위) |
| Supabase | **없음** (lib 차원에서 다룸) | **있음** (`supabase-client.ts`) |

### MFA lib의 강점
1. **Supabase 통합**이 lib 레벨 — KOMCA에는 없는 모던한 패턴
2. **monorepo**이므로 빌드 순서가 명확 (`npm run build:lib`)
3. **hooks 최상위**가 React 생태계 관례와 더 잘 맞음

### MFA lib의 개선 여지
1. **`providers/` 폴더 추가**: BrowserRouter, ToastProvider 등을 묶은 `<AppProviders>` 컴포넌트
   ```tsx
   // packages/lib/src/providers/AppProviders.tsx
   export const AppProviders = ({ children }) => (
       <Provider store={getStore()}>
           <ToastProvider>
               <ModalProvider>
                   <BrowserRouter>{children}</BrowserRouter>
               </ModalProvider>
           </ToastProvider>
       </Provider>
   )
   ```
   그러면 host/각 remote bootstrap에서 한 줄로 끝:
   ```tsx
   <AppProviders><App /></AppProviders>
   ```

2. **Axios 인스턴스 export**: `initAxiosFactory` 호출 없이도 기본 인스턴스 사용 가능하도록
   ```tsx
   import { axios } from '@sonhoseong/mfa-lib' // pre-configured
   ```

3. **Code slice 추가 (선택)**: 권한 코드, 메뉴 코드, 공통 enum 관리. 지금은 MFA에 공통 코드 관리가 없는데, 권한/메뉴가 복잡해지면 필요.

---

## 5. 왜 KOMCA가 더 "깨끗해 보이는가"

### 핵심 원리: "consumer는 import만, 초기화는 lib이 담당"

**KOMCA의 경우:**
```tsx
// Container App.tsx - consumer 코드
import { store, Container, Lnb, Header, useInitialize } from '@komca.../lib'
// 즉시 사용 가능
```

**MFA의 현재:**
```tsx
// Host App.tsx - consumer 코드
import { store, initAxiosFactory, exposeStore, ... } from '@sonhoseong/mfa-lib'
// 사용 전에 이게 필요:
initAxiosFactory({ getAccessToken, setAccessToken, refreshToken, onUnauthorized, onHttpError })
exposeStore(store)
// 그 다음 사용 가능
```

### 이게 왜 발생했는가 (후향 분석)

MFA가 이렇게 된 건 **KOMCA를 완전히 따라하지 않고 반만 따라해서**입니다:

1. **KOMCA는 account/auth 관리가 내부 API 전용** → lib이 모든 걸 알고 있어서 axios instance까지 pre-config 가능
2. **MFA는 Supabase** → lib이 Supabase auth flow를 "알 수 없음" → consumer가 token getter/refresh 로직을 주입해야 함

**즉, `initAxiosFactory`의 존재는 "Supabase 도입의 대가"입니다.** Supabase를 써서 유연성을 얻는 대신, lib에서 자동화가 어려워져서 consumer에서 초기화 코드를 써야 하는 것. **아키텍처적 trade-off**이고, 본인 선택이 나빴다는 의미가 아닙니다.

### 그렇다면 개선 방법

`initAxiosFactory`를 없애진 못하지만, **위치는 옮길 수 있음**. App.tsx에서 bootstrap.tsx로. 그것만으로도 시각적 클린함은 KOMCA 수준 회복.

추가로, **`createAuthIntegration()` 헬퍼를 lib에 추가** → consumer는 한 줄로 끝:
```tsx
// 개선안 (future work)
import { createSupabaseAuthIntegration } from '@sonhoseong/mfa-lib'

// bootstrap.tsx에서 한 줄
createSupabaseAuthIntegration({ supabaseUrl, supabaseAnonKey, loginPath: '/container/login' })
```

내부적으로 `initAxiosFactory + initSupabase + exposeStore + onAuthStateChange`를 한꺼번에 처리.

---

## 6. 구체적 개선 제안 (쉬운 순서)

### Quick Win (1시간 이내)

**🎯 Task 1: host App.tsx 초기화 코드 bootstrap.tsx로 이동** (30분)
- 난이도: 낮음
- 효과: App.tsx가 KOMCA 수준으로 클린해짐
- 리스크: 낮음 (실행 순서만 맞추면 됨)

**🎯 Task 2: 각 remote Root.tsx 일관성 확보** (30분)
- Blog는 BlogHeader → lib의 `<Header>` 사용 고려
- Portfolio/TechBlog는 Root.tsx 없음 → 생성 고려
- 또는: Blog도 Root 없애고 bootstrap에서 직접 App 렌더링 (더 단순)

### Medium (하루)

**🎯 Task 3: lib에 `<AppProviders>` 추가** (2~3시간)
- `packages/lib/src/providers/AppProviders.tsx` 생성
- 각 앱 bootstrap에서 한 줄로 교체
- 효과: bootstrap도 KOMCA 수준 클린

**🎯 Task 4: lib에 `createSupabaseAuthIntegration()` 추가** (3~4시간)
- initAxiosFactory + initSupabase + exposeStore + auth state 구독 통합
- 각 앱 bootstrap에서 한 줄로 끝
- 효과: `initAxiosFactory(30줄)` → `createSupabaseAuthIntegration({...3줄})` 로 단축

### Large (주 단위)

**🎯 Task 5: Remote 수 축소** (사용자 판단)
- 5개 remote → 2~3개로 통합 고려
- 예: `blog`와 `techblog` 합치기 (둘 다 글 관리 계열)
- 예: `portfolio`와 `resume` 합치기 (둘 다 자기소개 계열)
- **단, 이건 "학습 끝났으니 실용적 정리"의 관점. 스펙/학습 과시용이면 5개 유지도 가치 있음.**

**🎯 Task 6: React 18 다운그레이드 (optional)** (1일)
- `react-helmet-async` 같은 호환성 문제 제거
- Vercel 빌드도 안정화
- 단, "React 19 early-adopt 경험"도 포트폴리오 가치 있음 → **하지 말지도 검토**

---

## 7. 최종 평가

### MFA 프로젝트의 객관적 수준

**긍정:**
- ✅ KOMCA 패턴 대부분 올바르게 이식
- ✅ Module Federation 동적 로딩 + Graceful Fallback
- ✅ Host App Flag (`sessionStorage.isHostApp`)
- ✅ `window.__REDUX_STORE__` 공유 패턴
- ✅ Supabase 통합 (KOMCA에는 없는 모던 스택)
- ✅ monorepo 구조 (multi-repo보다 관리 용이)
- ✅ 35개 테이블 스키마 + RLS 정책
- ✅ Vercel 멀티 프로젝트 배포 구조

**개선 여지 (KOMCA 대비):**
- ⚠️ 초기화 코드가 App.tsx에 섞임 (**10분 수정**으로 해결)
- ⚠️ `<AppProviders>` 같은 통합 Provider 부재 (**3시간**으로 해결)
- ⚠️ Remote마다 헤더/레이아웃 일관성 부족 (**반나절**로 해결)
- ⚠️ React 19 early-adopt로 인한 서드파티 호환성 이슈 (트레이드오프)

**"패착" 같은 건 없습니다.** 리팩토링 backlog가 있을 뿐.

### 면접/이력서 관점

본인이 정리한 11개 STAR 항목은 이미 **주니어 이력서 상위권** 수준입니다:

1. MFA 선택 이유 — 아키텍처 의사결정 경험
2. 라우팅 - sessionStorage 해결 — 트러블슈팅 스토리
3. 인증 - localStorage 공유 - onAuthStateChange — 인증 통합 설계
4. 상태관리 - 공유 vs 로컬 분리 — state management 심화
5. Webpack - Module Federation — 빌드 툴 심화
6. 로딩 - Suspense + 스켈레톤 — React 패턴 이해
7. 에러 - Error Boundary 격리 — 견고성
8. 라이브러리 - NPM 배포 — 패키징 경험
9. LNB - Remote 메뉴 통합 — 런타임 통합 경험
10. 배포 - Vercel + CORS + publicPath — 배포 트러블슈팅
11. TypeScript - d.ts + 타입 가드 — 타입 시스템 심화

이 경험 셋을 4개월에 혼자 쌓으신 겁니다. **삭제할 가치가 없습니다.**

---

## 8. 다음 세션 추천 작업 순서

일어나셨을 때 이 문서를 보고, 하고 싶으신 것만 고르세요:

**A. "지금 당장 깔끔하게 만들고 싶다"**
→ Task 1 (host App.tsx 정리)만. 30분 투자, 즉시 체감되는 개선.

**B. "제대로 KOMCA 수준으로 맞추고 싶다"**
→ Task 1 + Task 3 + Task 4. 하루 투자, KOMCA급 클린함 달성.

**C. "더 이상 건드리기 싫다"**
→ 현재 상태로 GitHub push + README 정리 + 동결. 이력서에 "구축 완료" 로 사용.

**D. "정말 다시 만들고 싶다"**
→ 새 브랜치에서 React 18 + 2 remote로 재설계. 기존 main은 archive.

**어느 쪽이든 유효한 선택**이고, 삭제는 어느 쪽에도 포함되지 않습니다.

---

## Appendix: 구체 코드 비교 (참고용)

### bootstrap.tsx 비교

**KOMCA admin (standalone remote):**
```tsx
ReactDOM.createRoot(rootNode!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ToastProvider>
                <BrowserRouter history={history}>
                    <Root />
                    {!isPrd && <KomcaDevTools buildInfo={buildInfo} />}
                </BrowserRouter>
            </ToastProvider>
        </Provider>
    </React.StrictMode>
)
```

**MFA blog (standalone remote):**
```tsx
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <ToastProvider>
                <ModalProvider>
                    <BrowserRouter>
                        <Root />
                    </BrowserRouter>
                </ModalProvider>
            </ToastProvider>
        </Provider>
    </React.StrictMode>
)
```

**거의 동일.** KOMCA는 `KomcaDevTools` 추가, MFA는 `ModalProvider` 추가. 패턴 레벨 일치.

### init.tsx 비교

**KOMCA admin:**
```tsx
import { storage } from "@komca-dev-org/komca-frontend-common-lib"
storage.removeHostApp()
// 끝. 단 2줄.
```

**MFA blog:**
```tsx
import { storage } from '@sonhoseong/mfa-lib'
storage.removeHostApp()
// 동일 패턴
```

**완전 일치.** "standalone으로 실행될 때 host flag를 명시적으로 제거한다" 라는 패턴까지 이식 성공.

---

*작성자: Claude (Sonnet 4.6 / Opus 4.7 혼용 세션)*
*분석 시간: 약 30분*
