
import { Button, FormControlLabel, Grid, Switch } from "@mui/material";
import { GetServerSideProps } from "next";
import { useState } from "react";

import { Panel } from "@/components/elements/Panel";

import { AllAssetsPieChart } from "@/features/dashboard/components/AllAssetsPieChart";
import { AssetBarChart } from "@/features/dashboard/components/AssetBarChart";
import { CategoryDetailPieChart } from "@/features/dashboard/components/CategoryDetailPieChart";
import { CategoryPieChart } from "@/features/dashboard/components/CategoryPieChart";
import { CurrencyDetailPieChart } from "@/features/dashboard/components/CurrencyDetailPieChart";
import { CurrencyPieChart } from "@/features/dashboard/components/CurrencyPieChart";
import { IndicatorPanel } from "@/features/dashboard/components/IndicatorPanel";

import { axios } from "@/libs/axios";
import { AssetGroupedByCurrency, AssetsData, AssetsGroupedByCategory } from "@/store/asset/type";

interface DashboardData {
  assetsGroupedByCategory: AssetsGroupedByCategory;
  assetsGroupedByCurrency: AssetGroupedByCurrency;
  assetsGroupedByCategoryWithoutEmergencyFund: AssetsGroupedByCategory;
  assetsGroupedByCurrencyWithoutEmergencyFund: AssetGroupedByCurrency;
  assets: AssetsData;
  assetsWithoutEmergencyFund: AssetsData;
}

interface DashboardProps {
  initialData: DashboardData;
}

export const Dashboard = ({ initialData }: DashboardProps) => {
  const [checked, setChecked] = useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const [dashboardData, setDashboardData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  // リアルタイム更新用 - 必要に応じてデータを再取得
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<DashboardData>('/api/assets/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('データの更新に失敗しました:', error);
      // フォールバック: 従来の並列API呼び出し
      await refreshDataWithFallback();
    } finally {
      setIsLoading(false);
    }
  };

  // フォールバック用の並列データ取得
  const refreshDataWithFallback = async () => {
    try {
      const [
        assetsGroupedByCategory,
        assetsGroupedByCurrency,
        assetsGroupedByCategoryWithoutEmergencyFund,
        assetsGroupedByCurrencyWithoutEmergencyFund,
        assets,
        assetsWithoutEmergencyFund,
      ] = await Promise.all([
        axios.get('/api/assets/grouped-by-category').then(res => res.data.assets),
        axios.get('/api/assets/grouped-by-currency').then(res => res.data.assets),
        axios.get('/api/assets/grouped-by-category?excludeEmergencyFund=true').then(res => res.data.assets),
        axios.get('/api/assets/grouped-by-currency?excludeEmergencyFund=true').then(res => res.data.assets),
        axios.get('/api/assets/all').then(res => res.data.assets),
        axios.get('/api/assets/all?excludeEmergencyFund=true').then(res => res.data.assets),
      ]);

      setDashboardData({
        assetsGroupedByCategory,
        assetsGroupedByCurrency,
        assetsGroupedByCategoryWithoutEmergencyFund,
        assetsGroupedByCurrencyWithoutEmergencyFund,
        assets,
        assetsWithoutEmergencyFund,
      });
    } catch (error) {
      console.error('フォールバックデータ取得も失敗しました:', error);
    }
  };

  const {
    assetsGroupedByCategory,
    assetsGroupedByCurrency,
    assetsGroupedByCategoryWithoutEmergencyFund,
    assetsGroupedByCurrencyWithoutEmergencyFund,
    assets,
    assetsWithoutEmergencyFund,
  } = dashboardData;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container spacing={2} alignItems="center">
        <Grid item>
          <FormControlLabel
            control={<Switch defaultChecked onChange={handleChange} />}
            label="生活防衛資金を除く"
          />
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={refreshData} 
            disabled={isLoading}
          >
            {isLoading ? '更新中...' : 'データ更新'}
          </Button>
        </Grid>
      </Grid>
      {checked && (
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
      {!checked && (
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
      {isLoading && (
        <Grid item>
          データを更新しています...
        </Grid>
      )}
    </Grid >
  )
}

// サーバーサイドでデータを事前取得
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // ここで直接dashboard APIの処理を実行（HTTPリクエストを避ける）
    const { getDashboardData } = await import('../api/assets/dashboard');
    const initialData = await getDashboardData();

    return {
      props: {
        initialData,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    // エラー時は空のデータを返す
    const fallbackData: DashboardData = {
      assetsGroupedByCategory: [],
      assetsGroupedByCurrency: [],
      assetsGroupedByCategoryWithoutEmergencyFund: [],
      assetsGroupedByCurrencyWithoutEmergencyFund: [],
      assets: [],
      assetsWithoutEmergencyFund: [],
    };

    return {
      props: {
        initialData: fallbackData,
      },
    };
  }
};


export default Dashboard;