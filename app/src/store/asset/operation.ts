import * as actions from './action';
import * as types from './type';

import { axios } from '@/libs/axios';
import { AppDispatch, RootState } from '@/store';

export const fetchAssets = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<types.Asset[]>('/api/assets');
      if (response.status === 200) {
        const assets = response.data;
        const normalizedAssets: types.NormalizedAssets = {};
        assets.forEach((asset) => {
          normalizedAssets[asset.id] = asset;
        });
        dispatch(actions.setAssets(normalizedAssets));
        dispatch(actions.setIsAssetsFetched(true));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export const addAsset = (data: types.Request) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const response = await axios.post<types.Asset>('/api/assets', data);
      if (response.status === 201) {
        const newAsset = response.data;
        const assets = getState().asset.assets;
        const newAssets = { ...assets, [newAsset.id]: newAsset };
        dispatch(actions.setAssets(newAssets));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export const editAsset = (id: types.Id, data: types.Request) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const response = await axios.patch<types.Asset>(`/api/assets/${id}`, data);
      if (response.status === 200) {
        const editedAsset = response.data;
        const assets = getState().asset.assets;
        const newAssets = { ...assets, [editedAsset.id]: editedAsset };
        dispatch(actions.setAssets(newAssets));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export const deleteAsset = (id: types.Id) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const response = await axios.delete<types.Asset>(`/api/assets/${id}`);
      if (response.status === 200) {
        const deletedAsset = response.data;
        const assets = getState().asset.assets;
        const newAssets = { ...assets };
        delete newAssets[deletedAsset.id];
        
        dispatch(actions.setAssets(newAssets));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
