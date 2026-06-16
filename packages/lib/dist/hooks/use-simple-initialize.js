import { useEffect, useState } from 'react';
import { getStore } from '../store/app-store';
import { setUser } from '../store/app-slice';
import { setRecentMenuList } from '../store/recent-menu-slice';
import { storage } from '../utils/storage';
// access token은 localStorage에서 복구하지 않는다 — XSS exfiltration 방어.
// token은 Redux 메모리에만 존재하고 새로고침 시 refresh flow로 재발급받는다.
export function restoreFromStorage(store) {
    const savedUser = storage.getUser();
    if (savedUser)
        store.dispatch(setUser(savedUser));
    const savedRecentMenu = storage.getRecentMenu();
    if (savedRecentMenu.length > 0)
        store.dispatch(setRecentMenuList(savedRecentMenu));
}
export function useSimpleInitialize() {
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        restoreFromStorage(getStore());
        setInitialized(true);
    }, []);
    return { initialized };
}
