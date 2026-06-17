import { useCallback, useEffect, useRef, useState } from 'react';
import { getStore, logout } from '../store/app-store';
import { setAccessToken, setUser } from '../store/app-slice';
import { clearRecentMenu } from '../store/recent-menu-slice';
import { getApiClient, initApiClient } from '../network/api-client';
export function useNodeInitialize() {
    const [initialized, setInitialized] = useState(false);
    const ranRef = useRef(false);
    useEffect(() => {
        if (ranRef.current)
            return;
        ranRef.current = true;
        const controller = new AbortController();
        const { signal } = controller;
        const initialize = async () => {
            initApiClient();
            const store = getStore();
            try {
                const refreshRes = await getApiClient().post('/auth/refresh', undefined, { signal });
                if (signal.aborted)
                    return;
                const accessToken = refreshRes.data?.data?.accessToken;
                if (!accessToken)
                    return;
                store.dispatch(setAccessToken(accessToken));
                const meRes = await getApiClient().get('/user/me', { signal });
                if (signal.aborted)
                    return;
                const user = meRes.data?.data;
                if (user)
                    store.dispatch(setUser(user));
            }
            catch {
                // 비로그인 상태 / abort — 정상 케이스
            }
            if (!signal.aborted)
                setInitialized(true);
        };
        initialize();
        return () => { controller.abort(); };
    }, []);
    return { initialized };
}
export function useNodeLogout() {
    const doLogout = useCallback(async () => {
        const store = getStore();
        try {
            await getApiClient().post('/auth/logout');
        }
        catch {
            // logout API 실패해도 로컬 상태는 반드시 클리어
        }
        finally {
            store.dispatch(logout());
            store.dispatch(clearRecentMenu());
        }
    }, []);
    return { logout: doLogout };
}
