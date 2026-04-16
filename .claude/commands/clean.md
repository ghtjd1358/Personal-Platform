# Clean - 빌드 캐시 정리

빌드 산출물과 캐시를 정리합니다.

## 정리 대상

$ARGUMENTS에 따라:
- (없음) → dist 폴더만 정리
- `all` → dist + node_modules 전체 정리
- `cache` → webpack 캐시만 정리

## 정리 명령어
```bash
# dist만
rm -rf packages/lib/dist apps/*/dist

# 전체 (재설치 필요)
rm -rf node_modules packages/*/node_modules apps/*/node_modules
rm -rf package-lock.json

# 캐시
rm -rf apps/*/.cache apps/*/node_modules/.cache
```

## 정리 후
- `all` 선택 시: `npm install` 실행 필요
- 이후 `npm run build:all`로 재빌드
