import { useCallback } from 'react';
import { getStore, logout } from '../store/app-store';
import { clearRecentMenu } from '../store/recent-menu-slice';
import { getApiClient } from '../network/api-client';
export function useNodeLogout() {
    const doLogout = useCallback(async () => {
        const store = getStore();
        try {
            await getApiClient().post('/auth/logout');
        }
        catch {
            // 서버 실패해도 로컬 상태는 반드시 클리어
        }
        finally {
            store.dispatch(logout());
            store.dispatch(clearRecentMenu());
        }
    }, []);
    return { logout: doLogout };
}
