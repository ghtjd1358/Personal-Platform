/**
 * Supabase Axios Client
 * Supabase REST API를 axios로 호출하기 위한 클라이언트
 * 토큰 갱신 지원
 */
import { AxiosClientFactory, initAxiosFactory } from './axios-factory';
/**
 * Supabase Axios 클라이언트 생성
 */
export function createSupabaseAxiosClient(config) {
    const { supabaseUrl, supabaseAnonKey, timeout = 30000, refreshSession, getAccessToken, setAccessToken, onUnauthorized, } = config;
    // Axios Factory 초기화 (토큰 갱신 지원)
    if (getAccessToken && setAccessToken) {
        initAxiosFactory({
            getAccessToken,
            setAccessToken,
            refreshToken: refreshSession
                ? async () => {
                    const session = await refreshSession();
                    return session?.accessToken || null;
                }
                : undefined,
            onUnauthorized,
        });
    }
    // Supabase REST API 클라이언트 생성
    return AxiosClientFactory.createClient({
        hostUrl: supabaseUrl,
        basePath: '/rest/v1',
        timeout,
    }, (requestConfig) => {
        // Supabase 필수 헤더
        requestConfig.headers['apikey'] = supabaseAnonKey;
        requestConfig.headers['Content-Type'] = 'application/json';
        requestConfig.headers['Prefer'] = 'return=representation';
        return requestConfig;
    });
}
/**
 * Supabase Auth API 클라이언트 생성 (토큰 갱신용)
 */
export function createSupabaseAuthClient(config) {
    const { supabaseUrl, supabaseAnonKey, timeout = 30000 } = config;
    return AxiosClientFactory.createClient({
        hostUrl: supabaseUrl,
        basePath: '/auth/v1',
        timeout,
    }, (requestConfig) => {
        requestConfig.headers['apikey'] = supabaseAnonKey;
        requestConfig.headers['Content-Type'] = 'application/json';
        return requestConfig;
    });
}
/**
 * Supabase 토큰 갱신 헬퍼
 */
export async function refreshSupabaseToken(authClient, refreshToken) {
    try {
        const response = await authClient.post('/token?grant_type=refresh_token', {
            refresh_token: refreshToken,
        });
        if (response.data?.access_token) {
            return {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token || refreshToken,
            };
        }
        return null;
    }
    catch (error) {
        console.error('[Supabase Token Refresh Failed]', error);
        return null;
    }
}
