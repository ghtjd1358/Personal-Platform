/**
 * Recent Menu Slice
 * 최근 방문 메뉴 상태 관리 (탭)
 */

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RecentMenu } from '../types';
import { storage } from '../utils/storage';

// ============================================
// 타입 정의
// ============================================

export interface RecentMenuState {
  /** 최근 메뉴 목록 */
  list: RecentMenu[];
  /** 현재 활성 메뉴 ID */
  currentId: string;
  /** 최대 탭 개수 */
  maxTabs: number;
}

const initialState: RecentMenuState = {
  list: [],
  currentId: '',
  maxTabs: 10,
};

// ============================================
// Slice
// ============================================

export const recentMenuSlice = createSlice({
  name: 'recentMenu',
  initialState,
  reducers: {
    /** 최근 메뉴 목록 설정 (복구용) */
    setRecentMenuList: (state, action: PayloadAction<RecentMenu[]>) => {
      state.list = action.payload;
    },

    /** 최근 메뉴 추가/업데이트 */
    addRecentMenu: (state, action: PayloadAction<RecentMenu>) => {
      const newMenu = action.payload;
      const existingIndex = state.list.findIndex((m) => m.id === newMenu.id);

      if (existingIndex >= 0) {
        // 이미 존재하면 업데이트
        state.list[existingIndex] = {
          ...state.list[existingIndex],
          ...newMenu,
        };
      } else {
        // 새로 추가
        if (state.list.length >= state.maxTabs) {
          // 최대 개수 초과 시 가장 오래된 것 제거 (현재 활성 제외)
          const oldestIndex = state.list.findIndex((m) => m.id !== state.currentId);
          if (oldestIndex >= 0) {
            state.list.splice(oldestIndex, 1);
          }
        }
        state.list.push(newMenu);
      }

      // 현재 메뉴로 설정
      state.currentId = newMenu.id;

      // localStorage에 저장
      storage.setRecentMenu(state.list);
    },

    /** 최근 메뉴 제거 */
    removeRecentMenu: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.list.findIndex((m) => m.id === id);

      if (index >= 0) {
        state.list.splice(index, 1);

        // 현재 메뉴가 제거되면 다른 메뉴로 전환
        if (state.currentId === id) {
          // 이전 또는 다음 메뉴로 전환
          const newCurrent = state.list[Math.max(0, index - 1)];
          state.currentId = newCurrent?.id || '';
        }

        // localStorage에 저장
        storage.setRecentMenu(state.list);
      }
    },

    /** 현재 메뉴 변경 */
    setCurrentRecentMenu: (state, action: PayloadAction<string>) => {
      state.currentId = action.payload;
    },

    /** 메뉴 상태 업데이트 (스크롤 위치, 검색 조건 등) */
    updateRecentMenuState: (
      state,
      action: PayloadAction<{ id: string; state?: any; data?: any }>
    ) => {
      const { id, state: menuState, data } = action.payload;
      const menu = state.list.find((m) => m.id === id);

      if (menu) {
        if (menuState !== undefined) menu.state = menuState;
        if (data !== undefined) menu.data = data;

        // localStorage에 저장
        storage.setRecentMenu(state.list);
      }
    },

    /** 모든 최근 메뉴 제거 */
    clearRecentMenu: (state) => {
      state.list = [];
      state.currentId = '';
      storage.setRecentMenu([]);
    },

    /** 현재 메뉴 외 모든 메뉴 제거 */
    closeOtherMenus: (state) => {
      const currentMenu = state.list.find((m) => m.id === state.currentId);
      state.list = currentMenu ? [currentMenu] : [];
      storage.setRecentMenu(state.list);
    },

    /** 최대 탭 개수 설정 */
    setMaxTabs: (state, action: PayloadAction<number>) => {
      state.maxTabs = action.payload;
    },
  },
});

export const {
  setRecentMenuList,
  addRecentMenu,
  removeRecentMenu,
  setCurrentRecentMenu,
  updateRecentMenuState,
  clearRecentMenu,
  closeOtherMenus,
  setMaxTabs,
} = recentMenuSlice.actions;

// ============================================
// Selectors (createSelector 활용)
// ============================================

interface RootStateWithRecentMenu {
  recentMenu: RecentMenuState;
}

// 기본 Selectors
export const selectRecentMenuState = (state: RootStateWithRecentMenu) => state.recentMenu;
export const selectRecentMenuList = (state: RootStateWithRecentMenu) => state.recentMenu.list;
export const selectCurrentRecentMenuId = (state: RootStateWithRecentMenu) => state.recentMenu.currentId;

// 파생 Selectors (Memoized)
export const selectCurrentRecentMenu = createSelector(
  [selectRecentMenuList, selectCurrentRecentMenuId],
  (list, currentId) => list.find((m) => m.id === currentId) || null
);

export const selectRecentMenuCount = createSelector(
  [selectRecentMenuList],
  (list) => list.length
);

export const selectHasRecentMenu = createSelector(
  [selectRecentMenuList],
  (list) => list.length > 0
);

export default recentMenuSlice.reducer;