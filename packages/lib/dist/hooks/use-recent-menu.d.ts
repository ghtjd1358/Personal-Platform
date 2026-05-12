/**
 * useRecentMenu Hook
 * 최근 방문 메뉴 상태 저장/복구
 */
import { RecentMenu } from '../types';
export interface UseRecentMenuOptions {
    /** 자동으로 현재 경로를 최근 메뉴에 추가할지 여부 */
    autoTrack?: boolean;
    /** 제외할 경로 패턴 */
    excludePaths?: (string | RegExp)[];
    /** 메뉴 제목 생성 함수 */
    getTitleFromPath?: (pathname: string) => string;
}
/**
 * useRecentMenu Hook
 */
export declare function useRecentMenu(options?: UseRecentMenuOptions): {
    /** 최근 메뉴 목록 */
    list: RecentMenu[];
    /** 현재 활성 메뉴 */
    current: RecentMenu | null;
    /** 현재 활성 메뉴 ID */
    currentId: string;
    /** 메뉴 추가 */
    add: (menu: Omit<RecentMenu, "id"> & {
        id?: string;
    }) => void;
    /** 메뉴 제거 */
    remove: (id: string) => void;
    /** 현재 메뉴 설정 */
    setCurrent: (id: string) => void;
    /** 메뉴로 이동 */
    goTo: (id: string) => void;
    /** 메뉴 상태 업데이트 */
    updateState: (id: string, state: any) => void;
    /** 메뉴 데이터 업데이트 */
    updateData: (id: string, data: any) => void;
    /** 현재 메뉴 상태 업데이트 */
    updateCurrentState: (state: any) => void;
    /** 모든 메뉴 닫기 */
    closeAll: () => void;
    /** 다른 메뉴 모두 닫기 */
    closeOthers: () => void;
};
export default useRecentMenu;
//# sourceMappingURL=use-recent-menu.d.ts.map