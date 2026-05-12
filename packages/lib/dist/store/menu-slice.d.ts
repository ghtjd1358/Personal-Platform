/**
 * Menu Slice
 * 메뉴 상태 관리 (GNB, LNB, 선택 상태)
 */
import { MenuItem } from '../types';
export interface MenuState {
    /** GNB 메뉴 목록 */
    gnbItems: MenuItem[];
    /** LNB 메뉴 목록 */
    lnbItems: MenuItem[];
    /** 선택된 GNB ID */
    selectedGnbId: string;
    /** 선택된 LNB ID */
    selectedLnbId: string;
    /** 펼쳐진 메뉴 ID 목록 */
    expandedIds: string[];
    /** 메뉴 로딩 여부 */
    isLoading: boolean;
}
export declare const setGnbItems: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("..").LnbMenuItem[], "menu/setGnbItems">, setLnbItems: import("@reduxjs/toolkit").ActionCreatorWithPayload<import("..").LnbMenuItem[], "menu/setLnbItems">, setSelectedGnbId: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "menu/setSelectedGnbId">, setSelectedLnbId: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "menu/setSelectedLnbId">, setExpandedIds: import("@reduxjs/toolkit").ActionCreatorWithPayload<string[], "menu/setExpandedIds">, toggleExpanded: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "menu/toggleExpanded">, setMenuLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "menu/setMenuLoading">, resetMenu: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"menu/resetMenu">;
interface RootStateWithMenu {
    menu: MenuState;
}
export declare const selectMenuState: (state: RootStateWithMenu) => MenuState;
export declare const selectGnbItems: (state: RootStateWithMenu) => import("..").LnbMenuItem[];
export declare const selectLnbItems: (state: RootStateWithMenu) => import("..").LnbMenuItem[];
export declare const selectSelectedGnbId: (state: RootStateWithMenu) => string;
export declare const selectSelectedLnbId: (state: RootStateWithMenu) => string;
export declare const selectExpandedIds: (state: RootStateWithMenu) => string[];
export declare const selectMenuLoading: (state: RootStateWithMenu) => boolean;
export declare const selectSelectedGnb: ((state: RootStateWithMenu) => import("..").LnbMenuItem | null) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("..").LnbMenuItem[], resultFuncArgs_1: string) => import("..").LnbMenuItem | null;
    memoizedResultFunc: ((resultFuncArgs_0: import("..").LnbMenuItem[], resultFuncArgs_1: string) => import("..").LnbMenuItem | null) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => import("..").LnbMenuItem | null;
    dependencies: [(state: RootStateWithMenu) => import("..").LnbMenuItem[], (state: RootStateWithMenu) => string];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectSelectedLnb: ((state: RootStateWithMenu) => import("..").LnbMenuItem | null) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("..").LnbMenuItem[], resultFuncArgs_1: string) => import("..").LnbMenuItem | null;
    memoizedResultFunc: ((resultFuncArgs_0: import("..").LnbMenuItem[], resultFuncArgs_1: string) => import("..").LnbMenuItem | null) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => import("..").LnbMenuItem | null;
    dependencies: [(state: RootStateWithMenu) => import("..").LnbMenuItem[], (state: RootStateWithMenu) => string];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectBreadcrumb: ((state: RootStateWithMenu) => import("..").LnbMenuItem[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("..").LnbMenuItem[], resultFuncArgs_1: string) => import("..").LnbMenuItem[];
    memoizedResultFunc: ((resultFuncArgs_0: import("..").LnbMenuItem[], resultFuncArgs_1: string) => import("..").LnbMenuItem[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => import("..").LnbMenuItem[];
    dependencies: [(state: RootStateWithMenu) => import("..").LnbMenuItem[], (state: RootStateWithMenu) => string];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
declare const _default: import("redux").Reducer<MenuState>;
export default _default;
//# sourceMappingURL=menu-slice.d.ts.map