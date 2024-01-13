import { Grid } from "@mui/material";
import { useEffect } from "react";


import { ProfileForm } from "@/features/profile/components/ProfileForm";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsProfileFetched, fetchProfile } from "@/store/profile";

export const Manage = () => {
  const dispatch = useAppDispatch();
  const isFetched = useAppSelector(selectIsProfileFetched);

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchProfile());
    }
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>プロフィール</h1>
      </Grid>
      {isFetched && (
        <Grid item xs={12}>
          <ProfileForm />
        </Grid>
      )}
    </Grid>
  )
}

export default Manage;