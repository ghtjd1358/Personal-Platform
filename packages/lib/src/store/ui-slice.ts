import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiState } from '../types';

const initialUiState: UiState = {
    globalLoadingTitle: '',
    service: '',
    selectedGnb: '',
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState: initialUiState,
    reducers: {
        setGlobalLoadingTitle: (state, action: PayloadAction<string>) => {
            state.globalLoadingTitle = action.payload;
        },
        setService: (state, action: PayloadAction<string>) => {
            state.service = action.payload;
        },
        setSelectedGnb: (state, action: PayloadAction<string>) => {
            state.selectedGnb = action.payload;
        },
    },
});

export const { setGlobalLoadingTitle, setService, setSelectedGnb } = uiSlice.actions;

export const selectGlobalLoadingTitle = (state: { ui: UiState }) => state.ui.globalLoadingTitle;
export const selectService = (state: { ui: UiState }) => state.ui.service;
export const selectAppSelectedGnb = (state: { ui: UiState }) => state.ui.selectedGnb;
