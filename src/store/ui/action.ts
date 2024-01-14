import * as types from './type';

export const SET_ASSET_ID = 'SET_ASSET_ID' as const;
export const SET_IS_ASSET_MODAL_OPEN = 'SET_IS_ASSET_MODAL_OPEN' as const;
export const SET_IS_SNACKBAR_OPEN = 'SET_IS_SNACKBAR_OPEN' as const;
export const SET_SNACKBAR_MESSAGE = 'SET_SNACKBAR_MESSAGE' as const;
export const SET_SNACKBAR_SEVERITY = 'SET_SNACKBAR_SEVERITY' as const;
export const SET_SNACKBAR_DURATION = 'SET_SNACKBAR_DURATION' as const;

export const setAssetId = (payload: types.AssetId) => ({
  type: SET_ASSET_ID,
  payload,
});

export const setIsAssetModalOpen = (payload: types.IsAssetModalOpen) => ({
  type: SET_IS_ASSET_MODAL_OPEN,
  payload,
});

export const setIsSnackbarOpen = (payload: types.IsSnackbarOpen) => ({
  type: SET_IS_SNACKBAR_OPEN,
  payload,
});

export const setSnackbarMessage = (payload: types.SnackbarMessage) => ({
  type: SET_SNACKBAR_MESSAGE,
  payload,
});

export const setSnackbarSeverity = (payload: types.SnackbarSeverity) => ({
  type: SET_SNACKBAR_SEVERITY,
  payload,
});

export const setSnackbarDuration = (payload: types.SnackbarDuration) => ({
  type: SET_SNACKBAR_DURATION,
  payload,
});

export type Actions =
  | ReturnType<typeof setAssetId>
  | ReturnType<typeof setIsAssetModalOpen>
  | ReturnType<typeof setIsSnackbarOpen>
  | ReturnType<typeof setSnackbarMessage>
  | ReturnType<typeof setSnackbarSeverity>
  | ReturnType<typeof setSnackbarDuration>;
