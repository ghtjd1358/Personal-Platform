/**
 * Node.js API Initialize Hook
 * 앱 부트 시 HttpOnly Cookie → AccessToken 복구 + 사용자 정보 로드
 * Supabase Auth 대신 Node.js JWT 기반 인증 사용
 *
 * 가드 두 가지:
 *  1) ranRef     — React Strict Mode 이중 마운트에서 effect 가 두 번 도는 걸 방지
 *  2) AbortController — unmount 후 도착한 응답이 store 에 dispatch 되는 zombie write 방지
 */
import { useEffect, useRef, useState } from 'react';
import { getStore } from '../store/app-store';
import { setAccessToken, setUser } from '../store/app-slice';
import { apiClient, initApiClient } from '../network/api-client';
export function useNodeInitialize() {
    const [initialized, setInitialized] = useState(false);
    // Strict Mode 에서 effect 가 두 번 실행되는 걸 막기 위한 가드
    const ranRef = useRef(false);
    useEffect(() => {
        if (ranRef.current)
            return;
        ranRef.current = true;
        const controller = new AbortController();
        const { signal } = controller;
        const initialize = async () => {
            // AxiosClientFactory 전역 초기화 (한 번만)
            initApiClient();
            const store = getStore();
            try {
                // HttpOnly Cookie에 refreshToken이 있으면 새 accessToken 발급
                const refreshRes = await apiClient.post('/auth/refresh', undefined, { signal });
                if (signal.aborted)
                    return;
                const accessToken = refreshRes.data?.data?.accessToken;
                if (accessToken) {
                    store.dispatch(setAccessToken(accessToken));
                    // 사용자 정보 로드
                    const meRes = await apiClient.get('/user/me', { signal });
                    if (signal.aborted)
                        return;
                    const user = meRes.data?.data;
                    if (user) {
                        store.dispatch(setUser(user));
                    }
                }
            }
            catch {
                // 비로그인 상태 / abort — 정상 케이스, 아무것도 하지 않음
            }
            if (!signal.aborted) {
                setInitialized(true);
            }
        };
        initialize();
        return () => {
            controller.abort();
        };
    }, []);
    return { initialized };
}
