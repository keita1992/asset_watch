import { Grid } from "@mui/material";
import { useEffect } from "react";


import { ProfileForm } from "@/features/profile/components/ProfileForm";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsUserFetched, fetchUser } from "@/store/user";

export default function Profile() {
  const dispatch = useAppDispatch();
  const isFetched = useAppSelector(selectIsUserFetched);

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchUser());
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
