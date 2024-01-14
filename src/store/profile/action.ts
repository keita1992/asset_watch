import * as types from './type';

export const SET_IS_PROFILE_FETCHED = 'SET_IS_PROFILE_FETCHED' as const;
export const SET_PROFILE = 'SET_PROFILE' as const;

export const setIsProfileFetched = (payload: types.IsProfileFetched) => ({
  type: SET_IS_PROFILE_FETCHED,
  payload,
});

export const setProfile = (payload: types.Profile) => ({
  type: SET_PROFILE,
  payload,
});

export type Actions =
  | ReturnType<typeof setIsProfileFetched>
  | ReturnType<typeof setProfile>;
