import { FormControl, MenuItem, Select } from '@mui/material';
import { DefaultizedPieValueType } from '@mui/x-charts';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import * as React from 'react';

import { AssetsData, Category } from '@/store/asset';
import { getColors } from '@/utils/color';
import { decimalToPercent } from '@/utils/formatter';

type Props = {
  data: AssetsData;
}

export const CategoryDetailPieChart = ({ data }: Props) => {
  const [category, setCategory] = React.useState<Category>('日本株');

  const sizing = {
    width: 350,
    height: 350,
    legend: { hidden: true },
  };
  const assets = React.useMemo(() => {
    return data.filter((asset) => asset.category === category);
  }, [data, category]);

  const TOTAL = React.useMemo(() => {
    return assets.map((item) => item.value).reduce((a, b) => a + b, 0)
  }, [assets, category])

  const displayAssets = React.useMemo(() => {
    const colors = getColors(assets.length);
    return assets.map((asset, index) => {
      return {
        ...asset,
        color: colors[index]
      }
    });
  }, [assets, category]);

  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${params.label}(${decimalToPercent(percent)})`;
  };

  const amountFormatter = (params: any) => {
    const percent = params.value / TOTAL;
    const amount = Math.ceil(params.value / 10000);
    return `${amount.toLocaleString()}万円(${decimalToPercent(percent)})`;
  }


  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          <MenuItem value="日本株">日本株</MenuItem>
          <MenuItem value="米国株">米国株</MenuItem>
          <MenuItem value="中国株">中国株</MenuItem>
          <MenuItem value="インド株">インド株</MenuItem>
          <MenuItem value="投資信託">投資信託</MenuItem>
          <MenuItem value="現金">現金</MenuItem>
          <MenuItem value="債券">債券</MenuItem>
          <MenuItem value="コモディティ">コモディティ</MenuItem>
          <MenuItem value="その他">その他</MenuItem>
        </Select>
      </FormControl>
      {displayAssets.length === 0 ? (
        <div>データがありません</div>
      ) : (
        <PieChart
          series={[
            {
              innerRadius: 50,
              outerRadius: 140,
              data: displayAssets,
              arcLabel: getArcLabel,
              valueFormatter: amountFormatter
            },
          ]}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontSize: 16,
            },
          }}
          {...sizing}
        />
      )}
    </>
  );
}