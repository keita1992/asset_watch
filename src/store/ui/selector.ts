import { RootState } from '@/store';

export const selectAssetId = (state: RootState) => state.ui.assetId;
export const selectIsAssetModalOpen = (state: RootState) => state.ui.isAssetModalOpen;
export const selectIsSnackbarOpen = (state: RootState) => state.ui.isSnackbarOpen;
export const selectSnackbarMessage = (state: RootState) => state.ui.snackbarMessage;
export const selectSnackbarSeverity = (state: RootState) => state.ui.snackbarSeverity;
export const selectSnackbarDuration = (state: RootState) => state.ui.snackbarDuration;

