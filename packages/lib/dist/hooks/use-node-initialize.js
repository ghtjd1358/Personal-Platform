import { useEffect, useRef, useState } from 'react';
import { getStore } from '../store/app-store';
import { setAccessToken, setUser } from '../store/app-slice';
import { apiClient, initApiClient } from '../network/api-client';
export function useNodeInitialize() {
    const [initialized, setInitialized] = useState(false);
    // Strict Mode 이중 마운트 + zombie dispatch 방지
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
                const refreshRes = await apiClient.post('/auth/refresh', undefined, { signal });
                if (signal.aborted)
                    return;
                const accessToken = refreshRes.data?.data?.accessToken;
                if (!accessToken)
                    return;
                store.dispatch(setAccessToken(accessToken));
                const meRes = await apiClient.get('/user/me', { signal });
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
