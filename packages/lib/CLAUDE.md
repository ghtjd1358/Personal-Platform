# @sonhoseong/mfa-lib

모노레포 공유 라이브러리. 모든 앱에서 사용하는 공통 코드.

## 빌드
```bash
npm run build:lib  # 루트에서
npm run build      # 패키지 내에서
```

## 빌드 순서
**lib가 가장 먼저 빌드되어야 함** → 그 다음 앱들

## 포함 내용
- 공통 컴포넌트
- 공유 훅 (hooks)
- 유틸리티 함수
- Supabase 클라이언트
- Redux 관련 코드

## 주요 의존성
- Redux Toolkit
- Supabase Client
- Axios
- UUID

## Peer Dependencies
앱에서 제공해야 하는 의존성:
- React 19
- React DOM 19
- React Redux 9
- React Router DOM 7

## 출력
- `dist/index.js` (CommonJS)
- `dist/index.d.ts` (타입 정의)
