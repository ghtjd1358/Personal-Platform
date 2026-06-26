import { useCallback, useMemo, useState } from 'react';
export function useLineDelimitedInput(initial = []) {
    const [text, setText] = useState(initial.join('\n'));
    const setFromList = useCallback((items) => {
        setText(items.join('\n'));
    }, []);
    const lines = useMemo(() => text.split('\n').map((s) => s.trim()).filter(Boolean), [text]);
    return { text, setText, setFromList, lines };
}
