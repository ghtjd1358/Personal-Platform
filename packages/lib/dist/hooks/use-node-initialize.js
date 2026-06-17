import { useCallback, useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { getStore, logout } from '../store/app-store';
import { setAccessToken, setUser } from '../store/app-slice';
import { clearRecentMenu } from '../store/recent-menu-slice';
import { getApiClient, initApiClient } from '../network/api-client';
const API_BASE = (process.env.REACT_APP_API_URL ?? 'http://localhost:4000') + '/api';
// 초기화 전용 plain axios — 인터셉터 없이 refresh를 호출해 401 retry 루프 차단
const initAxios = Axios.create({ baseURL: API_BASE, withCredentials: true, timeout: 3000 });
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
                const refreshRes = await initAxios.post('/auth/refresh', undefined, { signal });
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
            catch (err) {
                if (signal.aborted)
                    return;
                // 비로그인(401/403)은 정상 케이스, 그 외는 경고
                if (!Axios.isAxiosError(err) || (err.response?.status !== 401 && err.response?.status !== 403)) {
                    console.warn('[NodeInitialize] 세션 복구 실패:', err);
                }
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
            // 서버 실패해도 로컬 상태는 반드시 클리어
        }
        finally {
            store.dispatch(logout());
            store.dispatch(clearRecentMenu());
        }
    }, []);
    return { logout: doLogout };
}
