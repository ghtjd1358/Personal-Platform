# Build - 프로젝트 빌드

프로젝트를 빌드합니다.

## 빌드 순서 (중요!)
1. `packages/lib` (공유 라이브러리) - 가장 먼저
2. 리모트 앱들 (resume, blog, portfolio, techblog)
3. `apps/host` (컨테이너) - 가장 마지막

## 실행 명령어

$ARGUMENTS에 따라:
- (없음) 또는 `all` → `npm run build:all` (전체 순차 빌드)
- `lib` → `npm run build:lib`
- `host` → `npm run build:host`
- `resume` → `npm run build:resume`
- `blog` → `npm run build:blog`
- `portfolio` → `npm run build:portfolio`
- `techblog` → `npm run build:techblog`

## 빌드 실패 시
1. lib가 먼저 빌드되었는지 확인
2. TypeScript 에러 확인
3. 메모리 부족 시 개별 빌드 시도
