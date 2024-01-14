import { FormControl, MenuItem, Select } from '@mui/material';
import { DefaultizedPieValueType } from '@mui/x-charts';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import * as React from 'react';

import { AssetsData, Currency } from '@/store/asset';
import { getColors } from '@/utils/color';
import { decimalToPercent } from '@/utils/formatter';

type Props = {
  data: AssetsData;
}

export const CurrencyDetailPieChart = ({ data }: Props) => {
  const [currency, setCurrency] = React.useState<Currency>('JPY');

  const sizing = {
    width: 350,
    height: 350,
    legend: { hidden: true },
  };
  const assets = React.useMemo(() => {
    return data.filter((asset) => asset.currency === currency);
  }, [data, currency]);

  const TOTAL = React.useMemo(() => {
    return assets.map((item) => item.value).reduce((a, b) => a + b, 0)
  }, [assets, currency])

  const displayAssets = React.useMemo(() => {
    const colors = getColors(assets.length);
    return assets.map((asset, index) => {
      return {
        ...asset,
        color: colors[index]
      }
    });
  }, [assets, currency]);

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
        <Select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
          <MenuItem value="JPY">JPY</MenuItem>
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="CHF">CHF</MenuItem>
          <MenuItem value="AUD">AUD</MenuItem>
          <MenuItem value="CAD">CAD</MenuItem>
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