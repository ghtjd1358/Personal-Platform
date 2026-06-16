import { User, HostRootState } from '../types';
import { Reducer, UnknownAction } from '@reduxjs/toolkit';
import type { AppStore } from './app-store';
export declare const getHostStore: () => AppStore | undefined;
export declare const getHostState: () => HostRootState | null;
export declare const getCurrentUser: () => User | null;
export declare const getAccessToken: () => string;
export declare const isAuthenticated: () => boolean;
export declare const getCurrentService: () => string;
export declare const dispatchToHost: (action: UnknownAction) => void;
export declare const subscribeToHost: (listener: () => void) => (() => void);
export declare const useCurrentUser: () => User | null;
export declare const useReactiveAccessToken: () => string;
export declare const useReactiveIsAuthenticated: () => boolean;
export declare const injectReducerToHost: (key: string, reducer: Reducer) => void;
//# sourceMappingURL=store-access.d.ts.map