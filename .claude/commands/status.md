# Status - 프로젝트 상태 확인

프로젝트 전체 상태를 빠르게 확인합니다.

## 확인 항목

1. **Git 상태**
   - 현재 브랜치
   - 변경된 파일
   - 커밋되지 않은 변경사항

2. **의존성 상태**
   - node_modules 존재 여부
   - package-lock.json 동기화

3. **빌드 상태**
   - lib 빌드 여부 (dist 폴더)
   - 각 앱 빌드 산출물

4. **포트 상태**
   - 5000-5004 포트 사용 중인지 확인

## 출력 형식
```
📦 Git: main (3 uncommitted changes)
📚 Lib: ✅ Built
🏠 Host: ✅ Built
📄 Resume: ⚠️ Not built
...
🔌 Ports: 5000 (in use), 5001-5004 (free)
```
