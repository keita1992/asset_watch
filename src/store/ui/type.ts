export type AssetId = string | null;
export type IsAssetModalOpen = boolean;
export type IsSnackbarOpen = boolean;
export type SnackbarMessage = string;
export type SnackbarSeverity = "success" | "info" | "warning" | "error";
export type SnackbarDuration = number;

export type State = {
  assetId: AssetId;
  isAssetModalOpen: IsAssetModalOpen;
  isSnackbarOpen: IsSnackbarOpen;
  snackbarMessage: SnackbarMessage;
  snackbarSeverity: SnackbarSeverity;
  snackbarDuration: SnackbarDuration;
};
