import { createSlice } from '@reduxjs/toolkit';
const initialUiState = {
    globalLoadingTitle: '',
    service: '',
    selectedGnb: '',
};
export const uiSlice = createSlice({
    name: 'ui',
    initialState: initialUiState,
    reducers: {
        setGlobalLoadingTitle: (state, action) => {
            state.globalLoadingTitle = action.payload;
        },
        setService: (state, action) => {
            state.service = action.payload;
        },
        setSelectedGnb: (state, action) => {
            state.selectedGnb = action.payload;
        },
    },
});
export const { setGlobalLoadingTitle, setService, setSelectedGnb } = uiSlice.actions;
export const selectGlobalLoadingTitle = (state) => state.ui.globalLoadingTitle;
export const selectService = (state) => state.ui.service;
export const selectAppSelectedGnb = (state) => state.ui.selectedGnb;
