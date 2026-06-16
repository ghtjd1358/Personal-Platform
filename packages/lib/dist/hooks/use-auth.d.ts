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
export declare function useLogin(loginApi?: LoginFn): (request: LoginRequest) => Promise<LoginResponse | null>;
export declare function useLogout(logoutApi?: LogoutFn): () => Promise<void>;
export declare function useTokenRefresh(refreshApi?: RefreshFn): () => Promise<string | null>;
export declare function useAuthState(): {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string;
};
//# sourceMappingURL=use-auth.d.ts.map