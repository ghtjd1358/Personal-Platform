// Node.js 백엔드가 Google OAuth 처리 후 access_token_once 쿠키(non-HttpOnly)를 set해 여기로 redirect
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAccessToken, setUser, logout, getApiClient } from '@sonhoseong/mfa-lib';
import { RoutePath } from './routes/paths';
import { consumeRedirectFrom } from './routes/RequireAuth';

export default function AuthCallbackPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ranRef = useRef(false);

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;

        const ctrl = new AbortController();
        let done = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        // done 플래그로 timeout / then / catch 중 단 하나만 navigate하도록 직렬화
        const finish = (): boolean => {
            if (done) return false;
            done = true;
            clearTimeout(timeoutId);
            return true;
        };

        timeoutId = setTimeout(() => {
            if (!finish()) return;
            ctrl.abort();
            navigate(RoutePath.Login + '?error=timeout', { replace: true });
        }, 5000);

        // URL hash fragment에서 토큰 읽기 — 크로스 도메인 쿠키 불가 문제 우회
        // hash는 서버 로그에 남지 않으며, 읽은 즉시 history.replaceState로 제거
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const token = hash.get('token');
        window.history.replaceState(null, '', window.location.pathname);

        if (!token) {
            if (finish()) navigate(RoutePath.Login, { replace: true });
            return () => { ctrl.abort(); clearTimeout(timeoutId); };
        }

        // setAccessToken을 /auth/me 이전에 dispatch하면 token만 있고 user 없는 broken state 발생
        // → 헤더에 직접 주입해 store 미반영 상태에서도 인증 보장
        getApiClient()
            .get<{ data: { user: { id: string; email: string; name: string; role?: 'admin' | 'user'; avatar_url?: string } } }>('/auth/me', {
                signal: ctrl.signal,
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (!finish()) return;
                const u = res.data.data.user;
                dispatch(setAccessToken(token as string));
                dispatch(setUser({ id: u.id, email: u.email, name: u.name, role: u.role ?? 'user', avatar: u.avatar_url }));
                navigate(consumeRedirectFrom(), { replace: true });
            })
            .catch((err) => {
                if (axios.isCancel(err) || err?.name === 'CanceledError') return;
                if (!finish()) return;
                dispatch(logout());
                navigate(RoutePath.Login + '?error=session_init', { replace: true });
            });

        return () => {
            done = true;
            ctrl.abort();
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <p style={{ fontFamily: 'sans-serif', color: '#666' }}>로그인 처리 중...</p>
        </div>
    );
}
