import * as actions from "./action";
import * as types from "./type";

import { axios } from "@/libs/axios";
import { AppDispatch } from "@/store";
import { USER_ID } from "@/utils/constants";

export const fetchUser = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<types.User>(`/api/users/${USER_ID}`);
      if (response.status === 200) {
        const user = response.data;
        dispatch(actions.setUser({ ...user }));
        dispatch(actions.setIsUserFetched(true));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const editUser = (data: types.Request) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.patch<types.User>(
        `/api/users/${USER_ID}`,
        data
      );
      if (response.status === 200) {
        const editedUser = response.data;
        dispatch(actions.setUser(editedUser));
      }
    } catch (error) {
      console.error(error);
    }
  };
};
