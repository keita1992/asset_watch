import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';

import { AssetsData } from '@/store/asset';

const chartSetting = {
  xAxis: [
    {
      label: '評価額',
      valueFormatter: (value: number) => `${Math.ceil(value / 10000)}万円`,
    },
  ],
  width: 800,
  height: 400,
  margin: { left: 100 },
};

const valueFormatter = (value: number) => `${Math.ceil(value / 10000)}万円`;

type Props = {
  data: AssetsData;
}

export const AssetBarChart = ({ data }: Props) => {
  return (
    <BarChart
      dataset={data}
      yAxis={[{ scaleType: 'band', dataKey: 'label' }]}
      series={[{ dataKey: 'value', label: '資産総額', valueFormatter }]}
      layout="horizontal"
      slotProps={{ legend: { hidden: true } }}
      {...chartSetting}
    />
  );
}