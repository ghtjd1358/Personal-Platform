import { useCallback, useState } from 'react';

/**
 * 동적 리스트 상태 관리 hook — add/remove/update/move/replace 액션 표준화.
 *
 * controlled / uncontrolled 둘 다 지원:
 *  - uncontrolled: `useListState({ defaultItems: [...] })` — hook 내부 state
 *  - controlled:   `useListState({ items, onChange })` — 부모 state 사용
 *
 * 신규 항목 추가 시 stable temp id 자동 부여 (`crypto.randomUUID` + fallback).
 * React key 안정성으로 input value/focus 보존.
 *
 * 도메인 side effect (예: is_current=true → end_date='') 는 hook 이 모름.
 * 호출부가 patch 에 미리 박아 `update(idx, patch)` 로 흡수할 것.
 *
 * @example  controlled — ExperienceEditor 같은 form 컴포넌트
 * const list = useListState<ExperienceFormData>({
 *   items: experiences,
 *   onChange,
 *   emptyItem: () => emptyExperience,
 * });
 * list.add();                              // empty + temp id
 * list.remove(0);
 * list.update(0, { company: 'KOMCA' });
 * list.move(0, 'down');
 *
 * @example  uncontrolled — 내부 list state
 * const list = useListState<Item>({ defaultItems: [] });
 */
export interface UseListStateOptions<T extends { id?: string }> {
  /** 초기 항목 (uncontrolled 모드) */
  defaultItems?: T[];
  /** 외부 state — 제공 시 controlled 모드 */
  items?: T[];
  /** 항목 변경 콜백 — controlled / uncontrolled 둘 다 호출 */
  onChange?: (next: T[]) => void;
  /** 신규 항목 id 생성기. 기본: crypto.randomUUID + Date.now fallback */
  generateId?: () => string;
  /** add() 시 사용할 default 항목 factory */
  emptyItem?: () => Partial<T>;
}

export interface UseListStateReturn<T extends { id?: string }> {
  items: T[];
  /** 신규 항목 추가 — emptyItem + override + 자동 id 부여 */
  add: (override?: Partial<T>) => void;
  /** index 기준 항목 제거 */
  remove: (index: number) => void;
  /** index 기준 patch — 도메인 side effect 는 호출부에서 patch 에 미리 박을 것 */
  update: (index: number, patch: Partial<T>) => void;
  /** index 기준 인접 항목과 swap */
  move: (index: number, dir: 'up' | 'down') => void;
  /** 전체 교체 — 외부 fetch 결과 sync 시 */
  replace: (next: T[]) => void;
}

const defaultGenerateId = (): string =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useListState<T extends { id?: string }>(
  options: UseListStateOptions<T> = {},
): UseListStateReturn<T> {
  const {
    defaultItems = [],
    items: controlledItems,
    onChange,
    generateId = defaultGenerateId,
    emptyItem,
  } = options;

  const isControlled = controlledItems !== undefined;
  const [internalItems, setInternalItems] = useState<T[]>(defaultItems);
  const items = isControlled ? controlledItems : internalItems;

  const commit = useCallback(
    (next: T[]) => {
      if (!isControlled) setInternalItems(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const add = useCallback(
    (override?: Partial<T>) => {
      const base = emptyItem ? emptyItem() : {};
      const newItem = { ...base, ...override, id: generateId() } as T;
      commit([...items, newItem]);
    },
    [items, commit, generateId, emptyItem],
  );

  const remove = useCallback(
    (index: number) => {
      commit(items.filter((_, i) => i !== index));
    },
    [items, commit],
  );

  const update = useCallback(
    (index: number, patch: Partial<T>) => {
      commit(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    },
    [items, commit],
  );

  const move = useCallback(
    (index: number, dir: 'up' | 'down') => {
      const target = dir === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return;
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      commit(next);
    },
    [items, commit],
  );

  const replace = useCallback(
    (next: T[]) => {
      commit(next);
    },
    [commit],
  );

  return { items, add, remove, update, move, replace };
}
