
import { FormControlLabel, Grid, Switch } from "@mui/material";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Panel } from "@/components/elements/Panel";

import { AllAssetsPieChart } from "@/features/dashboard/components/AllAssetsPieChart";
import { AssetBarChart } from "@/features/dashboard/components/AssetBarChart";
import { CategoryDetailPieChart } from "@/features/dashboard/components/CategoryDetailPieChart";
import { CurrencyDetailPieChart } from "@/features/dashboard/components/CurrencyDetailPieChart";
import { IndicatorPanel } from "@/features/dashboard/components/IndicatorPanel";

import { axios } from "@/libs/axios";
import { AssetGroupedByCurrency, AssetsData, AssetsGroupedByCategory, AssetsGroupedByCategoryResponse, AssetsGroupedByCurrencyResponse } from "@/store/asset/type";

type Props = {
  assetsGroupedByCategory: AssetsGroupedByCategory;
  assetsGroupedByCurrency: AssetGroupedByCurrency;
  assetsGroupedByCategoryWithoutEmergencyFund: AssetsGroupedByCategory;
  assetsGroupedByCurrencyWithoutEmergencyFund: AssetGroupedByCurrency;
  assets: AssetsData;
  assetsWithoutEmergencyFund: AssetsData;
};

// x-charts は SSR に対応していないため、CSR でのみ表示する
const CategoryPieChart = dynamic(
  () => import('@/features/dashboard/components/CategoryPieChart').then((mod) => mod.CategoryPieChart),
  { ssr: false }
);

const CurrencyPieChart = dynamic(
  () => import('@/features/dashboard/components/CurrencyPieChart').then((mod) => mod.CurrencyPieChart),
  { ssr: false }
);

export const Dashboard = ({
  assetsGroupedByCategory,
  assetsGroupedByCurrency,
  assetsGroupedByCategoryWithoutEmergencyFund,
  assetsGroupedByCurrencyWithoutEmergencyFund,
  assets,
  assetsWithoutEmergencyFund
}: Props) => {
  const [checked, setChecked] = useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch defaultChecked onChange={handleChange} />}
          label="生活防衛資金を除く"
        />
      </Grid>
      {checked ? (
        <>
          <Grid item xs={5}>
            <Panel title="重要指標" paperProps={{ textAlign: 'center' }} boxProps={{ justifyContent: 'center' }} >
              <IndicatorPanel data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={7}>
            <Panel title="資産額" paperProps={{ textAlign: 'center' }}>
              <AssetBarChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={4}>
            <Panel title="全資産" paperProps={{ textAlign: 'center' }}>
              <AllAssetsPieChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={4}>
            <Panel title="資産クラス" paperProps={{ textAlign: 'center' }}>
              <CategoryPieChart data={assetsGroupedByCategoryWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={4}>
            <Panel title="通貨" paperProps={{ textAlign: 'center' }}>
              <CurrencyPieChart data={assetsGroupedByCurrencyWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={5}>
            <Panel title="資産クラス別内訳" paperProps={{ textAlign: 'center' }}>
              <CategoryDetailPieChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={5}>
            <Panel title="通貨別内訳" paperProps={{ textAlign: 'center' }}>
              <CurrencyDetailPieChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={5}>
            <Panel title="重要指標" paperProps={{ textAlign: 'center' }} boxProps={{ justifyContent: 'center' }} >
              <IndicatorPanel data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={7}>
            <Panel title="資産額" paperProps={{ textAlign: 'center' }}>
              <AssetBarChart data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={4}>
            <Panel title="全資産" paperProps={{ textAlign: 'center' }}>
              <AllAssetsPieChart data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={4}>
            <Panel title="資産クラス" paperProps={{ textAlign: 'center' }}>
              <CategoryPieChart data={assetsGroupedByCategory} />
            </Panel>
          </Grid>
          <Grid item xs={4}>
            <Panel title="通貨" paperProps={{ textAlign: 'center' }}>
              <CurrencyPieChart data={assetsGroupedByCurrency} />
            </Panel>
          </Grid>
          <Grid item xs={5}>
            <Panel title="資産クラス別内訳" paperProps={{ textAlign: 'center' }}>
              <CategoryDetailPieChart data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={5}>
            <Panel title="通貨別内訳" paperProps={{ textAlign: 'center' }}>
              <CurrencyDetailPieChart data={assets} />
            </Panel>
          </Grid>
        </>
      )}
    </Grid >
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const assetsGroupedByCategory = await getAssetsGroupedByCategory();
    const assetsGroupedByCategoryWithoutEmergencyFund = await getAssetsGroupedByCategoryWithoutEmergencyFund();
    const assetsGroupedByCurrency = await getAssetsGroupedByCurrency();
    const assetsGroupedByCurrencyWithoutEmergencyFund = await getAssetsGroupedByCurrencyWithoutEmergencyFund();
    const assets = await getAssets();
    const assetsWithoutEmergencyFund = await getAssetsWithoutEmergencyFund();
    return {
      props: {
        assetsGroupedByCategory,
        assetsGroupedByCurrency,
        assetsGroupedByCategoryWithoutEmergencyFund,
        assetsGroupedByCurrencyWithoutEmergencyFund,
        assets,
        assetsWithoutEmergencyFund
      }
    }
  } catch (e) {
    return {
      props: { assetsGroupedByCategories: [] }
    }
  }
}

// カテゴリごとの資産
const getAssetsGroupedByCategory = async () => {
  const res = await axios.get<AssetsGroupedByCategoryResponse>('/api/assets/grouped-by-category');
  return res.data.assets;
}

// 通貨ごとの資産
const getAssetsGroupedByCurrency = async () => {
  const res = await axios.get<AssetsGroupedByCurrencyResponse>('/api/assets/grouped-by-currency');
  return res.data.assets;
}

// 資産
const getAssets = async () => {
  const res = await axios.get('/api/assets/all');
  return res.data.assets;
}

// カテゴリごとの資産（緊急時資金を除く）
const getAssetsGroupedByCategoryWithoutEmergencyFund = async () => {
  const res = await axios.get<AssetsGroupedByCategoryResponse>('/api/assets/grouped-by-category', {
    params: {
      excludeEmergencyFund: true
    }
  });
  return res.data.assets;
}

// 通貨ごとの資産（緊急時資金を除く）
const getAssetsGroupedByCurrencyWithoutEmergencyFund = async () => {
  const res = await axios.get<AssetsGroupedByCurrencyResponse>('/api/assets/grouped-by-currency', {
    params: {
      excludeEmergencyFund: true
    }
  });
  return res.data.assets;
}

const getAssetsWithoutEmergencyFund = async () => {
  const res = await axios.get('/api/assets/all', {
    params: {
      excludeEmergencyFund: true
    }
  });
  return res.data.assets;
}


export default Dashboard;