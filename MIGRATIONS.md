# 📚 MFA Portfolio - Supabase 마이그레이션 가이드

> **Last Updated**: 2026-04-21

---

## 🎯 마이그레이션 정리 완료!

모든 Supabase 마이그레이션 파일을 정리하고 통합 스크립트를 생성했습니다.

---

## 📁 파일 구조

```
mfa-monorepo/
├── supabase/
│   └── migrations/
│       └── 000_master_consolidated.sql    # 🆕 통합 마스터 스크립트
│
├── apps/
│   ├── resume/supabase/migrations/
│   │   ├── 001_create_skills_tables.sql          # ✅ 정리됨 (이전: create_skills_tables.sql)
│   │   ├── 002_create_homepage_config.sql        # ✅ 정리됨 (이전: create_homepage_config.sql)
│   │   └── 003_multi_resume_support.sql          # ✅ 이미 정리됨
│   │
│   ├── blog/supabase/migrations/
│   │   └── 001_create_series_tables.sql          # ✅ 이미 정리됨
│   │
│   ├── portfolio/supabase/migrations/
│   │   └── 001_likes.sql                         # ✅ 정리됨 (이전: 002_likes.sql)
│   │
│   └── techblog/supabase/migrations/
│       └── 001_initial_schema.sql                # ✅ 이미 정리됨
```

---

## 🔥 변경사항 요약

### 파일명 정리
| 이전 | 이후 | 상태 |
|------|------|------|
| `resume/migrations/create_skills_tables.sql` | `resume/migrations/001_create_skills_tables.sql` | ✅ 수정됨 |
| `resume/migrations/create_homepage_config.sql` | `resume/migrations/002_create_homepage_config.sql` | ✅ 수정됨 |
| `portfolio/migrations/002_likes.sql` | `portfolio/migrations/001_likes.sql` | ✅ 수정됨 |
| `blog/migrations/001_create_series_tables.sql` | - | ✅ 이미 정리됨 |
| `techblog/migrations/001_initial_schema.sql` | - | ✅ 이미 정리됨 |
| `resume/migrations/003_multi_resume_support.sql` | - | ✅ 이미 정리됨 |

### 함수 중복 제거
- ✅ `update_updated_at_column()` 함수를 한 번만 정의 (Common Functions 섹션)
- Blog와 TechBlog에서 각각 정의하던 것을 통합

---

## 📦 통합 마스터 스크립트

**파일**: `supabase/migrations/000_master_consolidated.sql`

이 파일은 모든 앱의 마이그레이션을 **순서대로** 통합한 마스터 스크립트입니다.

### 실행 순서
1. **Common Functions** (공통 함수 및 트리거)
2. **Resume App** (이력서 앱)
   - Skills Tables (스킬 관리)
   - Homepage Config (홈페이지 설정)
   - Multi-Resume Support (다중 이력서)
3. **Blog App** (블로그 앱)
   - Series Tables (시리즈 기능)
4. **Portfolio App** (포트폴리오 앱)
   - Likes System (좋아요 기능)
5. **TechBlog App** (취업 추적 앱)
   - Jobs, Applications, Notes, Events, Bookmarks

### 특징
- ✅ **멱등성 보장**: `CREATE IF NOT EXISTS` 사용
- ✅ **중복 제거**: 공통 함수 한 번만 정의
- ✅ **섹션 구분**: 주석으로 명확하게 구분
- ✅ **RLS 완비**: 모든 테이블에 Row Level Security 적용

---

## 🚀 사용 방법

### Option 1: SQL Editor에서 직접 실행 (빠른 방법)

1. Supabase Dashboard → SQL Editor 열기
2. `supabase/migrations/000_master_consolidated.sql` 내용 복사
3. SQL Editor에 붙여넣기
4. **Run** 클릭

**장점**: 빠르고 간단
**단점**: 마이그레이션 히스토리 없음, 롤백 불가

---

### Option 2: Supabase CLI 사용 (권장)

```bash
# 1. Supabase CLI 설치 (없으면)
npm install -g supabase

# 2. Supabase 프로젝트 연결
supabase link --project-ref ujhlgylnauzluttvmcrz

# 3. 마이그레이션 적용
supabase db push

# 또는 특정 마이그레이션만 실행
supabase migration up
```

**장점**:
- ✅ 마이그레이션 히스토리 추적 (`supabase_migrations.schema_migrations`)
- ✅ 롤백 가능
- ✅ 다른 환경 동기화 쉬움
- ✅ Git으로 버전 관리

**단점**: CLI 설치 및 설정 필요

---

### Option 3: 앱별 개별 실행

각 앱의 마이그레이션을 개별적으로 실행하려면:

```bash
# Resume 앱 마이그레이션만
supabase db push --file apps/resume/supabase/migrations/001_create_skills_tables.sql
supabase db push --file apps/resume/supabase/migrations/002_create_homepage_config.sql
supabase db push --file apps/resume/supabase/migrations/003_multi_resume_support.sql

# Blog 앱 마이그레이션만
supabase db push --file apps/blog/supabase/migrations/001_create_series_tables.sql

# Portfolio 앱 마이그레이션만
supabase db push --file apps/portfolio/supabase/migrations/001_likes.sql

# TechBlog 앱 마이그레이션만
supabase db push --file apps/techblog/supabase/migrations/001_initial_schema.sql
```

---

## 🔍 마이그레이션 확인

### 적용된 테이블 확인
```bash
# Supabase CLI
supabase db remote status

# 또는 SQL Editor
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### 마이그레이션 히스토리 확인
```sql
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;
```

**참고**: SQL Editor로 실행한 경우 이 테이블에 기록되지 않습니다.

---

## 📊 현재 데이터베이스 상태

### 총 35개 테이블 (2026-04-21 기준)

| 앱 | 테이블 수 | 주요 테이블 |
|----|----------|-------------|
| **Resume** | 12개 | resume_profile, skills, experiences, education |
| **Blog** | 6개 | blog_posts, blog_series, blog_comments, blog_likes |
| **Portfolio** | 9개 | portfolios, portfolio_likes, portfolio_details |
| **TechBlog** | 5개 | jobs, job_applications, job_notes, calendar_events |
| **Common** | 3개 | profiles, permissions, refresh_tokens |

---

## ⚠️ 주의사항

### 1. 프로덕션 적용 시
```bash
# 반드시 백업 먼저!
supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql

# 그 다음 마이그레이션 적용
supabase db push
```

### 2. RLS (Row Level Security)
- 모든 테이블에 RLS가 활성화되어 있습니다
- 정책을 수정할 때는 기존 사용자에게 영향이 없는지 확인 필수

### 3. 외래 키 제약
- `ON DELETE CASCADE` 사용: 부모 레코드 삭제 시 자식 레코드도 자동 삭제
- 데이터 손실 주의!

### 4. UUID 하드코딩
- Resume 스킬 카테고리에서 UUID 하드코딩 사용 (`11111111-...`)
- 충돌 방지를 위해 `ON CONFLICT DO NOTHING` 사용
- 프로덕션에서는 `gen_random_uuid()` 권장

---

## 🛠️ 트러블슈팅

### 문제 1: "relation already exists" 에러
```sql
-- 해결: CREATE IF NOT EXISTS 사용 (이미 적용됨)
CREATE TABLE IF NOT EXISTS my_table (...);
```

### 문제 2: "function already exists" 에러
```sql
-- 해결: CREATE OR REPLACE 사용 (이미 적용됨)
CREATE OR REPLACE FUNCTION my_function() ...
```

### 문제 3: RLS 정책 충돌
```sql
-- 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "policy_name" ON table_name;
CREATE POLICY "policy_name" ON table_name ...
```

### 문제 4: 마이그레이션 순서 오류
```bash
# 의존성 있는 테이블 순서대로 실행
# 예: blog_series → blog_series_posts (외래 키 때문에)
```

---

## 📚 참고 자료

- [Supabase CLI 문서](https://supabase.com/docs/guides/cli)
- [Supabase 마이그레이션 가이드](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [RLS 정책 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎯 다음 단계

1. ✅ 마이그레이션 파일명 정리 완료
2. ✅ 통합 마스터 스크립트 생성 완료
3. ⏭️ **Git 커밋** 권장
   ```bash
   git add .
   git commit -m "chore: 마이그레이션 파일 정리 및 통합 스크립트 생성"
   ```
4. ⏭️ **Supabase CLI 마이그레이션 히스토리 동기화** (선택)
   ```bash
   supabase db remote commit
   ```

---

*Generated: 2026-04-21 by Claude Code*
