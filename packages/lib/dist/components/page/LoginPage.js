import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * LoginPage - KOMCA 패턴
 *
 * 공통 로그인 페이지 컴포넌트
 * Host/Remote 모두에서 사용 가능
 * Supabase Auth 지원
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, setAccessToken, setUser } from '../../store/app-store';
import { storage } from '../../utils/storage';
import { getSupabase } from '../../network/supabase-client';
import './LoginPage.css';
/**
 * Supabase User를 앱 User 타입으로 변환
 */
function mapSupabaseUser(supabaseUser) {
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
        role: supabaseUser.user_metadata?.role || 'user',
        avatar: supabaseUser.user_metadata?.avatar_url,
    };
}
export function LoginPage({ redirectPath = '/', onLoginSuccess, appName = 'MFA', logo, onGoogleLogin, showTestAccount = false, useSupabase = true, }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const store = getStore();
    const navigate = useNavigate();
    const handleGoogleLogin = useCallback(async () => {
        if (!onGoogleLogin) {
            setError('Google 로그인이 설정되지 않았습니다.');
            return;
        }
        setError('');
        setIsGoogleLoading(true);
        try {
            const { token, user } = await onGoogleLogin();
            // Redux store에 저장
            store.dispatch(setAccessToken(token));
            store.dispatch(setUser(user));
            // localStorage에도 저장 (페이지 새로고침 대비)
            storage.setAccessToken(token);
            storage.setUser(user);
            onLoginSuccess?.(user);
            // 페이지 이동
            navigate(redirectPath);
        }
        catch (err) {
            if (err?.code === 'auth/popup-closed-by-user') {
                return;
            }
            setError('Google 로그인에 실패했습니다.');
        }
        finally {
            setIsGoogleLoading(false);
        }
    }, [onGoogleLogin, store, onLoginSuccess, redirectPath, navigate]);
    // Supabase 로그인 핸들러
    const handleSupabaseLogin = useCallback(async () => {
        try {
            const supabase = getSupabase();
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (authError) {
                // 에러 메시지 한글화
                if (authError.message.includes('Invalid login credentials')) {
                    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
                }
                throw new Error(authError.message);
            }
            if (!data.session || !data.user) {
                throw new Error('로그인 응답이 올바르지 않습니다.');
            }
            const user = mapSupabaseUser(data.user);
            // Redux store에 저장
            store.dispatch(setAccessToken(data.session.access_token));
            store.dispatch(setUser(user));
            // localStorage에도 저장
            storage.setAccessToken(data.session.access_token);
            storage.setUser(user);
            onLoginSuccess?.(user);
            // 페이지 이동
            navigate(redirectPath);
        }
        catch (err) {
            throw err;
        }
    }, [email, password, store, onLoginSuccess, redirectPath, navigate]);
    // Mock 로그인 핸들러 (테스트용)
    const handleMockLogin = useCallback(async () => {
        if (email === 'admin@test.com' && password === '1234') {
            const mockToken = `mock-token-${Date.now()}`;
            const user = {
                id: '1',
                name: '관리자',
                email: email,
                role: 'admin',
            };
            store.dispatch(setAccessToken(mockToken));
            store.dispatch(setUser(user));
            storage.setAccessToken(mockToken);
            storage.setUser(user);
            onLoginSuccess?.(user);
            navigate(redirectPath);
        }
        else {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    }, [email, password, store, onLoginSuccess, redirectPath, navigate]);
    const handleTestLogin = useCallback(async () => {
        setError('');
        setIsSubmitting(true);
        try {
            const supabase = getSupabase();
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: 'admin@test.com',
                password: '1234',
            });
            if (authError)
                throw new Error('테스트 계정 로그인에 실패했습니다.');
            if (!data.session || !data.user)
                throw new Error('로그인 응답이 올바르지 않습니다.');
            const user = mapSupabaseUser(data.user);
            store.dispatch(setAccessToken(data.session.access_token));
            store.dispatch(setUser(user));
            storage.setAccessToken(data.session.access_token);
            storage.setUser(user);
            onLoginSuccess?.(user);
            navigate(redirectPath);
        }
        catch (err) {
            setError(err.message || '테스트 로그인 중 오류가 발생했습니다.');
        }
        finally {
            setIsSubmitting(false);
        }
    }, [store, onLoginSuccess, redirectPath, navigate]);
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (useSupabase) {
                await handleSupabaseLogin();
            }
            else {
                await handleMockLogin();
            }
        }
        catch (err) {
            setError(err.message || '로그인 중 오류가 발생했습니다.');
        }
        finally {
            setIsSubmitting(false);
        }
    }, [useSupabase, handleSupabaseLogin, handleMockLogin]);
    return (_jsxs("div", { className: "login-page", children: [_jsxs("div", { className: "login-bg", children: [_jsx("div", { className: "login-bg-gradient" }), [...Array(12)].map((_, i) => (_jsx("div", { className: `login-particle login-particle--${i + 1}` }, i)))] }), _jsxs("div", { className: "login-card", children: [_jsxs("div", { className: "login-header", children: [_jsx("a", { href: "/", className: "login-logo-link", children: logo || (_jsxs(_Fragment, { children: [_jsx("svg", { viewBox: "0 0 48 48", fill: "none", width: "28", height: "28", children: _jsx("path", { d: "M 8 40 L 24 8 L 40 40", stroke: "#2B1E14", strokeWidth: "14", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }) }), _jsxs("svg", { viewBox: "0 0 48 48", fill: "none", width: "48", height: "48", children: [_jsx("rect", { x: "20", y: "2", width: "8", height: "16", rx: "4", fill: "#8C1E1A" }), _jsx("rect", { x: "6", y: "16", width: "36", height: "6", rx: "3", fill: "#8C1E1A" }), _jsx("ellipse", { cx: "24", cy: "36", rx: "18", ry: "12", fill: "#8C1E1A" }), _jsx("ellipse", { cx: "17", cy: "36", rx: "4", ry: "6", fill: "#FBF5E3" }), _jsx("ellipse", { cx: "31", cy: "36", rx: "4", ry: "6", fill: "#FBF5E3" })] }), _jsx("svg", { viewBox: "0 0 48 48", fill: "none", width: "28", height: "28", children: _jsx("path", { d: "M 8 40 L 24 8 L 40 40", stroke: "#2B1E14", strokeWidth: "14", strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }) })] })) }), _jsx("h1", { className: "login-title", children: "Welcome Back" }), _jsxs("p", { className: "login-subtitle", children: [appName, "\uC5D0 \uB85C\uADF8\uC778\uD558\uC138\uC694"] })] }), error && (_jsxs("div", { className: "login-error", children: [_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }), error] })), onGoogleLogin && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "login-google", onClick: handleGoogleLogin, disabled: isGoogleLoading, children: isGoogleLoading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "login-spinner login-spinner--dark" }), "\uB85C\uADF8\uC778 \uC911..."] })) : (_jsxs(_Fragment, { children: [_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", children: [_jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), _jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), _jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), _jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), "Google\uB85C \uACC4\uC18D\uD558\uAE30"] })) }), _jsx("div", { className: "login-divider", children: _jsx("span", { children: "\uB610\uB294" }) })] })), _jsxs("form", { className: "login-form", onSubmit: handleSubmit, children: [_jsxs("div", { className: `login-input-group ${focusedField === 'email' ? 'focused' : ''}`, children: [_jsx("label", { className: "login-label", children: "\uC774\uBA54\uC77C" }), _jsxs("div", { className: "login-input-wrapper", children: [_jsxs("svg", { className: "login-input-icon", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }), _jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })] }), _jsx("input", { type: "email", className: "login-input", value: email, onChange: (e) => setEmail(e.target.value), onFocus: () => setFocusedField('email'), onBlur: () => setFocusedField(null), placeholder: "name@example.com", required: true })] })] }), _jsxs("div", { className: `login-input-group ${focusedField === 'password' ? 'focused' : ''}`, children: [_jsx("label", { className: "login-label", children: "\uBE44\uBC00\uBC88\uD638" }), _jsxs("div", { className: "login-input-wrapper", children: [_jsxs("svg", { className: "login-input-icon", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }), _jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })] }), _jsx("input", { type: "password", className: "login-input", value: password, onChange: (e) => setPassword(e.target.value), onFocus: () => setFocusedField('password'), onBlur: () => setFocusedField(null), placeholder: "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD558\uC138\uC694", required: true })] })] }), _jsx("button", { type: "submit", className: "login-button", disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "login-spinner" }), "\uB85C\uADF8\uC778 \uC911..."] })) : (_jsxs(_Fragment, { children: ["\uB85C\uADF8\uC778", _jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M5 12h14M12 5l7 7-7 7" }) })] })) })] }), showTestAccount && (_jsxs("div", { className: "login-test-info", children: [_jsxs("div", { className: "login-test-badge", children: [_jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }), "\uD14C\uC2A4\uD2B8 \uACC4\uC815"] }), _jsx("button", { type: "button", className: "login-test-button", onClick: handleTestLogin, disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "login-spinner" }), "\uB85C\uADF8\uC778 \uC911..."] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" }) }), "\uD14C\uC2A4\uD2B8 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778"] })) })] }))] })] }));
}
export default LoginPage;
