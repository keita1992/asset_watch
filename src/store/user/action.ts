import * as types from "./type";

export const SET_IS_USER_FETCHED = "SET_IS_USER_FETCHED" as const;
export const SET_USER = "SET_USER" as const;

export const setIsUserFetched = (payload: types.IsUserFetched) => ({
  type: SET_IS_USER_FETCHED,
  payload,
});

export const setUser = (payload: types.User) => ({
  type: SET_USER,
  payload,
});

export type Actions =
  | ReturnType<typeof setIsUserFetched>
  | ReturnType<typeof setUser>;
