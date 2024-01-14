import { RootState } from '@/store';

export const selectIsProfileFetched = (state: RootState) => state.profile.isProfileFetched;
export const selectProfile = (state: RootState) => state.profile.profile;

