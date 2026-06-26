/**
 * 다중 항목 펼침/접힘 상태 hook (XOR 모델).
 *
 * 사용자가 default 와 반대로 클릭한 항목만 set 에 저장한다.
 * 데이터가 바뀌어도 default 가 자동 적용되며, 같은 id 의 사용자 override 만 유지.
 *
 * 두 가지 사용 모드:
 *  - 단순 모드: `useCollapsibleSet<string>()` — id 문자열만 다룸. default 항상 닫힘.
 *  - 데이터 모드: `useCollapsibleSet<Item>({ getDefaultOpen })` — 객체 항목 + 항목별 default 조건.
 *
 * @example  단순 모드 (AppSidebar 메뉴 토글)
 * const menu = useCollapsibleSet<string>();
 * menu.isOpen(menuId);
 * menu.toggle(menuId);
 *
 * @example  데이터 모드 (개발 경력만 default 펼침)
 * const exp = useCollapsibleSet<Experience>({
 *   getDefaultOpen: (e) => e.is_dev === true,
 * });
 * exp.isOpen(experience);
 * exp.toggle(experience.id);
 *
 * @example  전부 default 펼침 (SkillsSelector 카테고리)
 * const cat = useCollapsibleSet<Category>({ getDefaultOpen: () => true });
 */
export interface UseCollapsibleSetOptions<T> {
    /** 항목 → id 변환. 기본: 문자열이면 그대로, 객체면 `item.id` */
    getId?: (item: T) => string;
    /** 항목별 default 펼침 여부. 기본: 항상 false (모두 닫힘) */
    getDefaultOpen?: (item: T) => boolean;
}
export interface UseCollapsibleSetReturn<T> {
    /** 항목이 현재 펼쳐져 있는지 판정 (default XOR override) */
    isOpen: (item: T) => boolean;
    /** id 기준 토글 — default 와 반대 상태로 전환 */
    toggle: (id: string) => void;
    /** 모든 사용자 override 해제 → 전부 default 상태로 복귀 */
    reset: () => void;
}
export declare function useCollapsibleSet<T = string>(options?: UseCollapsibleSetOptions<T>): UseCollapsibleSetReturn<T>;
//# sourceMappingURL=use-collapsible-set.d.ts.map