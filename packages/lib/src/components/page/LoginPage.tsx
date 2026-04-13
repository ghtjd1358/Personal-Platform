/**
 * LoginPage - KOMCA 패턴
 *
 * 공통 로그인 페이지 컴포넌트
 * Host/Remote 모두에서 사용 가능
 * Supabase Auth 지원
 */

import React, { useState, useCallback } from 'react';
import { getStore, setAccessToken, setUser } from '../../store/app-store';
import { storage } from '../../utils/storage';
import { User } from '../../types';
import { getSupabase } from '../../network/supabase-client';
import './LoginPage.css';

/**
 * Supabase User를 앱 User 타입으로 변환
 */
function mapSupabaseUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    role: supabaseUser.user_metadata?.role || 'user',
    avatar: supabaseUser.user_metadata?.avatar_url,
  };
}

export interface LoginPageProps {
    /** 로그인 성공 후 이동할 경로 (기본: /) */
    redirectPath?: string;
    /** 로그인 성공 콜백 */
    onLoginSuccess?: (user: User) => void;
    /** 앱 이름 (로고 옆에 표시) */
    appName?: string;
    /** 커스텀 로고 컴포넌트 */
    logo?: React.ReactNode;
    /** Google 로그인 핸들러 (Firebase 등) */
    onGoogleLogin?: () => Promise<{ token: string; user: User }>;
    /** 테스트 계정 표시 여부 */
    showTestAccount?: boolean;
    /** Supabase Auth 사용 여부 (기본: true) */
    useSupabase?: boolean;
}

export function LoginPage({
    redirectPath = '/',
    onLoginSuccess,
    appName = 'MFA',
    logo,
    onGoogleLogin,
    showTestAccount = false,
    useSupabase = true,
}: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const store = getStore();

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
            window.location.href = redirectPath;
        } catch (err: any) {
            if (err?.code === 'auth/popup-closed-by-user') {
                return;
            }
            setError('Google 로그인에 실패했습니다.');
        } finally {
            setIsGoogleLoading(false);
        }
    }, [onGoogleLogin, store, onLoginSuccess, redirectPath]);

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
            window.location.href = redirectPath;
        } catch (err: any) {
            throw err;
        }
    }, [email, password, store, onLoginSuccess, redirectPath]);

    // Mock 로그인 핸들러 (테스트용)
    const handleMockLogin = useCallback(async () => {
        if (email === 'admin@test.com' && password === '1234') {
            const mockToken = `mock-token-${Date.now()}`;
            const user: User = {
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
            window.location.href = redirectPath;
        } else {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    }, [email, password, store, onLoginSuccess, redirectPath]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (useSupabase) {
                await handleSupabaseLogin();
            } else {
                await handleMockLogin();
            }
        } catch (err: any) {
            setError(err.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    }, [useSupabase, handleSupabaseLogin, handleMockLogin]);

    return (
        <div className="login-page">
            {/* Background */}
            <div className="login-bg">
                <div className="login-bg-gradient" />
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`login-particle login-particle--${i + 1}`} />
                ))}
            </div>

            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    <a href="/" className="login-logo-link">
                        {logo || (
                            <>
                                <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
                                    <path d="M 8 40 L 24 8 L 40 40" stroke="#1E3A5F" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </svg>
                                <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
                                    <rect x="20" y="2" width="8" height="16" rx="4" fill="#0EA5E9"/>
                                    <rect x="6" y="16" width="36" height="6" rx="3" fill="#0EA5E9"/>
                                    <ellipse cx="24" cy="36" rx="18" ry="12" fill="#0EA5E9"/>
                                    <ellipse cx="17" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
                                    <ellipse cx="31" cy="36" rx="4" ry="6" fill="#FFFFFF"/>
                                </svg>
                                <svg viewBox="0 0 48 48" fill="none" width="28" height="28">
                                    <path d="M 8 40 L 24 8 L 40 40" stroke="#1E3A5F" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </svg>
                            </>
                        )}
                    </a>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">{appName}에 로그인하세요</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="login-error">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                                    <span className="login-spinner login-spinner--dark" />
                                    로그인 중...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google로 계속하기
                                </>
                            )}
                        </button>

                        <div className="login-divider">
                            <span>또는</span>
                        </div>
                    </>
                )}

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className={`login-input-group ${focusedField === 'email' ? 'focused' : ''}`}>
                        <label className="login-label">이메일</label>
                        <div className="login-input-wrapper">
                            <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <input
                                type="email"
                                className="login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className={`login-input-group ${focusedField === 'password' ? 'focused' : ''}`}>
                        <label className="login-label">비밀번호</label>
                        <div className="login-input-wrapper">
                            <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type="password"
                                className="login-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-button" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="login-spinner" />
                                로그인 중...
                            </>
                        ) : (
                            <>
                                로그인
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Test Account */}
                {showTestAccount && (
                    <div className="login-test-info">
                        <div className="login-test-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            테스트 계정
                        </div>
                        <span className="login-test-credentials">admin@test.com / 1234</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
