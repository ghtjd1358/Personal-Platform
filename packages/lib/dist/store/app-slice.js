import { createSlice } from '@reduxjs/toolkit';
const initialAppState = {
    accessToken: '',
    user: null,
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
        logout: (state) => {
            state.accessToken = '';
            state.user = null;
        },
    },
});
export const { setAccessToken, setUser, logout } = appSlice.actions;
export const selectAppState = (state) => state.app;
export const selectAccessToken = (state) => state.app.accessToken;
export const selectUser = (state) => state.app.user;
