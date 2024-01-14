import { DefaultizedPieValueType } from '@mui/x-charts';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import * as React from 'react';

import { AssetsGroupedByCategory } from '@/store/asset';
import { decimalToPercent } from '@/utils/formatter';

type Props = { data: AssetsGroupedByCategory };

export const CategoryPieChart = ({ data }: Props) => {
  const sizing = {
    width: 350,
    height: 350,
    legend: { hidden: true },
  };
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

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
    <PieChart
      series={[
        {
          innerRadius: 50,
          outerRadius: 140,
          data,
          arcLabel: getArcLabel,
          valueFormatter: amountFormatter,
          arcLabelMinAngle: 20,
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
  );
}