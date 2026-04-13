/**
 * Menu Slice
 * 메뉴 상태 관리 (GNB, LNB, 선택 상태)
 */

import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { MenuItem } from '../types';

// ============================================
// 타입 정의
// ============================================

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

const initialState: MenuState = {
  gnbItems: [],
  lnbItems: [],
  selectedGnbId: '',
  selectedLnbId: '',
  expandedIds: [],
  isLoading: false,
};

// ============================================
// Slice
// ============================================

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setGnbItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.gnbItems = action.payload;
    },
    setLnbItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.lnbItems = action.payload;
    },
    setSelectedGnbId: (state, action: PayloadAction<string>) => {
      state.selectedGnbId = action.payload;
    },
    setSelectedLnbId: (state, action: PayloadAction<string>) => {
      state.selectedLnbId = action.payload;
    },
    setExpandedIds: (state, action: PayloadAction<string[]>) => {
      state.expandedIds = action.payload;
    },
    toggleExpanded: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.expandedIds.indexOf(id);
      if (index >= 0) {
        state.expandedIds.splice(index, 1);
      } else {
        state.expandedIds.push(id);
      }
    },
    setMenuLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetMenu: () => initialState,
  },
});

export const {
  setGnbItems,
  setLnbItems,
  setSelectedGnbId,
  setSelectedLnbId,
  setExpandedIds,
  toggleExpanded,
  setMenuLoading,
  resetMenu,
} = menuSlice.actions;

// ============================================
// Selectors (createSelector 활용)
// ============================================

interface RootStateWithMenu {
  menu: MenuState;
}

// 기본 Selectors
export const selectMenuState = (state: RootStateWithMenu) => state.menu;
export const selectGnbItems = (state: RootStateWithMenu) => state.menu.gnbItems;
export const selectLnbItems = (state: RootStateWithMenu) => state.menu.lnbItems;
export const selectSelectedGnbId = (state: RootStateWithMenu) => state.menu.selectedGnbId;
export const selectSelectedLnbId = (state: RootStateWithMenu) => state.menu.selectedLnbId;
export const selectExpandedIds = (state: RootStateWithMenu) => state.menu.expandedIds;
export const selectMenuLoading = (state: RootStateWithMenu) => state.menu.isLoading;

// 파생 Selectors (Memoized)
export const selectSelectedGnb = createSelector(
  [selectGnbItems, selectSelectedGnbId],
  (gnbItems, selectedId) => gnbItems.find((item) => item.id === selectedId) || null
);

export const selectSelectedLnb = createSelector(
  [selectLnbItems, selectSelectedLnbId],
  (lnbItems, selectedId) => {
    // 중첩 메뉴에서 찾기
    const findItem = (items: MenuItem[]): MenuItem | null => {
      for (const item of items) {
        if (item.id === selectedId) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findItem(lnbItems);
  }
);

// 현재 경로의 breadcrumb 계산
export const selectBreadcrumb = createSelector(
  [selectLnbItems, selectSelectedLnbId],
  (lnbItems, selectedId): MenuItem[] => {
    const breadcrumb: MenuItem[] = [];

    const findPath = (items: MenuItem[], path: MenuItem[] = []): boolean => {
      for (const item of items) {
        const currentPath = [...path, item];
        if (item.id === selectedId) {
          breadcrumb.push(...currentPath);
          return true;
        }
        if (item.children && findPath(item.children, currentPath)) {
          return true;
        }
      }
      return false;
    };

    findPath(lnbItems);
    return breadcrumb;
  }
);

export default menuSlice.reducer;