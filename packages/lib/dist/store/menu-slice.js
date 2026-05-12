/**
 * Menu Slice
 * 메뉴 상태 관리 (GNB, LNB, 선택 상태)
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';
const initialState = {
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
        setGnbItems: (state, action) => {
            state.gnbItems = action.payload;
        },
        setLnbItems: (state, action) => {
            state.lnbItems = action.payload;
        },
        setSelectedGnbId: (state, action) => {
            state.selectedGnbId = action.payload;
        },
        setSelectedLnbId: (state, action) => {
            state.selectedLnbId = action.payload;
        },
        setExpandedIds: (state, action) => {
            state.expandedIds = action.payload;
        },
        toggleExpanded: (state, action) => {
            const id = action.payload;
            const index = state.expandedIds.indexOf(id);
            if (index >= 0) {
                state.expandedIds.splice(index, 1);
            }
            else {
                state.expandedIds.push(id);
            }
        },
        setMenuLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        resetMenu: () => initialState,
    },
});
export const { setGnbItems, setLnbItems, setSelectedGnbId, setSelectedLnbId, setExpandedIds, toggleExpanded, setMenuLoading, resetMenu, } = menuSlice.actions;
// 기본 Selectors
export const selectMenuState = (state) => state.menu;
export const selectGnbItems = (state) => state.menu.gnbItems;
export const selectLnbItems = (state) => state.menu.lnbItems;
export const selectSelectedGnbId = (state) => state.menu.selectedGnbId;
export const selectSelectedLnbId = (state) => state.menu.selectedLnbId;
export const selectExpandedIds = (state) => state.menu.expandedIds;
export const selectMenuLoading = (state) => state.menu.isLoading;
// 파생 Selectors (Memoized)
export const selectSelectedGnb = createSelector([selectGnbItems, selectSelectedGnbId], (gnbItems, selectedId) => gnbItems.find((item) => item.id === selectedId) || null);
export const selectSelectedLnb = createSelector([selectLnbItems, selectSelectedLnbId], (lnbItems, selectedId) => {
    // 중첩 메뉴에서 찾기
    const findItem = (items) => {
        for (const item of items) {
            if (item.id === selectedId)
                return item;
            if (item.children) {
                const found = findItem(item.children);
                if (found)
                    return found;
            }
        }
        return null;
    };
    return findItem(lnbItems);
});
// 현재 경로의 breadcrumb 계산
export const selectBreadcrumb = createSelector([selectLnbItems, selectSelectedLnbId], (lnbItems, selectedId) => {
    const breadcrumb = [];
    const findPath = (items, path = []) => {
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
});
export default menuSlice.reducer;
