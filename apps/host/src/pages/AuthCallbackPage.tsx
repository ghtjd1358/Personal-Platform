/**
 * AuthCallbackPage — Google OAuth 후 Node.js가 리다이렉트하는 페이지
 * URL: /auth/callback?token={accessToken}
 *
 * 1. URL에서 accessToken 추출 → Redux store에 저장
 * 2. /api/user/me로 사용자 정보 로드 → Redux store에 저장
 * 3. /dashboard로 이동 (URL에서 token 파라미터 제거)
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser, apiClient } from '@sonhoseong/mfa-lib';
import { RoutePath } from './routes/paths';

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // 쿠키에서 access_token_once 읽기 (URL 노출 방지를 위해 쿠키로 전달)
        const match = document.cookie.match(/access_token_once=([^;]+)/);
        const token = match?.[1] ?? null;
        // 즉시 삭제 — 1회용
        document.cookie = 'access_token_once=; Max-Age=0; path=/';

        if (!token) {
            navigate(RoutePath.Login, { replace: true });
            return;
        }

        dispatch(setAccessToken(token));

        // 사용자 정보 로드
        apiClient
            .get<{ data: { id: string; email: string; name: string; avatar_url?: string } }>('/user/me')
            .then((res) => {
                const u = res.data.data;
                dispatch(setUser({
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: 'user',
                    avatar: u.avatar_url,
                }));
            })
            .catch(() => {
                // 사용자 정보 실패해도 인증은 유지 — 다음 요청에서 재시도
            })
            .finally(() => {
                navigate(RoutePath.Dashboard, { replace: true });
            });
    }, []);

    return null;
}
