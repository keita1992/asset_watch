import { RootState } from "@/store";

export const selectIsUserFetched = (state: RootState) =>
  state.user.isUserFetched;
export const selectUser = (state: RootState) => state.user.user;
