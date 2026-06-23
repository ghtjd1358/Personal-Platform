# MFA Portfolio - 기능 분석 및 개선 로드맵

> 분석일: 2026-04-17

---

## 📊 앱별 현황 요약

| App | Files | 완성도 | 주요 이슈 |
|-----|-------|--------|-----------|
| **Blog** (Remote 2) | ~100+ | ⭐⭐⭐⭐ | 검색/필터 강화 필요 |
| **Portfolio** (Remote 3) | ~46 | ⭐⭐ | 라우트/기능 매우 부족 |
| **TechBlog** (Remote 4) | ~16 | ⭐ | **Mock 데이터만 사용**, Supabase 미연동 |
| **Resume** (Remote 1) | ~72 | ⭐⭐⭐ | Admin 페이지 연동 확인 필요 |

---

## 🔴 Remote 2: Blog (Port 5002)

### 현재 기능 ✅
- 포스트 CRUD (작성/수정/삭제/조회)
- Tiptap 리치 텍스트 에디터
- Shiki/Lowlight 코드 하이라이팅
- 댓글 시스템
- 좋아요 기능
- 시리즈 관리
- 태그/카테고리 시스템
- 프로필 관리
- 이미지 업로드

### 라우트 구조
```
/                    → 블로그 메인
/post/:slug          → 포스트 상세
/write               → 새 글 작성
/edit/:slug          → 글 수정
/series/:slug        → 시리즈 상세
/manage              → 관리 페이지
/my                  → 마이페이지
/user/:userId        → 사용자 프로필
```

### 부족한 기능 🔧
1. **검색 기능 강화**
   - 제목/내용 통합 검색
   - 태그/카테고리 필터링
   - 날짜 범위 필터

2. **UX 개선**
   - 무한 스크롤 또는 페이지네이션
   - 스켈레톤 로딩
   - 이미지 lazy loading

3. **SEO**
   - 메타 태그 동적 생성
   - Open Graph 태그
   - sitemap.xml

4. **추가 기능**
   - 북마크/저장 기능
   - 조회수 카운트
   - 관련 포스트 추천
   - RSS 피드

---

## 🔴 Remote 3: Portfolio (Port 5003)

### 현재 기능 ✅
- 프로젝트 목록/상세
- Tiptap 에디터
- 댓글 시스템
- 이미지 업로드

### 라우트 구조
```
/                    → 포트폴리오 홈
/portfolio           → 포트폴리오 (중복?)
```

### 부족한 기능 🔧 (심각)
1. **라우트 확장 필요**
   ```
   /project/:id        → 프로젝트 상세 (필요)
   /category/:slug     → 카테고리별 필터 (필요)
   /mypage             → 마이페이지 (있음?)
   ```

2. **프로젝트 관리**
   - 프로젝트 CRUD UI 개선
   - 기술 스택 태그 시스템
   - 기간/역할 정보 추가

3. **갤러리 기능**
   - 이미지 갤러리 뷰
   - 라이트박스
   - 다중 이미지 업로드

4. **인터랙션**
   - 프로젝트 좋아요
   - 조회수
   - 공유 기능

---

## 🔴 Remote 4: TechBlog / Job Tracker (Port 5004)

### ⚠️ 심각: Mock 데이터만 사용

현재 `mockJobs.ts`에서 정적 데이터만 사용 중. **Supabase 연동 필요**.

### 현재 기능 ✅
- Job 목록 표시 (Mock)
- 지원 현황 추적 (Mock)
- 캘린더 뷰 (Mock)
- 노트/메모 기능 (Mock)

### 라우트 구조
```
/jobtracker          → 홈
/jobtracker/search   → 채용공고 검색
/jobtracker/tracker  → 지원 현황
/jobtracker/calendar → 캘린더
```

### 필수 구현 🔧
1. **Supabase 연동**
   ```typescript
   // 테이블 생성 필요
   - jobs (채용공고)
   - job_applications (지원 현황)
   - job_notes (메모)
   - calendar_events (일정)
   ```

2. **CRUD API 구현**
   - 지원 현황 등록/수정/삭제
   - 노트 작성/수정/삭제
   - 일정 관리

3. **실제 채용공고 연동**
   - 채용 사이트 크롤링 또는
   - 수동 등록 UI

4. **통계/분석**
   - 지원 현황 대시보드
   - 합격률 통계
   - 월별 지원 현황

5. **알림 기능**
   - 마감일 알림
   - 면접 일정 알림

---

## 🔴 Remote 1: Resume (Port 5001)

### 현재 기능 ✅
- 이력서 홈페이지 (Hero, Skills, Projects, Experience, Contact)
- 이력서 둘러보기
- 이력서 상세
- 마이페이지
- 관리자 페이지 (Skills, Experience, Projects CRUD)

### 라우트 구조
```
/                    → 이력서 홈
/resumes             → 이력서 둘러보기
/resumes/:id         → 이력서 상세
/user/:userId        → 사용자 이력서
/mypage              → 마이페이지
/mypage/write        → 이력서 작성
/mypage/edit         → 이력서 수정
/admin/skills        → 스킬 관리
/admin/experience    → 경력 관리
/admin/projects      → 프로젝트 관리
```

### 부족한 기능 🔧
1. **이력서 에디터 강화**
   - 드래그 앤 드롭 섹션 정렬
   - 템플릿 선택
   - PDF 내보내기

2. **Admin 페이지 완성**
   - 현재 UI만 있고 API 연동 미확인
   - CRUD 동작 테스트 필요

3. **프로필 시스템**
   - 프로필 이미지 업로드
   - 소셜 링크 관리
   - 포트폴리오 연동

4. **검색 기능**
   - 이력서 검색
   - 스킬별 필터
   - 경력 연차 필터

---

## 📋 우선순위 로드맵

### Phase 1: TechBlog Supabase 연동 (최우선)
```
1. Supabase 테이블 설계 및 생성
2. API 함수 구현 (CRUD)
3. Mock 데이터 → 실제 API 교체
4. 지원 현황 관리 완성
```

### Phase 2: Portfolio 기능 확장
```
1. 프로젝트 상세 페이지 라우트 추가
2. 기술 스택 태그 시스템
3. 이미지 갤러리 개선
4. 프로젝트 CRUD UI 개선
```

### Phase 3: Resume Admin 완성
```
1. Admin CRUD API 연동 확인
2. 이력서 PDF 내보내기
3. 템플릿 시스템
```

### Phase 4: Blog 고도화
```
1. 검색/필터 기능 강화
2. SEO 최적화
3. 성능 최적화 (무한 스크롤, lazy loading)
```

---

## 🗄️ Supabase 테이블 설계 (TechBlog용)

```sql
-- 채용공고
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  salary TEXT,
  deadline DATE,
  skills TEXT[],
  description TEXT,
  job_url TEXT,
  company_info JSONB,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 지원 현황
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  job_id UUID REFERENCES jobs(id),
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  job_url TEXT,
  status TEXT CHECK (status IN ('interested', 'applied', 'interview', 'result')),
  result TEXT CHECK (result IN ('pending', 'passed', 'failed')),
  applied_at DATE,
  interview_at TIMESTAMPTZ,
  salary_range TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 지원 메모
CREATE TABLE job_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT,
  note_type TEXT CHECK (note_type IN ('memo', 'interview', 'analysis')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 캘린더 이벤트
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  application_id UUID REFERENCES job_applications(id),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('interview', 'deadline', 'reminder')),
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- 사용자별 데이터 접근
CREATE POLICY "Users can CRUD own applications" ON job_applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own notes" ON job_notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own events" ON calendar_events
  FOR ALL USING (auth.uid() = user_id);
```

---

## 📁 파일 구조 개선 제안

### TechBlog - 추가 필요 파일
```
apps/techblog/src/
├── network/
│   ├── apis/
│   │   ├── jobs/
│   │   │   ├── get-jobs.ts
│   │   │   ├── create-job.ts
│   │   │   └── types.ts
│   │   ├── applications/
│   │   │   ├── get-applications.ts
│   │   │   ├── create-application.ts
│   │   │   ├── update-application.ts
│   │   │   └── types.ts
│   │   ├── notes/
│   │   │   └── ...
│   │   └── events/
│   │       └── ...
│   └── supabase.ts
├── hooks/
│   ├── useJobs.ts
│   ├── useApplications.ts
│   └── useCalendarEvents.ts
└── store/
    └── index.ts
```

---

*Last Updated: 2026-04-17*
