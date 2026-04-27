/**
 * App Slice — 인증/사용자/UI 상태
 *
 * Access Token / User 는 메모리(Redux)에만 저장.
 * 새로고침 시 Refresh Token(HttpOnly Cookie) 으로 재발급.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../utils/storage';
import { User, AppState } from '../types';

const initialAppState: AppState = {
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
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setGlobalLoadingTitle: (state, action: PayloadAction<string>) => {
            state.globalLoadingTitle = action.payload;
        },
        setService: (state, action: PayloadAction<string>) => {
            state.service = action.payload;
        },
        setSelectedGnb: (state, action: PayloadAction<string>) => {
            state.selectedGnb = action.payload;
        },
        logout: (state) => {
            state.accessToken = '';
            state.user = null;
            storage.clearAuth();
        },
    },
});

export const {
    setAccessToken,
    setUser,
    setGlobalLoadingTitle,
    setService,
    setSelectedGnb,
    logout,
} = appSlice.actions;

// 기본 셀렉터 (단일 필드 직접 조회 — memoization 불필요)
export const selectAppState = (state: { app: AppState }) => state.app;
export const selectAccessToken = (state: { app: AppState }) => state.app.accessToken;
export const selectUser = (state: { app: AppState }) => state.app.user;
export const selectGlobalLoadingTitle = (state: { app: AppState }) => state.app.globalLoadingTitle;
export const selectService = (state: { app: AppState }) => state.app.service;
export const selectAppSelectedGnb = (state: { app: AppState }) => state.app.selectedGnb;
