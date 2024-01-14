import { Actions } from "./action";
import { State } from "./type";

const initState: State = {
  isProfileFetched: false,
  profile: {
    netAssets: 0,
    liabilities: 0,
    emergencyFund: 0,
    createdAt: "",
    modifiedAt: "",
  }
};

export const profileReducer = (state = initState, action: Actions) => {
  switch (action.type) {
    case "SET_IS_PROFILE_FETCHED":
      return {
        ...state,
        isProfileFetched: action.payload,
      };
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,
      };
    default:
      return state;
  }
}