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
export declare const selectUserRole: ((state: {
    app: import("..").AppState;
}) => import("..").UserRole) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import("..").User | null) => import("..").UserRole;
    memoizedResultFunc: ((resultFuncArgs_0: import("..").User | null) => import("..").UserRole) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => import("..").UserRole;
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