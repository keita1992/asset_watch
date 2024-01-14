import * as types from './type';

export const SET_IS_ASSETS_FETCHED = 'SET_IS_ASSETS_FETCHED' as const;
export const SET_ASSETS = 'SET_ASSETS' as const;

export const setIsAssetsFetched = (payload: types.IsAssetsFetched) => ({
  type: SET_IS_ASSETS_FETCHED,
  payload,
});

export const setAssets = (payload: types.NormalizedAssets) => ({
  type: SET_ASSETS,
  payload,
});

export type Actions = ReturnType<typeof setIsAssetsFetched> | ReturnType<typeof setAssets>;