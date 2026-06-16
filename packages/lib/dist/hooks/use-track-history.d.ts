/**
 * Track History Hook
 * 라우팅 변경 감지 및 자동 탭(Recent Menu) 관리
 */
import { RecentMenu } from '../types';
export interface LnbItem {
    title: string;
    link: string;
    searchStr?: string;
    children?: LnbItem[];
}
export interface TrackHistoryOptions {
    lnbItems: LnbItem[];
    excludePaths?: string[];
    onPageView?: (pathname: string) => void;
}
/**
 * Track History Hook
 */
export declare function useTrackHistory(options: TrackHistoryOptions): {
    loaded: boolean;
};
export declare function useRecentMenuState<D = unknown>(): {
    list: RecentMenu[];
    currentId: string;
    currentMenu: RecentMenu | undefined;
    data: D | undefined;
    state: unknown;
};
//# sourceMappingURL=use-track-history.d.ts.map