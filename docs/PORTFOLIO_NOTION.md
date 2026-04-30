# 📖 손호성 · 프론트엔드 포트폴리오 (통합)

## 📬 한눈에 보기

| 항목 | 내용 |
|---|---|
| GitHub | https://github.com/ghtjd1358 |
| Velog | https://velog.io/@ghtjd1358/series |
| 이메일 | hoseong1358@gmail.com |
| 스택 | React 19 · TypeScript · Webpack 5 Module Federation · Supabase · Redux Toolkit · Vercel |

> 💡 **이 사이트가 뭐냐 한 줄로**
> 이력서 · 블로그 · 포트폴리오 · 취업관리, 서로 다른 4개의 작은 앱을 하나의 큰 앱처럼 합쳐 놓은 개인 플랫폼입니다. 각 앱은 따로 만들고 따로 배포되면서도, 사용자 입장에서는 한 사이트로 자연스럽게 작동합니다.

---

## 📊 프로젝트 지표

| 항목 | 값 |
|---|---|
| 앱 구성 | Host 1 + Remote 4 (이력서 · 블로그 · 포트폴리오 · 취업관리) |
| 공용 라이브러리 | `@sonhoseong/mfa-lib` v1.3.10 (자체 npm 패키지) |
| API 훅 개수 | 109+ (KOMCA 패턴 일괄 래핑) |
| Supabase 테이블 | 30+ |
| 배포 | Vercel 5 프로젝트 (독립 배포) |
| Lighthouse Performance | 측정 예정 |

---

# 01. 왜 이렇게 만들었나 (Problem)

개인 사이트 하나에 이력서 · 블로그 · 포트폴리오 · 취업관리 탭을 전부 넣고 싶었습니다.

**두 가지 단순한 선택지, 둘 다 안 좋음**

1. 전부 하나의 앱으로 만든다 → 블로그 글 하나 고쳐도 전체 앱을 다시 빌드·배포해야 함. 느리고 위험해짐.
2. 따로따로 앱을 4개 만든다 → 로그인·디자인·공용 유틸이 앱마다 중복. 수정 지점이 4배.

**그래서 Module Federation 기반 MFA** — 각 앱은 독립적으로 개발·배포되지만, 런타임에는 공용 라이브러리를 싱글톤으로 공유하면서 하나의 큰 사이트처럼 작동합니다.

> 🔑 **용어 쉽게 풀기**
> - **Host** : 모든 하위 앱을 담아주는 큰 상자
> - **Remote** : 독립적으로 배포 가능한 작은 앱 (블로그, 이력서 등)
> - **Module Federation** : Webpack 기능. 여러 앱이 런타임에 서로의 코드를 공유할 수 있게 해줌
> - **싱글톤** : React·Redux 같은 라이브러리가 메모리에 딱 1개만 존재하도록 보장

---

# 02. 전체 구조 (Architecture)

```
                         ┌──────────────────────────┐
                         │     Host (Container)     │
                         │      localhost:5000      │
                         │  - 라우팅 (전체 Routes)    │
                         │  - Redux Store 생성/노출   │
                         │  - GNB · 탭 · 전역 레이아웃│
                         └────────────┬─────────────┘
                                      │
            ┌───────────┬─────────────┼─────────────┬───────────┐
            ▼           ▼             ▼             ▼           ▼
        Remote1     Remote2       Remote3       Remote4
        Resume      Blog          Portfolio     TechBlog
        :5001       :5002         :5003         :5004

                              ▲ 공유 ▲
                  @sonhoseong/mfa-lib (npm)
                   - store / hooks
                   - editorial UI
                   - Skeleton / Loading
                   - Axios factory / auth
```

| 조각 | 역할 |
|---|---|
| Host | 라우팅, 공통 레이아웃, Redux Store 생성 후 `window.__REDUX_STORE__` 로 노출 |
| Remote | 자기 도메인 UI/로직. Host 안·단독 모두 실행 가능 |
| lib | 모든 앱이 공유하는 훅·컴포넌트·유틸. npm 패키지로 배포 |

> 📌 **이 문서가 집중해서 다루는 3곳** : Remote2(Blog) + Host + lib. 나머지 remote 는 동일한 패턴을 반복 적용한 것이라 생략.

---

# 03. 핵심 구현 기술 8가지

각 기술은 **문제 → 해결 → 결과** 3단 구조로 정리.

## 🌀 3.1 GlobalLoading — react-promise-tracker 이식

**문제** — Redux 에 `isLoading: boolean` 하나로 시작했더니 3가지 문제:
1. 중첩 호출 시 조기 해제 — 여러 API 가 동시에 진행 중일 때, 먼저 끝난 것이 false 로 꺼버려서 나머지 로딩이 안 보임
2. 서버 hang 시 영원히 로딩 — 타임아웃이 없어서 네트워크 hang 시 사용자는 계속 기다림
3. 연속 호출 시 깜빡임 — 짧은 간격으로 API 가 연달아 오면 스피너가 깜빡거림

**해결** — 실무(KOMCA) 에서 쓰이는 `react-promise-tracker` 를 싱글톤 shared 로 등록, 훅 시그니처는 유지한 채 내부만 교체.

- `trackPromise` : 동시 진행 promise 를 counter 로 관리. 마지막이 끝나야 해제.
- `withTimeout(10s)` : 10초 초과 시 자동 reject + 사용자 안내 토스트.
- 500ms hide debounce : 스피너 꺼지기 전 0.5초 대기 → 연속 호출 깜빡임 제거.
- `silent: true` 옵션 : 카드 리스트처럼 skeleton 이 있는 곳은 스피너 skip.

**결과**

| 문제 | 해결 |
|---|---|
| 중첩 호출 조기 해제 | 라이브러리 counter 자동 추적 |
| 서버 hang 무한 로딩 | 10초 race timeout |
| 스피너 깜빡임 | 500ms hide debounce |
| 과잉 overlay | silent 옵션으로 skeleton 경로 분리 |

> 🔧 **MF 주의** — react-promise-tracker 는 observable 을 module 스코프로 가지므로 반드시 싱글톤 shared 로 등록해야 Host 와 Remote 가 같은 인스턴스를 씁니다. 5개 webpack + 5개 app package.json + node_modules 3단 검증이 전부 맞아야 경고 사라짐.

---

## 🪝 3.2 Hook 래퍼 패턴 (KOMCA)

**문제** — 각 페이지가 API 를 직접 호출하면 페이지마다 같은 코드가 반복됩니다: useState(false) 로딩 state, try/catch 로 에러 잡고 toast 호출, updater 상태로 재요청 트리거.

**해결** — lib 의 `useShowGlobalLoading` + `useToast` 를 훅 안에 품는다.

네이밍 규약:
- `useFetchXxx(params, updater?)` — 조회용, `{data}` 리턴
- `useSendXxx() / useCreateXxx() / useUpdateXxx() / useDeleteXxx()` — 변경용, `Promise<data | false>` 리턴

```typescript
// blog/network/hooks/useFetchPosts.ts
export function useFetchPosts(params, updater) {
  const [posts, setPosts] = useState([]);
  const showGlobalLoading = useShowGlobalLoading();
  const { error: toastError } = useToast();

  useEffect(() => {
    let cancelled = false;
    showGlobalLoading(
      getPosts(params)
        .then((res) => { if (!cancelled && res.success) setPosts(res.data.data); })
        .catch((err) => { if (!cancelled) toastError(err?.message || '목록 조회 실패'); })
    );
    return () => { cancelled = true; };
  }, [updater]);

  return { posts };
}
```

**적용 규모**

| 도메인 | 훅 수 |
|---|---|
| Blog (remote2) | 27 |
| Resume (remote1) | 38 |
| Portfolio (remote3) | 18 |
| Techblog (remote4) | 26 |
| **합계** | **109+** |

**결과**

- 페이지는 `const { posts } = useFetchPosts(...)` 한 줄
- 로딩/에러/토스트는 훅이 전담 → 페이지 코드 평균 30% 감소
- 훅 내부 로직 변경 시 한 곳만 수정
- silent 옵션으로 skeleton 경로만 전역 overlay 회피

---

## 📦 3.3 API 도메인 분리 (blog network/apis)

**문제** — 초기에는 `supabase.ts` 한 파일에 1000+ 줄. 새 API 추가 시 충돌, 관심사 섞임.

**해결** — 1 파일 1 action 원칙

```
blog/network/apis/
├── post/ (get-posts, get-post-by-slug, create-post, update-post, delete-post + types/)
├── comment/
├── category/
├── tag/
├── like/
├── series/
├── upload/
└── profile/
```

공통 응답 : `ApiResponse<T> = { success, data?, error? }`

**결과**

- 새 API 추가 = 파일 1개만 생성
- Git diff 가 action 단위로 깔끔
- 같은 패턴을 4 remote 전체에 적용

---

## 🎨 3.4 editorial 디자인 시스템

**문제** — 각 remote 가 제각각 색·폰트·여백을 쓰면 "하나의 사이트" 로 보이지 않습니다.

**해결** — 왕세자 팔레트 + 한지 질감 overlay + 3단 폰트 스택

```css
:root {
  --ink:    #2B1E14;  /* 먹색 */
  --bone:   #F4EAD5;  /* 한지 미색 */
  --cream:  #FBF5E3;  /* 밝은 한지 */
  --accent: #8C1E1A;  /* 조선 인장 주홍 */
  --mute:   #8B7355;  /* 아교 갈색 */
  --line:   #D4C4A8;  /* warm paper */
}
```

- grain + fiber SVG overlay (한지 질감)
- 폰트 : Fraunces (serif 제목), Pretendard (sans 본문), JetBrains Mono (라벨)

**결과** — 4앱 디자인 dialect 통일, 토큰 기반 문서화, 색 하나만 바꾸면 전체 팔레트 변경 가능.

---

## 🦴 3.5 Skeleton + Spinner 하이브리드

**문제** — 전역 스피너 = 읽기 페이지(목록) 답답, 전역 skeleton 만 = 쓰기 작업 결과 확인 어려움.

**해결** — 분기 원칙 정립

| 종류 | 예시 | 로딩 UI |
|---|---|---|
| 카드 리스트 fetch | 블로그 글 목록, 포트폴리오 그리드 | **Skeleton** |
| Mutation (쓰기) | 저장/삭제/제출 | **Global Spinner** |
| 상세/단건 fetch | 게시글 상세 | **Global Spinner** |

**구현**

1. lib 에 재사용 primitive `Skeleton` 추가 (variant: text/rect/circle, 한지 톤 shimmer 자동 주입)
2. 4 remote 에 카드 셰이프 skeleton 생성 (PostCardSkeleton, PortfolioCardSkeleton, FeatureCardSkeleton, ProjectCardSkeleton, ApplicationCardSkeleton)
3. `useShowGlobalLoading` 에 `silent: true` 옵션으로 skeleton 경로가 전역 spinner 를 skip

> 원칙 : 스피너 → 스켈레톤 → UI 3단 깜빡임은 금지. 한 fetch 당 로딩 언어는 하나.

**결과**

- 읽기 페이지는 데이터 도착 전부터 "셸" 이 보여 답답함 감소
- 쓰기 작업은 명확한 완료 시그널 (overlay)
- lib primitive 한 번 만들어 4 remote 재활용

---

## 🔐 3.6 권한 spec v1.0 (lib + host)

**문제** — 공개 사이트지만 admin (본인) 에게는 "편집 버튼" 노출 필요. 일반 사용자에게는 읽기만.

**해결** — RBAC + 선언적 권한 훅

```typescript
// lib/src/hooks/use-permission.ts
export function usePermission() {
  const user = useSelector(selectUser);
  const isAdmin = user?.role === 'admin';
  const canEditResource = (ownerId) => isAdmin || user?.id === ownerId;
  return { isAdmin, canEditResource };
}
```

**3계층 gating**

1. **Section-level** — `<SectionEditButton editPath="/admin/skills"/>` 는 admin 에게만 노출
2. **Row-level** — 각 목록 row 의 ✎ / × 는 본인 소유만, 타인 소유는 🔒
3. **Server-level** — Supabase RLS 정책으로 write path 원천 차단 (UI 가 뚫려도 DB 거부)

**결과** — UI 권한 gating 을 컴포넌트 1줄로 해결. 백엔드 RLS 와 이중 방어.

---

## 💨 3.7 Hero FOUC 제거 (blog 적용)

**문제** — 블로그 첫 진입 시 Hero 섹션의 SVG 장식(grain/fiber/아이콘) 이 거대한 블록(300×150)으로 잠깐 떴다가 작게 snap, layout shift 발생.

**원인 3단**

1. `editorial.css` 가 컴포넌트 레벨에서 import → **lazy 청크**에 묶임 → 첫 paint 시 CSS 미도착
2. SVG 에 width/height **속성 없음** → 브라우저 기본값(300×150) 으로 렌더
3. `.editorial-extras { opacity: 0; animation: ... }` 초기값 → CSS 없으면 기본 opacity 1 → CSS 도착 순간 깜빡임

**해결**

- SVG 태그에 `width`/`height` **속성 직접 부여** (CSS 도착 전에도 크기 확정)
- overlay SVG 는 `width="100%" height="100%" preserveAspectRatio="none"`
- Hero summary 텍스트는 **하드코딩** (API 제거 → 쿼리 5→4)

**결과** — 첫 paint 부터 SVG 정확, Hero 는 오프라인·느린 네트워크에서도 즉시 렌더.

---

## 🧩 3.8 CommonButton 단일 구현

**문제** — 각 remote 가 자체 `<Button>` 만들면 host CSS leak 위험.

**해결** — lib 에 `CommonButton` + variant prop (primary/ghost/danger), BEM modifier 로 스코프 분리.

**결과** — host/remote CSS leak 0건, 디자인 일관성 유지.

---

# 04. 공통 모듈 (lib) 심층

| 모듈 | 역할 |
|---|---|
| store/app-store | Redux Store 싱글톤 생성 + injectReducer 동적 주입 |
| store/store-access | getHostStore · dispatchToHost · getCurrentUser |
| store/recent-menu-slice | 탭 시스템 (Redux + localStorage) |
| components/ModalContainer | 스택 기반 모달 |
| components/Toast | Toast 알림 |
| components/Skeleton | 재사용 loading placeholder |
| components/GlobalLoading | react-promise-tracker 구독 + 500ms debounce |
| hooks/use-permission | RBAC |
| hooks/use-track-history | 페이지 이동 자동 탭 추가 |
| network/axios-factory | Axios Interceptor — 401 자동 갱신 |

---

# 05. 성과 지표

## 5.1 구조적 성과

| 항목 | Before | After |
|---|---|---|
| 앱 배포 단위 | 1 (모놀리식) | **5** (host + 4 remote) |
| 공통 코드 | 앱별 복붙 | **lib 1곳** |
| API 훅 | inline | **109+ 훅 통일** |
| 중첩 호출 안전 | boolean (조기 해제 버그) | **counter** |
| hang 방어 | 없음 | **10초 타임아웃** |
| 스피너 깜빡임 | 있음 | **500ms debounce** |
| 리스트 UX | empty grid | **Skeleton 셸** |
| CSS 시스템 | 중구난방 | **토큰 4앱 통일** |
| Hero FOUC | 있음 | **0** |

## 5.2 Lighthouse

> 🧪 Chrome DevTools → Lighthouse → Desktop/Mobile 측정 후 도출

| 항목 | 값 |
|---|---|
| Performance | 측정 예정 |
| Accessibility | 측정 예정 |
| Best Practices | 측정 예정 |
| SEO | 측정 예정 |

---

# 06. 트러블슈팅 Top 3

## 🧨 6.1 "Invalid hook call"

Host 와 Remote 가 React 를 각자 로드 → `singleton: true` 설정 누락. 5개 webpack 에 모두 적용해야 함.

## 🧨 6.2 MFA 싱글톤 shared 3단 검증 누락

`WARNING in shared module react-promise-tracker` — webpack.common.js `shared` + app `package.json` + `node_modules` 3단 모두 충족 필요.

## 🧨 6.3 Hero FOUC — CSS chunk 타이밍

섹션 3.7 참조.

---

# 07. 배포 (Vercel)

- Vercel 프로젝트 5개, 순서 중요 : Remote 먼저 → Host 환경변수 세팅 → Host
- CORS : remoteEntry.js 에 `Access-Control-Allow-Origin: *`
- SPA 라우팅 : vercel.json rewrites

---

# 08. 면접 대비 Q&A

**Q. 왜 Micro Frontend?** — 모놀리식을 극복하고 독립 배포 + 공용 코드 싱글톤 공유.

**Q. singleton: true 이유?** — 없으면 React·Redux 이중 로드 → useSelector 가 다른 Store 참조.

**Q. GlobalLoading 왜 react-promise-tracker?** — boolean 1개는 중첩 호출 조기 해제. counter + withTimeout + debounce.

**Q. Skeleton vs Spinner 선택?** — 카드 리스트 = Skeleton, mutation·상세 = Spinner.

**Q. Remote 단독 실행?** — bootstrap 에서 `window.__REDUX_STORE__` 유무로 판별, 없으면 fallback store.

**Q. 훅 1회용도 래핑?** — 선언적 코드 + 역할 분리 + 일관성. 대부분 결국 2곳+ 재사용.

**Q. Hero 하드코딩 이유?** — API FOUC + 정적 자기소개 + resume_profile 쿼리 제거 (5→4).

---

# 09. 구직 로그 (기업노트 DB)

지원 기업·공고·카테고리 추적 데이터베이스를 같은 페이지에 inline embed.

---

## 📝 업데이트 로그

| 날짜 | 내용 |
|---|---|
| 2026-04-25 | 단일 통합 페이지 재작성 (remote2 + host + lib 중심), 구 문서 19개 + 중복 DB 1개 정리 |
| 2026-02-25 | Host v2 / Remote1 v2 문서 |
| 2026-01-11 | 레이아웃 Phase, 트러블슈팅, 배포, 면접 |
| 2024-12-24 | 프로젝트 초기 설계 |
