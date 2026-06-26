import { useCallback, useState } from 'react';
export function useTabState(initialTab, options) {
    const { validTabs, onChange } = options ?? {};
    const [activeTab, setActiveTabState] = useState(initialTab);
    const setActiveTab = useCallback((tab) => {
        if (validTabs && !validTabs.includes(tab))
            return;
        setActiveTabState(tab);
        onChange?.(tab);
    }, [validTabs, onChange]);
    const reset = useCallback(() => setActiveTabState(initialTab), [initialTab]);
    return { activeTab, setActiveTab, reset };
}
