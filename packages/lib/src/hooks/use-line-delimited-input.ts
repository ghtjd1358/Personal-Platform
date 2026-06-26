import { useCallback, useMemo, useState } from 'react';

/**
 * 텍스트 ↔ string[] 양방향 변환 hook.
 *
 * 사용자가 textarea 에 줄바꿈으로 입력 → `lines` 로 trim·empty filter 된 배열.
 * 편집 모드 로딩 시 기존 `string[]` 를 `setFromList` 로 주입하면 `\n` join 된 text 가 textarea 에 표시.
 *
 * 빈 줄·앞뒤 공백은 출력에서 제거 (입력 중 사용자 타이핑은 그대로 유지).
 *
 * @example  Editor 페이지
 * const tasks = useLineDelimitedInput();
 * // edit-load 시
 * useEffect(() => { if (loaded) tasks.setFromList(loaded.tasks.map(t => t.task)); }, [loaded]);
 * // textarea binding
 * <textarea value={tasks.text} onChange={(e) => tasks.setText(e.target.value)} />
 * // submit 시
 * const parsed = tasks.lines; // ['주요 기능 개발', '성능 최적화', ...]
 */
export interface UseLineDelimitedInputReturn {
  /** textarea 에 binding (입력 중간 빈 줄·공백 유지) */
  text: string;
  setText: (s: string) => void;
  /** edit-load 시 string[] 을 textarea text 로 변환 */
  setFromList: (items: string[]) => void;
  /** submit 시 — trim + empty filter 결과 */
  lines: string[];
}

export function useLineDelimitedInput(initial: string[] = []): UseLineDelimitedInputReturn {
  const [text, setText] = useState<string>(initial.join('\n'));

  const setFromList = useCallback((items: string[]) => {
    setText(items.join('\n'));
  }, []);

  const lines = useMemo(
    () => text.split('\n').map((s) => s.trim()).filter(Boolean),
    [text],
  );

  return { text, setText, setFromList, lines };
}
