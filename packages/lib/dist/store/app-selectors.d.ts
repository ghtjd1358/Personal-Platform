/**
 * App Slice 파생 셀렉터 — createSelector 로 메모이제이션
 *
 * 단일 필드 조회는 app-slice.ts 의 기본 셀렉터, 파생/계산형은 여기.
 */
/** 인증 여부 */
export declare const selectIsAuthenticated: ((state: {
    app: import("..").AppState;
}) => boolean) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: string) => boolean;
    memoizedResultFunc: ((resultFuncArgs_0: string) => boolean) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => boolean;
    dependencies: [(state: {
        app: import("..").AppState;
    }) => string];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
/** 사용자 역할 */
export declare const selectUserRole: ((state: {
    app: import("..").AppState;
}) => string) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("..").User | null) => string;
    memoizedResultFunc: ((resultFuncArgs_0: import("..").User | null) => string) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => string;
    dependencies: [(state: {
        app: import("..").AppState;
    }) => import("..").User | null];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
/** 관리자 여부 */
export declare const selectIsAdmin: ((state: {
    app: import("..").AppState;
}) => boolean) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("..").User | null) => boolean;
    memoizedResultFunc: ((resultFuncArgs_0: import("..").User | null) => boolean) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => boolean;
    dependencies: [(state: {
        app: import("..").AppState;
    }) => import("..").User | null];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
/** 사용자 권한 목록 */
export declare const selectUserPermissions: ((state: {
    app: import("..").AppState;
}) => import("..").Permission[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("..").User | null) => import("..").Permission[];
    memoizedResultFunc: ((resultFuncArgs_0: import("..").User | null) => import("..").Permission[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => import("..").Permission[];
    dependencies: [(state: {
        app: import("..").AppState;
    }) => import("..").User | null];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
//# sourceMappingURL=app-selectors.d.ts.map