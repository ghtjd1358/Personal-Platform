import { createSlice } from '@reduxjs/toolkit';
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
        },
    },
});
export const { setAccessToken, setUser, setGlobalLoadingTitle, setService, setSelectedGnb, logout, } = appSlice.actions;
export const selectAppState = (state) => state.app;
export const selectAccessToken = (state) => state.app.accessToken;
export const selectUser = (state) => state.app.user;
export const selectGlobalLoadingTitle = (state) => state.app.globalLoadingTitle;
export const selectService = (state) => state.app.service;
export const selectAppSelectedGnb = (state) => state.app.selectedGnb;
