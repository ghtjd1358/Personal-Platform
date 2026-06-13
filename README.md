# 개인 플랫폼 — MFA 포트폴리오

> 이력서, 블로그, 포트폴리오를 **하나의 컨테이너**에서 운영하는 Micro Frontend 기반 개인 플랫폼

라우팅부터 인증, 공유 스토어까지 직접 설계하면서 MFA의 본질적인 문제들을 겪어봤습니다.  
"그냥 하나의 앱 아니야?"가 아니라, 각 Remote가 **독립 실행**되면서도 Host에 통합될 때 아무 문제 없어야 한다는 제약이 생각보다 까다로웠습니다.

---

## 화면

### 대시보드

![대시보드](docs/dashboard.png)

Host가 올라오면 보이는 메인 화면. LNB는 각 Remote 앱이 자신의 메뉴 항목을 `expose`로 내보내고, Host가 런타임에 동적으로 조합합니다.

### 기술스택 관리 (Remote 에디터)

![기술스택 관리](docs/remote_editor.png)

Resume 앱 안의 어드민 기능. 카테고리를 직접 만들고 기술을 쌓는 방식으로 이력서 기술스택을 관리합니다.

### 포트폴리오 상세 모달

![포트폴리오 모달](docs/remote1_modal.png)

Portfolio 앱의 프로젝트 상세 모달. 기간, 스택, 링크, 기여 내용을 한번에 볼 수 있습니다.

---

## 왜 MFA로 만들었나

처음엔 단순히 "기술 공부용"이었는데, 실제로 만들다 보니 개인 포트폴리오 사이트로 딱 맞는 구조였습니다.

- **이력서 앱**은 관리자만 편집, 방문자는 읽기만
- **블로그 앱**은 글쓰기 에디터와 뷰어가 분리
- **포트폴리오 앱**은 프로젝트 카드 + 상세 모달

기능 단위로 팀을 나누거나 배포 주기가 다르다면 MFA가 맞는 선택입니다. 그걸 개인 프로젝트 규모에서 한번 해봤습니다.

다만 솔직히 말하면, 초기 설정 비용이 꽤 높습니다. 공유 라이브러리 빌드 순서, 타입 공유, singleton 설정까지 하나라도 빠지면 빈 화면입니다. "그냥 Next.js 하나로 만들 걸"이라는 생각을 여러 번 했습니다.

---

## 아키텍처

```
┌────────────────────────────────────────────────────────┐
│                  Host (port 5000)                      │
│                                                        │
│  React Router  ·  Redux Store  ·  Auth  ·  LNB        │
│                                                        │
│   ┌──────────┐   ┌──────────┐   ┌──────────────────┐  │
│   │  resume  │   │   blog   │   │    portfolio     │  │
│   │  :5001   │   │  :5002   │   │      :5003       │  │
│   └──────────┘   └──────────┘   └──────────────────┘  │
│                                                        │
│   (런타임에 remoteEntry.js 로드 — 빌드 시 의존 없음)   │
└────────────────────────────────────────────────────────┘
                         │
              @sonhoseong/mfa-lib
         (공유 컴포넌트 · 훅 · 스토어 · 유틸)
```

각 Remote는 Host 없이도 `localhost:500x`에서 단독 실행됩니다. Host가 올라오면 `remoteEntry.js`를 런타임에 fetch해서 통합합니다.

### 핵심 설계 결정들

### Redux Store 공유

Host가 `window.__REDUX_STORE__`에 스토어를 노출하고 Remote들이 참조합니다. Module Federation의 `singleton` 설정으로 `react-redux`를 단일 인스턴스로 묶지 않으면, Remote마다 별도 React 컨텍스트가 생겨서 `useSelector`가 아무것도 읽지 못합니다. 실제로 이 설정 빠진 상태에서 인증 상태가 통째로 날아가는 걸 겪어봤습니다.

### 라우팅 PREFIX 동적 계산

```
Host 통합 시:   /blog/post/123  →  Remote는 /post/123 으로 받음  (PREFIX = '')
단독 실행 시:   /blog/post/123  →  Remote는 /blog/post/123     (PREFIX = '/blog')
```

`sessionStorage.isHostApp` 플래그로 실행 컨텍스트를 판별합니다.

### LNB 동적 조합

```typescript
// Remote가 직접 메뉴 항목을 내보냄
export const lnbItems = {
    hasPrefixList: [{ id: 'blog-home', path: '/blog', ... }],
    hasPrefixAuthList: [...],
};

// Host가 런타임에 수집
const { lnbItems: blogItems } = await import('@blog/LnbItems');
```

Remote를 새로 붙여도 Host 건드릴 일이 없습니다.

---

## 폴더 구조

```
mfa-monorepo/
├── apps/
│   ├── host/               # 컨테이너 앱 (port 5000)
│   ├── resume/             # 이력서 앱 (port 5001)
│   ├── blog/               # 블로그 앱 (port 5002)
│   ├── portfolio/          # 포트폴리오 앱 (port 5003)
│   ├── techblog/           # 기술블로그 앱 (port 5004)
│   └── api/                # Express API 서버 (port 4000)
│
└── packages/
    └── lib/                # @sonhoseong/mfa-lib
        └── src/
            ├── components/ # DeferredComponent, ErrorBoundary 등
            ├── hooks/      # useAuth, useLocalInitialize 등
            ├── store/      # authSlice, Redux 설정
            └── network/    # apiClient, 공유 axios 인스턴스
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 19, TypeScript 5 |
| 상태관리 | Redux Toolkit, React Redux |
| 빌드 | Webpack 5 Module Federation |
| 백엔드 API | Express.js (Node.js, MVC 패턴) |
| 인증 | Google OAuth 2.0 + JWT (AccessToken + HttpOnly RefreshToken) |
| 데이터베이스 | Supabase (PostgreSQL 17 + RLS + Storage) |
| 배포 | Vercel (앱별 독립 프로젝트) |
| 공유 라이브러리 | `@sonhoseong/mfa-lib` (자체 패키지) |

---

## 백엔드 API 아키텍처 (Express MVC)

```
apps/api/src/
├── modules/
│   ├── auth/       ├── blog/       ├── portfolio/
│   ├── user/       └── upload/
├── middleware/     authenticate.ts
├── common/         response.ts
├── lib/            supabase.ts · token.ts
└── config/         env.ts
```

도메인별로 `router / controller / service` 3파일이 한 폴더에 모입니다. Service는 Supabase 쿼리만, Controller는 req/res 파싱과 응답 전송만 담당합니다.

**인증 흐름 — OAuth 콜백에서 토큰을 URL로 안 넘기는 이유**

Google 로그인 콜백 후 프론트에 AccessToken을 전달할 때, URL 파라미터(`?token=xxx`)로 넘기면 브라우저 히스토리와 Referer 헤더에 토큰이 남습니다. 대신 **1분짜리 단기 쿠키**(`access_token_once`)에 담아서 리다이렉트하고, 프론트가 읽는 즉시 쿠키를 삭제합니다. RefreshToken은 7일짜리 HttpOnly 쿠키로 별도 관리합니다.

---

## 데이터베이스 스키마 (ERD)

> Supabase PostgreSQL 17 · 모든 테이블 RLS 활성화

### 전체 도메인 구조

```mermaid
erDiagram
    profiles ||--o{ blog_posts : owns
    profiles ||--o{ portfolios : owns
    profiles ||--o{ resume_profile : owns
    profiles ||--o{ experiences : owns
    profiles ||--o{ skills : owns

    blog_posts ||--o{ blog_comments : has
    blog_posts ||--o{ blog_likes : has
    blog_posts ||--o{ blog_post_tags : has
    blog_posts }o--o{ blog_series : "belongs to"

    portfolios ||--o{ portfolio_tasks : has
    portfolios ||--o{ portfolio_tags : has
    portfolios ||--o{ portfolio_tech_stack : has
    portfolios ||--o{ portfolio_comments : has

    resume_profile ||--o{ experiences : contains
    experiences ||--o{ experience_tasks : has
    experiences ||--o{ experience_tags : has

    skills ||--o{ experience_tags : referenced
    skills ||--o{ portfolio_tags : referenced

    job_applications ||--o{ job_notes : has
    job_applications ||--o{ calendar_events : schedules
```

---

### Auth / 사용자 도메인

```mermaid
erDiagram
    profiles {
        uuid id PK
        text email UK
        text name
        text avatar_url
        user_role role
        timestamptz created_at
    }
    refresh_tokens {
        uuid id PK
        uuid user_id FK
        text token UK
        timestamptz expires_at
        boolean revoked
    }
    login_history {
        uuid id PK
        uuid user_id FK
        boolean success
        timestamptz login_at
    }
    permissions {
        uuid id PK
        user_role role
        text resource
        text action
        boolean allowed
    }

    profiles ||--o{ refresh_tokens : "발급"
    profiles ||--o{ login_history : "기록"
```

---

### Resume 도메인

```mermaid
erDiagram
    resume_profile {
        uuid id PK
        uuid user_id FK
        text resume_name
        text title
        boolean is_primary
        boolean is_public
    }
    experiences {
        uuid id PK
        uuid user_id FK
        uuid resume_id FK
        text company
        text position
        date start_date
        date end_date
        boolean is_dev
    }
    experience_tasks {
        uuid id PK
        uuid experience_id FK
        text task
        int order_index
    }
    experience_tags {
        uuid id PK
        uuid experience_id FK
        uuid skill_id FK
        text tag
    }
    skill_categories {
        uuid id PK
        uuid user_id FK
        text name
        text label
    }
    skills {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        text name
        numeric years_of_experience
        int level
    }
    education {
        uuid id PK
        uuid user_id FK
        text school
        text degree
    }
    certifications {
        uuid id PK
        uuid user_id FK
        text name
        text issuer
    }

    resume_profile ||--o{ experiences : contains
    experiences ||--o{ experience_tasks : "주요 업무"
    experiences ||--o{ experience_tags : "사용 기술"
    skill_categories ||--o{ skills : groups
    skills ||--o{ experience_tags : referenced
```

---

### Blog 도메인

```mermaid
erDiagram
    blog_posts {
        uuid id PK
        uuid user_id FK
        text title
        text slug UK
        text status
        boolean is_pinned
        int view_count
        int like_count
        int comment_count
    }
    blog_tags {
        uuid id PK
        text name UK
        text slug UK
    }
    blog_post_tags {
        uuid id PK
        uuid post_id FK
        uuid tag_id FK
    }
    blog_comments {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        uuid parent_id FK
        text content
        boolean is_deleted
    }
    blog_likes {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
    }
    blog_series {
        uuid id PK
        uuid user_id FK
        text title
        text slug UK
    }
    blog_series_posts {
        uuid id PK
        uuid series_id FK
        uuid post_id FK
        int order_index
    }

    blog_posts ||--o{ blog_post_tags : tagged
    blog_tags ||--o{ blog_post_tags : "태그됨"
    blog_posts ||--o{ blog_comments : has
    blog_comments |o--o{ blog_comments : "대댓글"
    blog_posts ||--o{ blog_likes : "좋아요"
    blog_series ||--o{ blog_series_posts : contains
    blog_posts ||--o{ blog_series_posts : "시리즈 소속"
```

---

### Portfolio 도메인

```mermaid
erDiagram
    portfolios {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        uuid resume_id FK
        text title
        text slug UK
        boolean show_on_resume
        boolean is_featured
        text role
    }
    portfolio_categories {
        uuid id PK
        uuid user_id FK
        text name
        text slug UK
    }
    portfolio_tasks {
        uuid id PK
        uuid portfolio_id FK
        text task
    }
    portfolio_results {
        uuid id PK
        uuid portfolio_id FK
        text result
        text metric_value
    }
    portfolio_tags {
        uuid id PK
        uuid portfolio_id FK
        uuid skill_id FK
        text tag
    }
    portfolio_tech_stack {
        uuid id PK
        uuid portfolio_id FK
        text category
        text name
    }
    portfolio_images {
        uuid id PK
        uuid portfolio_id FK
        text image_url
        boolean is_cover
    }
    portfolio_milestones {
        uuid id PK
        uuid portfolio_id FK
        text title
        date date
    }
    portfolio_comments {
        uuid id PK
        uuid portfolio_id FK
        uuid user_id FK
        uuid parent_id FK
        text content
    }

    portfolio_categories ||--o{ portfolios : groups
    portfolios ||--o{ portfolio_tasks : "주요 업무"
    portfolios ||--o{ portfolio_results : "성과"
    portfolios ||--o{ portfolio_tags : "기술 태그"
    portfolios ||--o{ portfolio_tech_stack : "기술 스택"
    portfolios ||--o{ portfolio_images : "이미지"
    portfolios ||--o{ portfolio_milestones : "마일스톤"
    portfolios ||--o{ portfolio_comments : "댓글"
    portfolio_comments |o--o{ portfolio_comments : "대댓글"
```

---

### Techblog (취업 트래커) 도메인

```mermaid
erDiagram
    jobs {
        uuid id PK
        text company
        text position
        text status
        timestamptz deadline
        text[] skills
    }
    job_applications {
        uuid id PK
        uuid user_id FK
        uuid job_id FK
        text company_name
        text status
        text result
        timestamptz applied_at
        timestamptz interview_at
    }
    job_notes {
        uuid id PK
        uuid application_id FK
        uuid user_id FK
        text content
        text note_type
    }
    job_bookmarks {
        uuid id PK
        uuid user_id FK
        uuid job_id FK
        jsonb job_data
    }
    calendar_events {
        uuid id PK
        uuid user_id FK
        uuid application_id FK
        text title
        timestamptz date
        text type
    }

    jobs ||--o{ job_applications : "지원"
    jobs ||--o{ job_bookmarks : "북마크"
    job_applications ||--o{ job_notes : "메모"
    job_applications ||--o{ calendar_events : "일정"
```

---

## 로컬 실행

```bash
# 루트에서 전체 설치
npm install

# 전체 동시 실행 (권장)
npm run dev

# 앱별 개별 실행
npm run dev:host      # http://localhost:5000
npm run dev:resume    # http://localhost:5001
npm run dev:blog      # http://localhost:5002
npm run dev:portfolio # http://localhost:5003
```

> Remote가 먼저 떠 있어야 Host에서 정상 로드됩니다. `npm run dev`는 concurrently로 동시에 올립니다.

### 환경 변수

루트에 `.env` 생성:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REMOTE1_URL=http://localhost:5001   # 로컬
REMOTE2_URL=http://localhost:5002
REMOTE3_URL=http://localhost:5003
```

---

## 배포 구조 (Vercel)

앱마다 독립 Vercel 프로젝트로 배포합니다.

| 앱 | Root Directory |
|----|---------------|
| host | `apps/host` |
| resume | `apps/resume` |
| blog | `apps/blog` |
| portfolio | `apps/portfolio` |
| api | `apps/api` |

Host가 Remote의 `remoteEntry.js`를 fetch하므로, **Remote 앱의 Deployment Protection을 반드시 비활성화**해야 합니다.

```bash
# 빌드 (lib 먼저 빌드해야 Remote들이 최신 반영)
npm run build:lib
npm run build:all
```

---

## 겪었던 문제들

**캐시 버스팅**  
배포 후 `remoteEntry.js`가 캐싱되어 구버전 Remote가 로드되는 문제. 타임스탬프 쿼리스트링으로 1분 단위 캐시 무효화로 해결했습니다.

**단독/Host 혼용 라우팅**  
동일한 URL이 실행 컨텍스트에 따라 다르게 파싱되어야 하는 문제. PREFIX를 런타임에 계산하는 패턴으로 정리했습니다.

**스켈레톤 깜빡임**  
빠른 로딩(150ms 미만)에서도 스켈레톤이 잠깐 보이는 플리커 현상. `DeferredComponent`로 지연 마운트해서 해결했습니다.

**lib 빌드 순서**  
`@sonhoseong/mfa-lib` 변경 후 빌드 없이 Remote를 실행하면 이전 dist가 참조되어 런타임 에러 발생. `build:all` 스크립트에 lib 빌드를 앞에 강제했습니다.

**Access Token 갱신 요청 중복**  
토큰 만료 시 여러 요청이 동시에 `/auth/refresh`를 호출하는 레이스 컨디션이 있었습니다. axios 인터셉터에서 갱신 중인지 플래그를 두고, 이후 요청은 Promise 큐에 쌓아뒀다가 갱신 완료 후 일괄 재시도하는 방식으로 해결했습니다.

**이미지 업로드 경로**  
서버를 거쳐 Supabase Storage에 올리면 서버 메모리를 통과하는 문제가 있습니다. 클라이언트가 API 서버에서 Presigned URL만 받아, Storage에 직접 PUT하는 방식으로 서버는 URL 발급만 담당합니다.
