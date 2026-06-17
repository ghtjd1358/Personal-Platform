import { PayloadAction } from '@reduxjs/toolkit';
import { User, AppState } from '../types';
export declare const appSlice: import("@reduxjs/toolkit").Slice<AppState, {
    setAccessToken: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: import("..").UserRole | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        sessionRestoring: boolean;
    }, action: PayloadAction<string>) => void;
    setUser: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: import("..").UserRole | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        sessionRestoring: boolean;
    }, action: PayloadAction<User | null>) => void;
    setSessionRestoring: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: import("..").UserRole | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        sessionRestoring: boolean;
    }, action: PayloadAction<boolean>) => void;
    logout: (state: {
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role?: import("..").UserRole | undefined;
            avatar?: string | undefined;
            permissions?: {
                code: string;
                actions: import("..").PermissionAction[];
            }[] | undefined;
        } | null;
        sessionRestoring: boolean;
    }) => void;
}, "app", "app", import("@reduxjs/toolkit").SliceSelectors<AppState>>;
export declare const setAccessToken: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/setAccessToken">, setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<User | null, "app/setUser">, setSessionRestoring: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "app/setSessionRestoring">, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"app/logout">;
export declare const selectAppState: (state: {
    app: AppState;
}) => AppState;
export declare const selectAccessToken: (state: {
    app: AppState;
}) => string;
export declare const selectUser: (state: {
    app: AppState;
}) => User | null;
export declare const selectSessionRestoring: (state: {
    app: AppState;
}) => boolean;
//# sourceMappingURL=app-slice.d.ts.map