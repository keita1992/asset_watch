
import { FormControlLabel, Grid, Switch } from "@mui/material";
import { useEffect, useState } from "react";

import { Panel } from "@/components/elements/Panel";

import { AllAssetsPieChart } from "@/features/dashboard/components/AllAssetsPieChart";
import { AssetBarChart } from "@/features/dashboard/components/AssetBarChart";
import { CategoryDetailPieChart } from "@/features/dashboard/components/CategoryDetailPieChart";
import { CategoryPieChart } from "@/features/dashboard/components/CategoryPieChart";
import { CurrencyDetailPieChart } from "@/features/dashboard/components/CurrencyDetailPieChart";
import { CurrencyPieChart } from "@/features/dashboard/components/CurrencyPieChart";
import { IndicatorPanel } from "@/features/dashboard/components/IndicatorPanel";

import { axios } from "@/libs/axios";
import { AssetGroupedByCurrency, AssetsData, AssetsGroupedByCategory, AssetsGroupedByCategoryResponse, AssetsGroupedByCurrencyResponse } from "@/store/asset/type";

export const Dashboard = () => {
  const [checked, setChecked] = useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const [assetsGroupedByCategory, setAssetsGroupedByCategory] = useState<AssetsGroupedByCategory>([]);
  const [assetsGroupedByCurrency, setAssetsGroupedByCurrency] = useState<AssetGroupedByCurrency>([]);
  const [assetsGroupedByCategoryWithoutEmergencyFund, setAssetsGroupedByCategoryWithoutEmergencyFund] = useState<AssetsGroupedByCategory>([]);
  const [assetsGroupedByCurrencyWithoutEmergencyFund, setAssetsGroupedByCurrencyWithoutEmergencyFund] = useState<AssetGroupedByCurrency>([]);
  const [assets, setAssets] = useState<AssetsData>([]);
  const [assetsWithoutEmergencyFund, setAssetsWithoutEmergencyFund] = useState<AssetsData>([]);

  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const assetsGroupedByCategory = await getAssetsGroupedByCategory();
      const assetsGroupedByCategoryWithoutEmergencyFund = await getAssetsGroupedByCategoryWithoutEmergencyFund();
      const assetsGroupedByCurrency = await getAssetsGroupedByCurrency();
      const assetsGroupedByCurrencyWithoutEmergencyFund = await getAssetsGroupedByCurrencyWithoutEmergencyFund();
      const assets = await getAssets();
      const assetsWithoutEmergencyFund = await getAssetsWithoutEmergencyFund();

      setAssetsGroupedByCategory(assetsGroupedByCategory);
      setAssetsGroupedByCurrency(assetsGroupedByCurrency);
      setAssetsGroupedByCategoryWithoutEmergencyFund(assetsGroupedByCategoryWithoutEmergencyFund);
      setAssetsGroupedByCurrencyWithoutEmergencyFund(assetsGroupedByCurrencyWithoutEmergencyFund);
      setAssets(assets);
      setAssetsWithoutEmergencyFund(assetsWithoutEmergencyFund);
      setCanRender(true);
    }
    fetchData();
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={<Switch defaultChecked onChange={handleChange} />}
          label="生活防衛資金を除く"
        />
      </Grid>
      {(checked && canRender) && (
        <>
          <Grid item xs={12} lg={5}>
            <Panel title="重要指標" paperProps={{ textAlign: 'center' }} boxProps={{ justifyContent: 'center' }} >
              <IndicatorPanel data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={12} lg={7} >
            <Panel title="資産額" paperProps={{ textAlign: 'center' }}>
              <AssetBarChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Panel title="全資産" paperProps={{ textAlign: 'center' }}>
              <AllAssetsPieChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Panel title="資産クラス" paperProps={{ textAlign: 'center' }}>
              <CategoryPieChart data={assetsGroupedByCategoryWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Panel title="通貨" paperProps={{ textAlign: 'center' }}>
              <CurrencyPieChart data={assetsGroupedByCurrencyWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Panel title="資産クラス別内訳" paperProps={{ textAlign: 'center' }}>
              <CategoryDetailPieChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Panel title="通貨別内訳" paperProps={{ textAlign: 'center' }}>
              <CurrencyDetailPieChart data={assetsWithoutEmergencyFund} />
            </Panel>
          </Grid>
        </>
      )}
      {(!checked && canRender) && (
        <>
          <Grid item xs={12} lg={5}>
            <Panel title="重要指標" paperProps={{ textAlign: 'center' }} boxProps={{ justifyContent: 'center' }} >
              <IndicatorPanel data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={12} lg={7} >
            <Panel title="資産額" paperProps={{ textAlign: 'center' }}>
              <AssetBarChart data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Panel title="全資産" paperProps={{ textAlign: 'center' }}>
              <AllAssetsPieChart data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Panel title="資産クラス" paperProps={{ textAlign: 'center' }}>
              <CategoryPieChart data={assetsGroupedByCategory} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Panel title="通貨" paperProps={{ textAlign: 'center' }}>
              <CurrencyPieChart data={assetsGroupedByCurrency} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Panel title="資産クラス別内訳" paperProps={{ textAlign: 'center' }}>
              <CategoryDetailPieChart data={assets} />
            </Panel>
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <Panel title="通貨別内訳" paperProps={{ textAlign: 'center' }}>
              <CurrencyDetailPieChart data={assets} />
            </Panel>
          </Grid>
        </>
      )}
      {!canRender && (
        <Grid item>
          データを読み込んでいます...
        </Grid>
      )}
    </Grid >
  )
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