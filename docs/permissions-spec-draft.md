# 권한 체계 — Blog · Resume · Portfolio

> **v1.0 확정** (2026-04-22). 면접관이 admin 으로 들어와 구조·데이터 흐름을 투어하고, 일반 방문자는 읽기 전용으로 접근하는 시나리오에 맞춤.

## 확정된 결정

| 질문 | 답 |
|------|----|
| Q1. Admin 이 Owner 리소스 편집 가능? | **(a) 불가**. Admin 은 편집 페이지 진입·조회는 가능하나 Owner 행의 수정/삭제 UI 숨김 + 서버 RLS 차단 |
| Q2. 일반사용자 글쓰기? | **(a) 불가**. 오로지 read only (포스트/포트폴리오/이력서 전부 읽기 전용) |
| Q3. 비로그인 댓글? | **(a) 로그인 필수**. 구글 로그인 통해야 댓글/좋아요 가능 |

### 시나리오 전제
- **Owner** = hoseong1358. 본인 포트폴리오 운영자.
- **Admin** = 면접관 / 초대된 협업자. admin 체험 계정으로 로그인해서 편집 흐름 확인 가능. 본인이 데이터 추가·수정은 할 수 있지만 **Owner 가 작성한 포스트·이력서·포트폴리오 원본은 건드리지 못함**.
- **일반사용자** = 구글 로그인으로 들어온 일반 방문자. 읽기 + 댓글/좋아요만. 관리자 UI 일체 숨김.

## 0. 세 등급 정의

| 등급 | 누구 | 핵심 권한 |
|------|------|----------|
| **최대주주** (Owner) | `hoseong1358@gmail.com` | 모든 도메인 · 모든 리소스 · 읽기/쓰기/수정/삭제 · 권한 승격 |
| **Admin** (관리자) | role = `admin` 로 승격된 사용자 | 자기 리소스만 CRUD · 관리자 페이지 진입 · Owner 리소스는 읽기만 |
| **일반사용자** (Viewer) | 그 외 로그인 · 비로그인 방문자 | 공개 콘텐츠 읽기 · 자기 댓글·좋아요만 관리 · 관리자 UI 전부 숨김 |

세 등급을 `profiles.role` 로 구분:
- `admin` → Owner 또는 Admin (user_id 로 Owner 별도 분기)
- `editor / viewer / guest` → 일반사용자

판별 로직:
```ts
const { user } = usePermission();
const isOwner = user?.email === 'hoseong1358@gmail.com';  // 또는 고정 user_id
const isAdmin = user?.role === 'admin';  // isOwner 포함
const isGeneral = !isAdmin;
```

---

## 1. Blog (블로그)

### 리소스
- `blog_posts` (포스트)
- `blog_series` (시리즈)
- `blog_comments` (댓글)
- `blog_likes` (좋아요)
- `blog_tags` (태그)

### 액션 매트릭스

| 액션 | Owner | Admin | 일반사용자 |
|------|:-----:|:-----:|:---------:|
| 포스트 목록 · 상세 읽기 (public) | ✅ | ✅ | ✅ |
| 포스트 목록 · 상세 읽기 (draft) | ✅ | ✅ (자기 것만) | ❌ |
| `+ 글쓰기` 버튼 노출 | ✅ | ✅ | ❌ |
| 포스트 작성 | ✅ | ✅ | ❌ |
| 포스트 수정 | ✅ (모든 포스트) | ✅ (자기 것만) | ❌ |
| 포스트 삭제 | ✅ (모든 포스트) | ✅ (자기 것만) | ❌ |
| 포스트 ✎/× 버튼 노출 | ✅ (모든 포스트) | ✅ (자기 것만) | ❌ |
| 시리즈 CRUD | ✅ | ✅ (자기 것만) | ❌ |
| 댓글 작성 | ✅ | ✅ | ✅ |
| 댓글 수정 · 삭제 | ✅ (모두) | ✅ (자기 것만) | ✅ (자기 것만) |
| 좋아요 | ✅ | ✅ | ✅ |
| 태그 생성 | ✅ | ✅ | ❌ (제안만 가능 — 미구현) |
| 통계 대시보드 | ✅ | ✅ (자기 것만) | ❌ |

### UI 위치
- 홈 상단 action bar: `+ 글쓰기` — Owner/Admin 노출
- 포스트 카드 ✎/× 아이콘: 작성자 == 현재 유저 일 때만 노출 (Admin = 자기 것만, Owner = 전부)
- `/admin/*` 라우트: Admin+ 만 접근, 그 외 `/blog` 로 redirect

---

## 2. Resume (이력서)

**특수성**: 이력서는 단일-소유 리소스 (Owner 의 이력서). Admin 이 남의 이력서 편집할 이유 없음.
따라서 사실상 **Owner 전용 편집** 도메인 — Admin 은 자기 이력서를 따로 만들 수는 있지만 Owner 의 것에는 개입 불가.

### 리소스
- `resume_profile` (프로필)
- `experiences` (+ `experience_tasks`, `experience_tags`) (경력)
- `portfolios` (+ `portfolio_tasks`, `portfolio_tags`, `resume_id` 로 연결된 것만) (이력서 내 프로젝트)
- `skill_categories`, `skills` (스킬)

### 액션 매트릭스

| 액션 | Owner | Admin | 일반사용자 |
|------|:-----:|:-----:|:---------:|
| 이력서 홈 (`/resume`) 읽기 | ✅ | ✅ | ✅ |
| 타인 이력서 (`/user/:id`) 읽기 | ✅ | ✅ | ✅ |
| `경력 편집` 버튼 노출 | ✅ | ✅ (자기 이력서) | ❌ |
| `스킬 편집` 버튼 노출 | ✅ | ✅ (자기 이력서) | ❌ |
| `프로젝트 편집` 버튼 노출 | ✅ | ✅ (자기 이력서) | ❌ |
| `/admin/experience` 진입 | ✅ | ✅ (자기 것만 표시) | ❌ |
| `/admin/skills` 진입 | ✅ | ✅ (자기 것만 표시) | ❌ |
| `/admin/portfolio` 진입 | ✅ | ✅ (자기 것만 표시) | ❌ |
| 경력/스킬/프로젝트 CRUD | ✅ (본인 user_id 행) | ✅ (본인 user_id 행만) | ❌ |
| 이력서 PDF 다운로드 | ✅ | ✅ | ✅ (공개일 경우) |
| 이력서 공개 설정 변경 | ✅ (본인) | ✅ (본인) | ❌ |

### UI 위치
- `SectionEditButton` (홈의 각 섹션 우상단): `isAdmin` 이고 `isOwner || user.id === resume.user_id` 일 때만 노출
- 경력 페이지 · 프로젝트 페이지 카드의 ✎/× : 동일 조건
- `/admin/*` 라우트: Admin+ 만 접근, 그 외 `/resume` 로 redirect

---

## 3. Portfolio (포트폴리오)

**특수성**: 모든 portfolio row 는 `user_id` 가 작성자. `resume_id` 연결되면 해당 이력서 timeline 에도 표시. Admin 은 자기 portfolio 만 관리.

### 리소스
- `portfolios` (작품)
- `portfolio_tasks`, `portfolio_tags` (작품 상세)
- `portfolio_images`, `portfolio_results`, `portfolio_milestones` 등 (부가 메타)
- `portfolio_categories` (카테고리)

### 액션 매트릭스

| 액션 | Owner | Admin | 일반사용자 |
|------|:-----:|:-----:|:---------:|
| 포트폴리오 grid 읽기 (public) | ✅ | ✅ | ✅ |
| 상세 모달 읽기 (public) | ✅ | ✅ | ✅ |
| `+ 포트폴리오 추가` 버튼 노출 | ✅ | ✅ | ❌ |
| 포트폴리오 생성 | ✅ | ✅ | ❌ |
| 포트폴리오 수정 | ✅ (모든 것) | ✅ (자기 것만) | ❌ |
| 포트폴리오 삭제 | ✅ (모든 것) | ✅ (자기 것만) | ❌ |
| 카드 ✎/× 노출 | ✅ (모든 것) | ✅ (자기 것만) | ❌ |
| 이력서 연결(`resume_id` 설정) | ✅ (본인 이력서로) | ✅ (본인 이력서로) | ❌ |
| `is_public` 토글 | ✅ | ✅ (자기 것만) | ❌ |
| 카테고리 CRUD | ✅ | ❌ (Owner 전용) | ❌ |
| 댓글 · 좋아요 | ✅ | ✅ | ✅ |
| 조회수 카운팅 | auto | auto | auto |

### UI 위치
- 홈 상단 action bar: `+ 포트폴리오 추가` — Owner/Admin 노출 (→ `/container/resume/admin/portfolio/new`)
- 카드 hover ✎/× : 작성자 == 현재 유저 일 때만 (Admin = 자기 것만)
- 카테고리 관리 UI: Owner 전용

---

## 4. 서버 레이어 (RLS) — 뒷단 보호

UI gating 은 "보이지 않게" 할 뿐, 악의적 client 는 DevTools 로 우회 가능. 실제 보호는 Supabase RLS.

### RLS 정책 공통 패턴

```sql
-- 읽기: 공개 리소스는 누구나
create policy "Public readable"
on <table>
for select to public
using (is_public = true);

-- 쓰기: 본인 소유 + admin 이상만
create policy "Owner/Admin manage"
on <table>
for all to public
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);
```

**추가 특권 정책 (Owner 전용)**:
```sql
create policy "Owner can manage any"
on <table>
for all to public
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and email = 'hoseong1358@gmail.com'
  )
)
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and email = 'hoseong1358@gmail.com'
  )
);
```

### 현재 상태 gap

지금 RLS 정책은 대부분 `user_id = auth.uid()` 만 본다 (본인만 수정 가능). Owner 가 남의 리소스도 건드리려면 위 "Owner can manage any" 정책 추가 필요.

---

## 5. UI 훅 제안 (lib)

```ts
// packages/lib/src/hooks/use-permission.ts 에 추가
export function usePermission() {
  const user = useSelector(selectUser);
  const isOwner = user?.email === 'hoseong1358@gmail.com';
  const isAdmin = user?.role === 'admin' || isOwner;
  const isGeneral = !user || (!isAdmin);

  const canEditResource = (resourceUserId: string) => {
    if (!user) return false;
    if (isOwner) return true;
    return isAdmin && user.id === resourceUserId;
  };

  return { user, isOwner, isAdmin, isGeneral, canEditResource, /* 기존 것들 */ };
}
```

사용 예:
```tsx
const { isAdmin, canEditResource } = usePermission();

{isAdmin && <AdminActionBar />}
{canEditResource(post.user_id) && <PostEditDeleteButtons />}
```

---

## 6. Admin "투어" 모드 세부

Admin 이 편집 페이지에 들어왔을 때 보는 UX — "관전석" 경험.

### 리스트 페이지 (예: `/admin/experience`)
- Owner + Admin 자기 것 모두 표시 (읽기)
- 각 행 우측 액션:
  - 본인 것: ✎ 수정 + × 삭제 활성
  - Owner 것: 아이콘 자리에 🔒 잠금 아이콘 + tooltip "Owner 소유 — 열람만 가능"
- 상단 `+ 추가` 버튼: 활성 (Admin 본인 것으로 추가됨)

### 편집 페이지 진입 (예: `/admin/experience/edit/:id`)
- **자기 소유**: 일반 편집 UI 정상
- **Owner 소유**: 읽기 전용 모드
  - 폼 input 들이 모두 `readOnly` / `disabled`
  - 상단 배지: `VIEW ONLY · Owner 소유` (주홍 mono eyebrow)
  - 저장 버튼 대신 `← 목록으로` 만 노출
  - 데이터 구조·실제 값을 확인할 수 있어 **면접관 투어 용**

### 라우트 가드 동작
| 경로 | Owner | Admin | 일반사용자 |
|------|:-----:|:-----:|:---------:|
| `/admin/*` | pass | pass | → `/` redirect |
| `/container/blog/write` | pass | pass | → `/container/blog` redirect + 토스트 "권한 없음" |

---

## 7. 구현 순서

1. **lib 훅 확장**:
   ```ts
   // packages/lib/src/hooks/use-permission.ts
   const OWNER_EMAIL = 'hoseong1358@gmail.com';
   const isOwner = user?.email === OWNER_EMAIL;
   const isAdmin = isOwner || user?.role === 'admin';
   const canEditResource = (resourceUserId: string) =>
     isOwner || (isAdmin && user?.id === resourceUserId);
   ```
   → `npm run build:lib`

2. **Supabase RLS Owner 특권 정책** 각 테이블에 추가 (blog_posts, portfolios, experiences, experience_tasks, experience_tags, portfolio_tasks, portfolio_tags, skill_categories, skills, resume_profile):
   ```sql
   create policy "Owner manages any"
   on <table> for all to public
   using (
     exists (select 1 from public.profiles
             where id = auth.uid() and email = 'hoseong1358@gmail.com')
   )
   with check (
     exists (select 1 from public.profiles
             where id = auth.uid() and email = 'hoseong1358@gmail.com')
   );
   ```

3. **UI gating 적용**:
   - Blog: `BlogList` admin bar (✅ 완료) + 포스트 카드 ✎/× (`canEditResource(post.user_id)`) + mypage series
   - Resume: `SectionEditButton`, `ExperienceListPage`·`SkillsListPage`·`PortfolioListPage` 각 행의 ✎/×
   - Portfolio: `HomePage` admin bar 추가 + 카드 hover ✎/×

4. **라우트 가드**: `/admin/*` 경로에 `<AdminRouteGuard>` 래퍼. non-admin 이면 `<Navigate to="/" />` + 토스트.

5. **Admin "투어" 모드**: 각 editor page 에서 `canEditResource(row.user_id)` false 면:
   - 폼 readOnly 처리
   - "VIEW ONLY" 배지 표시
   - 저장 버튼 숨김

6. **포스트 목록 admin 표시**: Blog post card / Portfolio card 각 행에 owner 뱃지 표시 (Owner 글인지 Admin 글인지 구분).

7. **LNB 동적 업데이트**: admin 권한 있을 때만 "관리" 하위 메뉴 노출.

8. **테스트 계정**: test-admin 계정 생성 + Supabase 에서 `role = admin` 세팅. 브라우저 incognito 창에서 로그인 시 admin 체험 가능.
