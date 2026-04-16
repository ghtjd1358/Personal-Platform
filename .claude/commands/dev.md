# Dev - 개발 서버 실행

개발 서버를 실행합니다.

## 앱별 포트
- host: 5000
- resume: 5001
- blog: 5002
- portfolio: 5003
- techblog: 5004

## 실행 명령어

$ARGUMENTS에 따라:
- (없음) → 어떤 앱을 실행할지 물어보기
- `all` → `npm run dev` (전체 동시 실행)
- `host` → `npm run dev:host`
- `resume` → `npm run dev:resume`
- `blog` → `npm run dev:blog`
- `portfolio` → `npm run dev:portfolio`
- `techblog` → `npm run dev:techblog`

## 참고
- 전체 실행 시 터미널에서 색상별로 로그 구분됨
- Host 테스트 시 리모트 앱도 실행 필요
