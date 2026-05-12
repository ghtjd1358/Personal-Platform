/**
 * Recent Menu Slice
 * 최근 방문 메뉴 상태 관리 (탭)
 */
import { PayloadAction } from '@reduxjs/toolkit';
import { RecentMenu } from '../types';
export interface RecentMenuState {
    /** 최근 메뉴 목록 */
    list: RecentMenu[];
    /** 현재 활성 메뉴 ID */
    currentId: string;
    /** 최대 탭 개수 */
    maxTabs: number;
}
export declare const recentMenuSlice: import("@reduxjs/toolkit").Slice<RecentMenuState, {
    /** 최근 메뉴 목록 설정 (복구용) */
    setRecentMenuList: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }, action: PayloadAction<RecentMenu[]>) => void;
    /** 최근 메뉴 추가/업데이트 */
    addRecentMenu: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }, action: PayloadAction<RecentMenu>) => void;
    /** 최근 메뉴 제거 */
    removeRecentMenu: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }, action: PayloadAction<string>) => void;
    /** 현재 메뉴 변경 */
    setCurrentRecentMenu: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }, action: PayloadAction<string>) => void;
    /** 메뉴 상태 업데이트 (스크롤 위치, 검색 조건 등) */
    updateRecentMenuState: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }, action: PayloadAction<{
        id: string;
        state?: any;
        data?: any;
    }>) => void;
    /** 모든 최근 메뉴 제거 */
    clearRecentMenu: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }) => void;
    /** 현재 메뉴 외 모든 메뉴 제거 */
    closeOtherMenus: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }) => void;
    /** 최대 탭 개수 설정 */
    setMaxTabs: (state: {
        list: {
            id: string;
            pathname: string;
            search: string;
            title: string;
            service?: string | undefined;
            state?: any;
            data?: any;
        }[];
        currentId: string;
        maxTabs: number;
    }, action: PayloadAction<number>) => void;
}, "recentMenu", "recentMenu", import("@reduxjs/toolkit").SliceSelectors<RecentMenuState>>;
export declare const setRecentMenuList: import("@reduxjs/toolkit").ActionCreatorWithPayload<RecentMenu[], "recentMenu/setRecentMenuList">, addRecentMenu: import("@reduxjs/toolkit").ActionCreatorWithPayload<RecentMenu, "recentMenu/addRecentMenu">, removeRecentMenu: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "recentMenu/removeRecentMenu">, setCurrentRecentMenu: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "recentMenu/setCurrentRecentMenu">, updateRecentMenuState: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    state?: any;
    data?: any;
}, "recentMenu/updateRecentMenuState">, clearRecentMenu: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"recentMenu/clearRecentMenu">, closeOtherMenus: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"recentMenu/closeOtherMenus">, setMaxTabs: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "recentMenu/setMaxTabs">;
interface RootStateWithRecentMenu {
    recentMenu: RecentMenuState;
}
export declare const selectRecentMenuState: (state: RootStateWithRecentMenu) => RecentMenuState;
export declare const selectRecentMenuList: (state: RootStateWithRecentMenu) => RecentMenu[];
export declare const selectCurrentRecentMenuId: (state: RootStateWithRecentMenu) => string;
export declare const selectCurrentRecentMenu: ((state: RootStateWithRecentMenu) => RecentMenu | null) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: RecentMenu[], resultFuncArgs_1: string) => RecentMenu | null;
    memoizedResultFunc: ((resultFuncArgs_0: RecentMenu[], resultFuncArgs_1: string) => RecentMenu | null) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => RecentMenu | null;
    dependencies: [(state: RootStateWithRecentMenu) => RecentMenu[], (state: RootStateWithRecentMenu) => string];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectRecentMenuCount: ((state: RootStateWithRecentMenu) => number) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: RecentMenu[]) => number;
    memoizedResultFunc: ((resultFuncArgs_0: RecentMenu[]) => number) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => number;
    dependencies: [(state: RootStateWithRecentMenu) => RecentMenu[]];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectHasRecentMenu: ((state: RootStateWithRecentMenu) => boolean) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: RecentMenu[]) => boolean;
    memoizedResultFunc: ((resultFuncArgs_0: RecentMenu[]) => boolean) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => boolean;
    dependencies: [(state: RootStateWithRecentMenu) => RecentMenu[]];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
declare const _default: import("redux").Reducer<RecentMenuState>;
export default _default;
//# sourceMappingURL=recent-menu-slice.d.ts.map