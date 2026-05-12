/**
 * Storage 유틸리티
 * localStorage/sessionStorage 관리
 */
import { User, RecentMenu } from '../types';
export declare const STORAGE_KEYS: {
    ACCESS_TOKEN: string;
    USER: string;
    RECENT_MENU: string;
    IS_HOST_APP: string;
};
/**
 * Storage 유틸리티
 */
export declare const storage: {
    setHostApp: () => void;
    removeHostApp: () => void;
    isHostApp: () => boolean;
    getAccessToken: () => string;
    setAccessToken: (token: string) => void;
    getUser: () => User | null;
    setUser: (user: User | null) => void;
    getRecentMenu: () => RecentMenu[];
    setRecentMenu: (list: RecentMenu[]) => void;
    clearAuth: () => void;
    clearAll: () => void;
};
export declare const isHostApp: () => boolean;
export declare const setHostApp: () => void;
export declare const removeHostApp: () => void;
/**
 * Get link prefix based on host app context
 * @param basePath - Base path for the app (e.g., '/jobtracker', '/blog')
 * @returns Full path with container prefix if in host app
 */
export declare const getLinkPrefix: (basePath: string) => string;
//# sourceMappingURL=storage.d.ts.map