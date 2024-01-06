import { Actions } from "./action";
import { State } from "./type";

const initState: State = {
  isProfilesFetched: false,
  profiles: {},
};

export const profileReducer = (state = initState, action: Actions) => {
  switch (action.type) {
    case "SET_IS_PROFILES_FETCHED":
      return {
        ...state,
        isProfilesFetched: action.payload,
      };
    case "SET_PROFILES":
      return {
        ...state,
        profiles: action.payload,
      };
    default:
      return state;
  }
}