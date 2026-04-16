# Ship - Commit & Push

변경사항을 커밋하고 푸시합니다.

## 수행 단계

1. **변경사항 분석**
   - `git status`로 변경된 파일 확인
   - `git diff`로 변경 내용 파악
   - 최근 커밋 스타일 참고

2. **Conventional Commits 형식으로 커밋**
   - `feat:` 새 기능
   - `fix:` 버그 수정
   - `docs:` 문서 변경
   - `style:` 코드 포맷팅
   - `refactor:` 리팩토링
   - `perf:` 성능 개선
   - `test:` 테스트 추가/수정
   - `chore:` 빌드, 설정 변경

3. **Push**
   - 현재 브랜치에 push
   - upstream 설정 필요시 `-u` 플래그 사용

## 중요
- 커밋 메시지에 Claude, AI, Co-Authored-By 등 AI 관련 표시 절대 포함 금지
- 커밋 전 변경사항이 없으면 중단
- 커밋 메시지는 한글 또는 영어로 자연스럽게

---

$ARGUMENTS 가 있으면 해당 내용을 커밋 메시지에 반영해주세요.
