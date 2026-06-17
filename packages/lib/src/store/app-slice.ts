import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AppState } from '../types';

const initialAppState: AppState = {
    accessToken: '',
    user: null,
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
        logout: (state) => {
            state.accessToken = '';
            state.user = null;
        },
    },
});

export const { setAccessToken, setUser, logout } = appSlice.actions;

export const selectAppState = (state: { app: AppState }) => state.app;
export const selectAccessToken = (state: { app: AppState }) => state.app.accessToken;
export const selectUser = (state: { app: AppState }) => state.app.user;
