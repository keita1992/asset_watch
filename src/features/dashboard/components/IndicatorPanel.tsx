import { Stack, Box, Typography } from "@mui/material";

import { useCalcIndicators } from "../hooks/useCalcIndicators";

import { AssetsData } from "@/store/asset";
import { decimalToPercent } from "@/utils/formatter";

type Props = {
  data: AssetsData;
}

export const IndicatorPanel = ({ data }: Props) => {
  const indicators = useCalcIndicators(data);
  return (
    <Stack spacing={3} sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2">総資産</Typography>
        <Typography variant="h3">{indicators.totalAmount.toLocaleString()}円</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2">キャッシュ比率(ALL)</Typography>
        <Typography variant="h3">{decimalToPercent(indicators.cashRatio)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2">キャッシュ比率(JPY)</Typography>
        <Typography variant="h3">{decimalToPercent(indicators.jpyCashRatio)}</Typography>
      </Box>
    </Stack>
  );
}