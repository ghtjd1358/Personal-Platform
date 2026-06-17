/**
 * AuthCallbackPage — Google OAuth 후 Node.js가 리다이렉트하는 페이지
 * URL: /auth/callback (token은 access_token_once 쿠키로 전달)
 *
 * 1. 쿠키에서 accessToken 추출 → Redux store에 저장
 * 2. /auth/me 로 사용자 정보 로드 → Redux store에 저장
 * 3. /dashboard로 이동
 *
 * Strict Mode 안전: useRef 가드로 effect 1회 실행 보장
 * 실패 처리: /auth/me 실패 시 token clear + /login?error=session_init
 * 타임아웃: 5s 안에 마무리 못 하면 /login?error=timeout
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setAccessToken, setUser, logout, getApiClient } from '@sonhoseong/mfa-lib';
import { RoutePath } from './routes/paths';

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

        // finish 는 단일 진입점: done=true 를 navigate 이전에 set 해
        // timeout / .then / .catch 중 어느 하나만 navigate 하도록 보장한다.
        // 반환값으로 "내가 finish 했는지" 알려줘 caller 가 후속 동작 (navigate/abort) 을 분기.
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

        // 1회용 쿠키 읽기 (보안: URL이 아닌 쿠키로 토큰 전달 → 브라우저 히스토리에 토큰 노출 방지)
        // ⚠️ 설계 제약: document.cookie로 읽으려면 백엔드가 access_token_once를 non-HttpOnly로 설정해야 함.
        //   HttpOnly라면 JS에서 읽을 수 없어 항상 /login으로 리다이렉트됨.
        //   이상적인 구현: 백엔드가 ?code= 쿼리파라미터로 단명 opaque 코드 전달 →
        //   클라이언트가 POST /auth/exchange { code } 호출 → accessToken을 JSON body로 수신
        //   (non-HttpOnly 쿠키 대비 보안 차이 없음. URL history 노출만 방지가 목적이면 현 구현도 허용됨)
        // 정규식 anchor 로 cookie 이름 정확 매칭 + URL decode
        const match = document.cookie.match(/(?:^|;\s*)access_token_once=([^;]+)/);
        let token: string | null = null;
        try {
            token = match ? decodeURIComponent(match[1]) : null;
        } catch {
            // 잘못된 URL 인코딩 — 쿠키가 손상됨
            console.error('[AuthCallback] 토큰 쿠키 디코딩 실패');
            token = null;
        }
        // 즉시 삭제 — 읽은 순간 파기 (1회용)
        // 백엔드 Set-Cookie 속성과 완전히 일치해야 삭제됨 (path, SameSite, Secure, Domain 불일치 시 무시됨)
        const secureAttr = window.location.protocol === 'https:' ? '; Secure' : '';
        // 두 번 삭제 시도 — Domain 유무에 따른 차이 방어
        document.cookie = `access_token_once=; Max-Age=0; path=/; SameSite=Lax${secureAttr}`;
        document.cookie = `access_token_once=; Max-Age=0; path=/; SameSite=Lax${secureAttr}; Domain=${window.location.hostname}`;

        if (!token) {
            if (finish()) {
                navigate(RoutePath.Login, { replace: true });
            }
            // 클린업: 언마운트 시 진행 중인 요청과 타이머 취소
            return () => {
                ctrl.abort();
                clearTimeout(timeoutId);
            };
        }

        // 2단계: 서버에서 사용자 정보(이름, 이메일, 권한) 가져오기
        // setAccessToken을 /auth/me 이전에 dispatch하면 토큰만 있고 user가 없는 broken state 창이 생긴다.
        // token은 헤더에 직접 주입 — 인터셉터가 store에서 읽는 것을 기다릴 필요 없음
        getApiClient()
            .get<{ data: { user: { id: string; email: string; name: string; role?: 'admin' | 'user'; avatar_url?: string } } }>('/auth/me', {
                signal: ctrl.signal,
                headers: { Authorization: `Bearer ${token}` }, // 토큰을 직접 헤더에 추가 — store 미반영 상태에서도 인증 보장
            })
            .then((res) => {
                if (!finish()) return; // 타임아웃 / 언마운트가 이미 처리함
                const u = res.data.data.user;

                // 보안 note: client-side JWT 서명 검증 불가 → sub 비교는 security theater.
                // 신뢰 근원은 서버가 검증한 /auth/me 응답 — u.id를 그대로 사용.
                dispatch(setAccessToken(token as string));
                dispatch(setUser({
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role ?? 'user',
                    avatar: u.avatar_url,
                }));
                navigate(RoutePath.Dashboard, { replace: true });
            })
            .catch((err) => {
                // timeout이 abort한 경우 무시 (timeout 핸들러가 이미 navigate 처리)
                if (axios.isCancel(err) || err?.name === 'CanceledError') return;
                if (!finish()) return; // 타임아웃이 먼저 처리한 경우 중복 navigate 방지
                // /auth/me 실패 → 세션 초기화 실패. token + user clear 후 로그인 페이지로
                dispatch(logout());
                navigate(RoutePath.Login + '?error=session_init', { replace: true });
            });

        // 클린업: 언마운트 시 진행 중인 요청과 타이머 취소
        // strict mode 더블 마운트 시에도 leak 방지
        return () => {
            done = true; // 후속 .then/.catch 의 finish() 가 false 를 반환하도록
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
