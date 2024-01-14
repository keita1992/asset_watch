import { Actions } from "./action";
import { State } from "./type";

const initState: State = {
  assetId: null,
  isAssetModalOpen: false,
  isSnackbarOpen: false,
  snackbarMessage: "",
  snackbarSeverity: "success",
  snackbarDuration: 3000,
};

export const uiReducer = (state = initState, action: Actions) => {
  switch (action.type) {
    case "SET_ASSET_ID":
      return {
        ...state,
        assetId: action.payload,
      };
    case "SET_IS_ASSET_MODAL_OPEN":
      return {
        ...state,
        isAssetModalOpen: action.payload,
      };
    case "SET_IS_SNACKBAR_OPEN":
      return {
        ...state,
        isSnackbarOpen: action.payload,
      };
    case "SET_SNACKBAR_MESSAGE":
      return {
        ...state,
        snackbarMessage: action.payload,
      };
    case "SET_SNACKBAR_SEVERITY":
      return {
        ...state,
        snackbarSeverity: action.payload,
      };
    case "SET_SNACKBAR_DURATION":
      return {
        ...state,
        snackbarDuration: action.payload,
      };
    default:
      return state;
  }
}