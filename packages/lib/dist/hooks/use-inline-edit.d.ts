/**
 * 인라인 편집 상태 hook — `{ editingId, draft, isEditing, start, cancel, setDraft }`.
 *
 * 리스트 안에서 한 항목씩 편집할 때 쓰는 `(editingId + draft)` 페어 보일러 표준화.
 * `start(id, initialDraft)` 로 초기 텍스트 주입 → `setDraft` 로 입력 → caller 가 commit 후 `cancel()`.
 *
 * @example  comment 인라인 수정
 * const edit = useInlineEdit<string, string>('');
 * {comments.map((c) => edit.isEditing(c.id)
 *   ? <textarea value={edit.draft} onChange={(e) => edit.setDraft(e.target.value)} />
 *   : <button onClick={() => edit.start(c.id, c.content)}>수정</button>
 * )}
 *
 * @example  category label 수정
 * const edit = useInlineEdit<string, string>('');
 * const commit = async () => {
 *   if (await updateCategory(edit.editingId!, { label: edit.draft })) edit.cancel();
 * };
 */
export interface UseInlineEditReturn<ID, D> {
    editingId: ID | null;
    draft: D;
    setDraft: (value: D) => void;
    isEditing: (id: ID) => boolean;
    /** id 편집 모드 진입 + draft 초기화 */
    start: (id: ID, initialDraft?: D) => void;
    /** 편집 모드 종료 + draft 초기값으로 리셋 */
    cancel: () => void;
}
export declare function useInlineEdit<ID = string, D = string>(initialDraft: D): UseInlineEditReturn<ID, D>;
//# sourceMappingURL=use-inline-edit.d.ts.map