# Fix - 에러 수정

린트, 타입, 빌드 에러를 분석하고 수정합니다.

## 수행 단계

1. **에러 수집**
   - TypeScript 타입 에러 (`tsc --noEmit`)
   - ESLint 에러 (`npm run lint`)
   - 빌드 에러 로그 분석

2. **에러 분석**
   - 에러 메시지 파싱
   - 관련 파일 및 라인 식별
   - 근본 원인 파악

3. **자동 수정**
   - 명확한 수정: 바로 적용
   - 판단 필요한 수정: 옵션 제시

## 대상

$ARGUMENTS에 따라:
- (없음) → 빌드 에러 확인 및 수정
- `types` → TypeScript 에러만
- `lint` → ESLint 에러만
- `[파일경로]` → 특정 파일 에러만

## 자주 발생하는 에러 패턴
- Module Federation 타입 선언 누락
- 공유 라이브러리 import 경로
- React 19 타입 호환성
- Supabase 타입 불일치
