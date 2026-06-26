import { useCallback, useState } from 'react';
export function useInlineEdit(initialDraft) {
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState(initialDraft);
    const isEditing = useCallback((id) => editingId === id, [editingId]);
    const start = useCallback((id, nextDraft) => {
        setEditingId(id);
        setDraft(nextDraft !== undefined ? nextDraft : initialDraft);
    }, [initialDraft]);
    const cancel = useCallback(() => {
        setEditingId(null);
        setDraft(initialDraft);
    }, [initialDraft]);
    return { editingId, draft, setDraft, isEditing, start, cancel };
}
