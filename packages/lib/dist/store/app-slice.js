/**
 * App Slice — 인증/사용자/UI 상태
 *
 * Access Token / User 는 메모리(Redux)에만 저장.
 * 새로고침 시 Refresh Token(HttpOnly Cookie) 으로 재발급.
 */
import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
const initialAppState = {
    accessToken: '',
    user: null,
    globalLoadingTitle: '',
    service: '',
    selectedGnb: '',
};
export const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setGlobalLoadingTitle: (state, action) => {
            state.globalLoadingTitle = action.payload;
        },
        setService: (state, action) => {
            state.service = action.payload;
        },
        setSelectedGnb: (state, action) => {
            state.selectedGnb = action.payload;
        },
        logout: (state) => {
            state.accessToken = '';
            state.user = null;
            storage.clearAuth();
        },
    },
});
export const { setAccessToken, setUser, setGlobalLoadingTitle, setService, setSelectedGnb, logout, } = appSlice.actions;
// 기본 셀렉터 (단일 필드 직접 조회 — memoization 불필요)
export const selectAppState = (state) => state.app;
export const selectAccessToken = (state) => state.app.accessToken;
export const selectUser = (state) => state.app.user;
export const selectGlobalLoadingTitle = (state) => state.app.globalLoadingTitle;
export const selectService = (state) => state.app.service;
export const selectAppSelectedGnb = (state) => state.app.selectedGnb;
