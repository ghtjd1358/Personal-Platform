/**
 * Host 전용 Axios Factory 초기화
 *
 * - getAccessToken/setAccessToken: store 와 양방향 동기화
 * - refreshToken: Supabase Refresh Token 으로 access token 재발급
 * - onUnauthorized: 토큰 갱신 실패 시 logout + 로그인 페이지로 이동
 * - onHttpError: 콘솔 로깅 (UI 토스트는 ToastContainer 가 담당)
 */

import {
    initAxiosFactory,
    setAccessToken,
    getSupabase,
    store,
} from '@sonhoseong/mfa-lib';

export const setupHostAxios = () => {
    initAxiosFactory({
        getAccessToken: () => store.getState().app.accessToken,
        setAccessToken: (token: string) => store.dispatch(setAccessToken(token)),
        refreshToken: refreshSupabaseToken,
        onUnauthorized: handleUnauthorized,
        onHttpError: (errorInfo) => {
            console.error(`[HTTP Error] ${errorInfo.status}: ${errorInfo.message}`);
        },
    });
};

const refreshSupabaseToken = async (): Promise<string | null> => {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.refreshSession();
        if (error || !data.session) {
            console.warn('[Axios Factory] 토큰 갱신 실패');
            return null;
        }
        return data.session.access_token;
    } catch {
        return null;
    }
};

const handleUnauthorized = () => {
    store.dispatch({ type: 'app/logout' });
    window.location.href = '/container/login';
};
