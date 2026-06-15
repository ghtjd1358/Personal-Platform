/**
 * Node.js API Initialize Hook
 * 앱 부트 시 HttpOnly Cookie → AccessToken 복구 + 사용자 정보 로드
 * Supabase Auth 대신 Node.js JWT 기반 인증 사용
 */
import { useEffect, useState } from 'react';
import { getStore } from '../store/app-store';
import { setAccessToken, setUser } from '../store/app-slice';
import { apiClient, initApiClient } from '../network/api-client';
export function useNodeInitialize() {
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        const initialize = async () => {
            // AxiosClientFactory 전역 초기화 (한 번만)
            initApiClient();
            const store = getStore();
            try {
                // HttpOnly Cookie에 refreshToken이 있으면 새 accessToken 발급
                const refreshRes = await apiClient.post('/auth/refresh');
                const accessToken = refreshRes.data?.data?.accessToken;
                if (accessToken) {
                    store.dispatch(setAccessToken(accessToken));
                    // 사용자 정보 로드
                    const meRes = await apiClient.get('/user/me');
                    const user = meRes.data?.data;
                    if (user) {
                        store.dispatch(setUser(user));
                    }
                }
            }
            catch {
                // 비로그인 상태 — 정상 케이스, 아무것도 하지 않음
            }
            setInitialized(true);
        };
        initialize();
    }, []);
    return { initialized };
}
