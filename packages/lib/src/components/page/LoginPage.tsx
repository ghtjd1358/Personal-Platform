/**
 * LoginPage - KOMCA 패턴
 *
 * 공통 로그인 페이지 컴포넌트
 * Host/Remote 모두에서 사용 가능
 * Supabase Auth 지원
 */

import React, { useId, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStore, setAccessToken, setUser } from '../../store/app-store';
import { storage } from '../../utils/storage';
import { User } from '../../types';
import { getSupabase } from '../../network/supabase-client';
import { applySession } from '../../hooks/use-supabase-auth';
import { Button } from '../button/Button';
import './LoginPage.css';

export interface LoginPageProps {
    /** 로그인 성공 후 이동할 경로 (기본: /) */
    redirectPath?: string;
    /** 로그인 성공 콜백 */
    onLoginSuccess?: (user: User) => void;
    /** 앱 이름 (로고 옆에 표시) */
    appName?: string;
    /** 커스텀 로고 컴포넌트 */
    logo?: React.ReactNode;
    /** Google 로그인 핸들러 (Firebase 등)
     * - Firebase 팝업 flow: { token, user } 반환 → LoginPage 가 store 동기화
     * - Supabase OAuth redirect flow: void 반환 (브라우저가 외부로 redirect, 이후 코드 미실행)
     */
    onGoogleLogin?: () => (Promise<{ token: string; user: User } | void> | void);
    /** 테스트 계정 로그인 핸들러 — 제공 시 버튼 표시 */
    onTestLogin?: () => Promise<void>;
}

/**
 * 임의의 err 값에서 안전하게 `.code` 와 `.message` 를 뽑는 type guard 헬퍼.
 * Firebase / Supabase / 네이티브 Error 모두 동일 형태로 다룬다.
 */
function getErrorInfo(err: unknown): { code: string; message: string } {
    if (typeof err === 'object' && err !== null) {
        const e = err as { code?: unknown; message?: unknown };
        const code = typeof e.code === 'string' ? e.code : '';
        const message =
            typeof e.message === 'string' && e.message.length > 0
                ? e.message
                : '알 수 없는 오류가 발생했습니다.';
        return { code, message };
    }
    if (typeof err === 'string') {
        return { code: '', message: err };
    }
    return { code: '', message: '알 수 없는 오류가 발생했습니다.' };
}

export function LoginPage({
    redirectPath = '/',
    onLoginSuccess,
    appName = 'MFA',
    logo,
    onGoogleLogin,
    onTestLogin,
}: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isTestLoading, setIsTestLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // React 18+ useId — SSR / 다중 인스턴스에서도 안정적인 id-htmlFor 매칭 보장
    const reactId = useId();
    const emailId = `${reactId}-email`;
    const passwordId = `${reactId}-password`;
    const errorId = `${reactId}-error`;

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
            const result = await onGoogleLogin();

            // OAuth redirect flow: 브라우저가 외부로 redirect → 이후 코드 미실행
            // 만약 redirect 가 시작되지 않고 result 가 void/undefined 면 그대로 종료
            if (!result) {
                return;
            }

            const { token, user } = result;

            // Redux store에 저장 (token 은 메모리에만 — 보안: XSS exfiltration 방어)
            store.dispatch(setAccessToken(token));
            store.dispatch(setUser(user));

            // localStorage 에는 user 만 저장 (token 은 새로고침 시 refresh flow 로 재발급)
            storage.setUser(user);

            onLoginSuccess?.(user);

            // 페이지 이동
            navigate(redirectPath);
        } catch (err: unknown) {
            const { code } = getErrorInfo(err);
            // 사용자가 팝업 직접 닫은 경우 — 에러로 표시할 필요 없음
            if (code === 'auth/popup-closed-by-user') {
                return;
            }
            setError('Google 로그인에 실패했습니다.');
        } finally {
            setIsGoogleLoading(false);
        }
    }, [onGoogleLogin, store, onLoginSuccess, redirectPath, navigate]);

    const handleTestLoginClick = useCallback(async () => {
        if (!onTestLogin) return;
        setError('');
        setIsTestLoading(true);
        try {
            await onTestLogin();
        } catch (err: unknown) {
            const { message } = getErrorInfo(err);
            setError(message || '테스트 로그인 중 오류가 발생했습니다.');
        } finally {
            setIsTestLoading(false);
        }
    }, [onTestLogin]);

    // Supabase 로그인 핸들러
    const handleSupabaseLogin = useCallback(async () => {
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

        const user = await applySession(data.session);

        onLoginSuccess?.(user);

        // 페이지 이동
        navigate(redirectPath);
    }, [email, password, onLoginSuccess, redirectPath, navigate]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await handleSupabaseLogin();
        } catch (err: unknown) {
            const { message } = getErrorInfo(err);
            setError(message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    }, [handleSupabaseLogin]);

    return (
        <div className="login-page">
            {/* Background */}
            <div className="login-bg" aria-hidden="true">
                <div className="login-bg-gradient" />
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`login-particle login-particle--${i + 1}`} />
                ))}
            </div>

            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <a href="/" className="login-logo-link" aria-label="홈으로 이동">
                        {logo || (
                            <>
                                {/* ㅅㅎㅅ editorial 톤 — 먹(#2B1E14) / 인장 주홍(#8C1E1A) / 한지 cream(#FBF5E3) */}
                                <svg viewBox="0 0 48 48" fill="none" width="28" height="28" aria-hidden="true">
                                    <path d="M 8 40 L 24 8 L 40 40" stroke="#2B1E14" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </svg>
                                <svg viewBox="0 0 48 48" fill="none" width="48" height="48" aria-hidden="true">
                                    <rect x="20" y="2" width="8" height="16" rx="4" fill="#8C1E1A"/>
                                    <rect x="6" y="16" width="36" height="6" rx="3" fill="#8C1E1A"/>
                                    <ellipse cx="24" cy="36" rx="18" ry="12" fill="#8C1E1A"/>
                                    <ellipse cx="17" cy="36" rx="4" ry="6" fill="#FBF5E3"/>
                                    <ellipse cx="31" cy="36" rx="4" ry="6" fill="#FBF5E3"/>
                                </svg>
                                <svg viewBox="0 0 48 48" fill="none" width="28" height="28" aria-hidden="true">
                                    <path d="M 8 40 L 24 8 L 40 40" stroke="#2B1E14" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </svg>
                            </>
                        )}
                    </a>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">{appName}에 로그인하세요</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="login-error" id={errorId} role="alert">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Google Login */}
                {onGoogleLogin && (
                    <>
                        <button
                            type="button"
                            className="login-google"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                        >
                            {isGoogleLoading ? (
                                <>
                                    <span className="login-spinner login-spinner--dark" aria-hidden="true" />
                                    로그인 중...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google로 계속하기
                                </>
                            )}
                        </button>

                        <div className="login-divider" aria-hidden="true">
                            <span>또는</span>
                        </div>
                    </>
                )}

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className={`login-input-group ${focusedField === 'email' ? 'focused' : ''}`}>
                        <label className="login-label" htmlFor={emailId}>이메일</label>
                        <div className="login-input-wrapper">
                            <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <input
                                id={emailId}
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="name@example.com"
                                aria-invalid={!!error}
                                aria-describedby={error ? errorId : undefined}
                                required
                            />
                        </div>
                    </div>

                    <div className={`login-input-group ${focusedField === 'password' ? 'focused' : ''}`}>
                        <label className="login-label" htmlFor={passwordId}>비밀번호</label>
                        <div className="login-input-wrapper">
                            <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id={passwordId}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                className="login-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="비밀번호를 입력하세요"
                                aria-invalid={!!error}
                                aria-describedby={error ? errorId : undefined}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        className="login-button"
                        rightIcon={
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        }
                    >
                        로그인
                    </Button>

                    {onTestLogin && (
                        <Button
                            type="button"
                            fullWidth
                            loading={isTestLoading}
                            disabled={isTestLoading || isSubmitting}
                            onClick={handleTestLoginClick}
                            className="login-button"
                        >
                            테스트 계정 로그인
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
