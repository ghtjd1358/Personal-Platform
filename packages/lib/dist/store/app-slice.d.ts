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
    }, action: PayloadAction<User | null>) => void;
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
    }) => void;
}, "app", "app", import("@reduxjs/toolkit").SliceSelectors<AppState>>;
export declare const setAccessToken: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/setAccessToken">, setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<User | null, "app/setUser">, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"app/logout">;
export declare const selectAppState: (state: {
    app: AppState;
}) => AppState;
export declare const selectAccessToken: (state: {
    app: AppState;
}) => string;
export declare const selectUser: (state: {
    app: AppState;
}) => User | null;
//# sourceMappingURL=app-slice.d.ts.map