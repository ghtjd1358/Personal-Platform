import { createSlice } from '@reduxjs/toolkit';
const initialAppState = {
    accessToken: '',
    user: null,
    sessionRestoring: true,
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
        setSessionRestoring: (state, action) => {
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
export const selectAppState = (state) => state.app;
export const selectAccessToken = (state) => state.app.accessToken;
export const selectUser = (state) => state.app.user;
export const selectSessionRestoring = (state) => state.app.sessionRestoring;
