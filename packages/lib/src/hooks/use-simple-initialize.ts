import { useEffect, useState } from 'react';
import { getStore } from '../store/app-store';
import { setUser } from '../store/app-slice';
import { setRecentMenuList } from '../store/recent-menu-slice';
import { storage } from '../utils/storage';

export function restoreFromStorage(store: ReturnType<typeof getStore>): void {
  const savedUser = storage.getUser();
  if (savedUser) store.dispatch(setUser(savedUser));

  const savedRecentMenu = storage.getRecentMenu();
  if (savedRecentMenu.length > 0) store.dispatch(setRecentMenuList(savedRecentMenu));
}

export function useSimpleInitialize() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!storage.isHostApp()) {
      restoreFromStorage(getStore());
    }
    setInitialized(true);
  }, []);

  return { initialized };
}
