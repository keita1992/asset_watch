import { Actions } from "./action";
import { State } from "./type";

const initState: State = {
  isUserFetched: false,
  user: {
    id: "",
    name: "",
    netAssets: 0,
    liabilities: 0,
    emergencyFund: 0,
    createdAt: "",
    updatedAt: "",
  },
};

export const userReducer = (state = initState, action: Actions) => {
  switch (action.type) {
    case "SET_IS_USER_FETCHED":
      return {
        ...state,
        isUserFetched: action.payload,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};
