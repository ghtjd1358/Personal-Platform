import { useCallback, useState } from 'react';
const defaultGenerateId = () => typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function useListState(options = {}) {
    const { defaultItems = [], items: controlledItems, onChange, generateId = defaultGenerateId, emptyItem, } = options;
    const isControlled = controlledItems !== undefined;
    const [internalItems, setInternalItems] = useState(defaultItems);
    const items = isControlled ? controlledItems : internalItems;
    const commit = useCallback((next) => {
        if (!isControlled)
            setInternalItems(next);
        onChange?.(next);
    }, [isControlled, onChange]);
    const add = useCallback((override) => {
        const base = emptyItem ? emptyItem() : {};
        const newItem = { ...base, ...override, id: generateId() };
        commit([...items, newItem]);
    }, [items, commit, generateId, emptyItem]);
    const remove = useCallback((index) => {
        commit(items.filter((_, i) => i !== index));
    }, [items, commit]);
    const update = useCallback((index, patch) => {
        commit(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    }, [items, commit]);
    const move = useCallback((index, dir) => {
        const target = dir === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= items.length)
            return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        commit(next);
    }, [items, commit]);
    const replace = useCallback((next) => {
        commit(next);
    }, [commit]);
    return { items, add, remove, update, move, replace };
}
