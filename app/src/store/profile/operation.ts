import * as actions from './action';
import * as types from './type';

import { axios } from '@/libs/axios';
import { AppDispatch } from '@/store';

export const fetchProfile = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<types.Profile>('/api/profile');
      if (response.status === 200) {
        const profile = response.data;
        dispatch(actions.setProfile({ ...profile }));
        dispatch(actions.setIsProfileFetched(true));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export const editProfile = (data: types.Request) => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.patch<types.Profile>(`/api/profile`, data);
      if (response.status === 200) {
        const editedProfile = response.data;
        dispatch(actions.setProfile(editedProfile));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
