import { useCallback, useState } from 'react';
export function useCollapsibleSet(options) {
    const getId = options?.getId ??
        ((i) => (typeof i === 'string' ? i : i.id));
    const getDefaultOpen = options?.getDefaultOpen ?? (() => false);
    const [overridden, setOverridden] = useState(() => new Set());
    const isOpen = useCallback((item) => {
        const id = getId(item);
        const def = getDefaultOpen(item);
        return overridden.has(id) ? !def : def;
    }, [overridden, getId, getDefaultOpen]);
    const toggle = useCallback((id) => {
        setOverridden((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    }, []);
    const reset = useCallback(() => setOverridden(new Set()), []);
    return { isOpen, toggle, reset };
}
