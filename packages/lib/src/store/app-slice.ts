import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AppState } from '../types';

const initialAppState: AppState = {
    accessToken: '',
    user: null,
    sessionRestoring: true,
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
        setSessionRestoring: (state, action: PayloadAction<boolean>) => {
            state.sessionRestoring = action.payload;
        },
        logout: (state) => {
            state.accessToken = '';
            state.user = null;
            state.sessionRestoring = false;
        },
    },
});

export const { setAccessToken, setUser, setSessionRestoring, logout } = appSlice.actions;

export const selectAppState = (state: { app: AppState }) => state.app;
export const selectAccessToken = (state: { app: AppState }) => state.app.accessToken;
export const selectUser = (state: { app: AppState }) => state.app.user;
export const selectSessionRestoring = (state: { app: AppState }) => state.app.sessionRestoring;
