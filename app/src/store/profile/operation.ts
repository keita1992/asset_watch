import * as actions from './action';
import * as types from './type';

import { axios } from '@/libs/axios';
import { AppDispatch, RootState } from '@/store';

export const fetchProfiles = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const response = await axios.get<types.Profile[]>('/api/profiles');
      if (response.status === 200) {
        const profiles = response.data;
        const normalizedProfiles: types.NormalizedProfiles = {};
        profiles.forEach((profile) => {
          normalizedProfiles[profile.id] = profile;
        });
        dispatch(actions.setProfiles(normalizedProfiles));
        dispatch(actions.setIsProfilesFetched(true));
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export const editProfile = (id: types.Id, data: types.Request) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const response = await axios.patch<types.Profile>(`/api/profiles/${id}`, data);
      if (response.status === 200) {
        const editedProfile = response.data;
        const profiles = getState().profile.profiles;
        const newProfiles = { ...profiles, [editedProfile.id]: editedProfile };
        dispatch(actions.setProfiles(newProfiles));
      }
    } catch (error) {
      console.error(error);
    }
  }
}
