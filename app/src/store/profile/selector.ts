import { RootState } from '@/store';

export const selectIsProfilesFetched = (state: RootState) => state.profile.isProfilesFetched;
export const selectProfiles = (state: RootState) => state.profile.profiles;

