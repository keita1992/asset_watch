import { Grid } from "@mui/material";
import { useEffect } from "react";

import { AddButton } from "@/features/manage/components/AddButton";
import { AssetForm } from "@/features/manage/components/AssetForm";
import { AssetTable } from "@/features/manage/components/AssetTable";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAssetsFetched } from "@/store/asset";
import { fetchAssets } from "@/store/asset/operation";

export default function Manage() {
  const dispatch = useAppDispatch();
  const isFetched = useAppSelector(selectIsAssetsFetched);

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchAssets());
    }
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h1>資産一覧(日本円現金を除く)</h1>
      </Grid>
      <Grid item xs={12}>
        <AddButton />
      </Grid>
      <Grid item xs={12}>
        <AssetTable />
      </Grid>
      <Grid item xs={12}>
        <AssetForm />
      </Grid>
    </Grid>
  )
}
