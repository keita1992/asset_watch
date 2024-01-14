import { AssetsData } from "@/store/asset";

export const useCalcIndicators = (assets: AssetsData) => {
  const indicators = {
    cashRatio: 0,
    jpyCashRatio: 0,
    totalAmount: 0,
  };
  const cachAmount = assets
    .filter((asset) => asset.category === "現金")
    .reduce((sum, asset) => sum + asset.value, 0);
  const jpyCashAmount = assets
    .filter((asset) => asset.category === "現金" && asset.currency === "JPY")
    .reduce((sum, asset) => sum + asset.value, 0);
  const totalAmount = assets.reduce((sum, asset) => sum + asset.value, 0);

  // 現金比率
  if (!cachAmount || !totalAmount) {
    indicators["cashRatio"] = 0;
  } else {
    indicators["cashRatio"] = cachAmount / totalAmount;
  }
  // 現金比率（円）
  if (!jpyCashAmount || !totalAmount) {
    indicators["jpyCashRatio"] = 0;
  } else {
    indicators["jpyCashRatio"] = jpyCashAmount / totalAmount;
  }
  // 総資産
  indicators["totalAmount"] = totalAmount;

  return indicators;
};
