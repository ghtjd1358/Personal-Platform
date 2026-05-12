/**
 * Auth Hooks
 * 로그인, 로그아웃, 토큰 갱신
 */
import { User } from '../types';
export interface LoginResponse {
    accessToken: string;
    refreshToken?: string;
    user: User;
}
export interface LoginRequest {
    username: string;
    password: string;
}
export type LoginFn = (request: LoginRequest) => Promise<LoginResponse>;
export type LogoutFn = () => Promise<void>;
export type RefreshFn = () => Promise<string | null>;
/**
 * 로그인 Hook
 */
export declare function useLogin(loginApi?: LoginFn): (request: LoginRequest) => Promise<LoginResponse | null>;
/**
 * 로그아웃 Hook
 */
export declare function useLogout(logoutApi?: LogoutFn): () => Promise<void>;
/**
 * 토큰 갱신 Hook
 */
export declare function useTokenRefresh(refreshApi?: RefreshFn): () => Promise<string | null>;
/**
 * 인증 상태 확인 Hook
 * useSelector를 사용하여 상태 변경시 리렌더링 보장
 */
export declare function useAuthState(): {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string;
};
//# sourceMappingURL=use-auth.d.ts.map