import { Actions } from "./action";
import { State } from "./type";

const initState: State = {
  isAssetsFetched: false,
  assets: {},
};

export const assetReducer = (state = initState, action: Actions) => {
  switch (action.type) {
    case "SET_IS_ASSETS_FETCHED":
      return {
        ...state,
        isAssetsFetched: action.payload,
      };
    case "SET_ASSETS":
      return {
        ...state,
        assets: action.payload,
      };
    default:
      return state;
  }
}