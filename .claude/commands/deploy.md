# Deploy - Vercel 배포

Vercel에 배포합니다.

## 배포 전 체크리스트
1. 빌드 성공 확인 (`npm run build:all`)
2. 환경변수 설정 확인
3. 변경사항 커밋 완료

## Vercel 프로젝트 구조
각 앱은 별도 Vercel 프로젝트:
- host → Root: `apps/host`
- resume → Root: `apps/resume`
- blog → Root: `apps/blog`
- portfolio → Root: `apps/portfolio`
- techblog → Root: `apps/techblog`

## 배포 명령어

$ARGUMENTS에 따라:
- (없음) → 현재 브랜치 push (Vercel 자동 배포 트리거)
- `prod` → main 브랜치에 merge 후 push (프로덕션 배포)
- `preview` → 현재 브랜치 push (프리뷰 배포)

## 환경변수 (Vercel 대시보드에서 설정)
```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REMOTE1_URL (resume 배포 URL)
REMOTE2_URL (blog 배포 URL)
REMOTE3_URL (portfolio 배포 URL)
```

## 주의
- 리모트 앱 URL 변경 시 host의 환경변수도 업데이트 필요
- 배포 순서: 리모트 앱들 먼저 → host 마지막
