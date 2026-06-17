import { PayloadAction } from '@reduxjs/toolkit';
import { UiState } from '../types';
export declare const uiSlice: import("@reduxjs/toolkit").Slice<UiState, {
    setGlobalLoadingTitle: (state: {
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<string>) => void;
    setService: (state: {
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<string>) => void;
    setSelectedGnb: (state: {
        globalLoadingTitle: string;
        service: string;
        selectedGnb: string;
    }, action: PayloadAction<string>) => void;
}, "ui", "ui", import("@reduxjs/toolkit").SliceSelectors<UiState>>;
export declare const setGlobalLoadingTitle: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "ui/setGlobalLoadingTitle">, setService: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "ui/setService">, setSelectedGnb: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "ui/setSelectedGnb">;
export declare const selectGlobalLoadingTitle: (state: {
    ui: UiState;
}) => string;
export declare const selectService: (state: {
    ui: UiState;
}) => string;
export declare const selectAppSelectedGnb: (state: {
    ui: UiState;
}) => string;
//# sourceMappingURL=ui-slice.d.ts.map