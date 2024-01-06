import * as types from './type';

export const SET_IS_PROFILES_FETCHED = 'SET_IS_PROFILES_FETCHED' as const;
export const SET_PROFILES = 'SET_PROFILES' as const;

export const setIsProfilesFetched = (payload: types.IsProfilesFetched) => ({
  type: SET_IS_PROFILES_FETCHED,
  payload,
});

export const setProfiles = (payload: types.NormalizedProfiles) => ({
  type: SET_PROFILES,
  payload,
});

export type Actions =
  | ReturnType<typeof setIsProfilesFetched>
  | ReturnType<typeof setProfiles>;
