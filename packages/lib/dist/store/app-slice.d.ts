/**
 * App Slice — 인증/사용자/UI 상태
 *
 * Access Token / User 는 메모리(Redux)에만 저장.
 * 새로고침 시 Refresh Token(HttpOnly Cookie) 으로 재발급.
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { User, AppState } from '../types';
export declare const appSlice: import("@reduxjs/toolkit").Slice<AppState, {
    setAccessToken: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: (import("..").UserRole | string) | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<string>) => void;
    setUser: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: (import("..").UserRole | string) | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<User | null>) => void;
    setGlobalLoadingTitle: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: (import("..").UserRole | string) | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<string>) => void;
    setService: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: (import("..").UserRole | string) | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<string>) => void;
    setSelectedGnb: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: (import("..").UserRole | string) | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<string>) => void;
    logout: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: (import("..").UserRole | string) | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }) => void;
}, "app", "app", import("@reduxjs/toolkit").SliceSelectors<AppState>>;
export declare const setAccessToken: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/setAccessToken">, setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<User | null, "app/setUser">, setGlobalLoadingTitle: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/setGlobalLoadingTitle">, setService: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/setService">, setSelectedGnb: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/setSelectedGnb">, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"app/logout">;
export declare const selectAppState: (state: {
    app: AppState;
}) => AppState;
export declare const selectAccessToken: (state: {
    app: AppState;
}) => string;
export declare const selectUser: (state: {
    app: AppState;
}) => User | null;
export declare const selectGlobalLoadingTitle: (state: {
    app: AppState;
}) => string;
export declare const selectService: (state: {
    app: AppState;
}) => string;
export declare const selectAppSelectedGnb: (state: {
    app: AppState;
}) => string;
//# sourceMappingURL=app-slice.d.ts.map