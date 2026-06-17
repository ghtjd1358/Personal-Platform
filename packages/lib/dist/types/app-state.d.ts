import { Reducer } from '@reduxjs/toolkit';
import { User } from './permission';
import { LnbMenuItem } from './menu';
export interface AppState {
    accessToken: string;
    user: User | null;
}
export interface UiState {
    globalLoadingTitle: string;
    service: string;
    selectedGnb: string;
}
export interface RecentMenu {
    id: string;
    pathname: string;
    search: string;
    title: string;
    service?: string;
    state?: unknown;
    data?: unknown;
}
export interface HostRootState {
    app: AppState;
    ui: UiState;
    recentMenu: {
        list: RecentMenu[];
        currentId: string;
        maxTabs?: number;
    };
    menu?: {
        gnbItems: LnbMenuItem[];
        lnbItems: LnbMenuItem[];
        selectedGnbId: string;
        selectedLnbId: string;
        expandedIds: string[];
        isLoading: boolean;
    };
    [key: string]: unknown;
}
export type InjectReducerFn = (key: string, reducer: Reducer) => void;
//# sourceMappingURL=app-state.d.ts.map