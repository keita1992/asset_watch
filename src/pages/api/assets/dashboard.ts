import { NextApiRequest, NextApiResponse } from "next";

import { getUser, listAssets } from "@/graphql/queries";
import { client as API } from "@/libs/amplify";
import * as types from "@/store/asset/type";
import { User } from "@/store/user";
import { sumBy } from "@/utils/aggregate";
import { getColors } from "@/utils/color";
import { USER_ID } from "@/utils/constants";

type SumByCategory = {
  [_key in types.Category]: number;
};

type SumByCurrency = {
  [_key in types.Currency]: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const dashboardData = await getDashboardData();
    return res.status(200).json(dashboardData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const getDashboardData = async () => {
  try {
    // 一度のGraphQLクエリですべてのデータを取得
    const [fetchAssetsResponse, fetchUserResponse] = await Promise.all([
      API.graphql({
        query: listAssets,
        variables: {
          filter: {
            userId: { eq: USER_ID },
            deletedAt: { attributeExists: false },
          },
        },
      }),
      API.graphql({
        query: getUser,
        variables: { id: USER_ID },
      }),
    ]);

    const assets = fetchAssetsResponse.data.listAssets.items as types.Asset[];
    const user = fetchUserResponse.data.getUser as User;
    const emergencyFund = user?.emergencyFund ?? 0;

    // すべての必要なデータ変換を一度に実行
    const processedData = processAssetData(assets, user, emergencyFund);

    return {
      assetsGroupedByCategory: processedData.assetsGroupedByCategory,
      assetsGroupedByCurrency: processedData.assetsGroupedByCurrency,
      assetsGroupedByCategoryWithoutEmergencyFund: processedData.assetsGroupedByCategoryWithoutEmergencyFund,
      assetsGroupedByCurrencyWithoutEmergencyFund: processedData.assetsGroupedByCurrencyWithoutEmergencyFund,
      assets: processedData.assets,
      assetsWithoutEmergencyFund: processedData.assetsWithoutEmergencyFund,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const processAssetData = (assets: types.Asset[], user: User, emergencyFund: number) => {
  // カテゴリ別グループ化（再利用可能）
  const groupedByCategory = assets.reduce((acc, asset) => {
    (acc[asset.category] = acc[asset.category] || []).push(asset);
    return acc;
  }, {} as { [key: string]: types.Asset[] });

  // 各カテゴリの合計amount計算
  const categoriesWithTotalAmount = Object.entries(groupedByCategory).map(
    ([category, assets]) => {
      const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
      return { category, totalAmount, assets };
    }
  );

  // 合計amountでソート
  const sortedCategories = categoriesWithTotalAmount.sort(
    (a, b) => b.totalAmount - a.totalAmount
  );
  sortedCategories.forEach((category) => {
    category.assets.sort((a, b) => b.amount - a.amount);
  });

  const categoryColors = getColors(sortedCategories.length);

  // カテゴリ別サマリ生成
  const sumByCategory = sumBy(assets, "category", "amount") as SumByCategory;
  const sumByCategoryArray = Object.entries(sumByCategory)
    .map(([category, sum]) => ({ category, sum }))
    .sort((a, b) => b.sum - a.sum);

  const assetsGroupedByCategory = sumByCategoryArray.map((group, index) => ({
    label: group.category,
    value: group.sum,
    color: categoryColors[index],
  }));

  const assetsGroupedByCategoryWithoutEmergencyFund = sumByCategoryArray.map((group, index) => ({
    label: group.category,
    value: group.category === "現金" ? group.sum - emergencyFund : group.sum,
    color: categoryColors[index],
  }));

  // 通貨別サマリ生成
  const sumByCurrency = sumBy(assets, "currency", "amount") as SumByCurrency;
  const sumByCurrencyArray = Object.entries(sumByCurrency)
    .map(([currency, sum]) => ({ currency, sum }))
    .sort((a, b) => b.sum - a.sum);

  const currencyColors = getColors(Object.keys(sumByCurrency).length);

  const assetsGroupedByCurrency = sumByCurrencyArray.map((group, index) => ({
    label: group.currency,
    value: group.sum,
    color: currencyColors[index],
  }));

  const assetsGroupedByCurrencyWithoutEmergencyFund = sumByCurrencyArray.map((group, index) => ({
    label: group.currency,
    value: group.currency === "JPY" ? group.sum - emergencyFund : group.sum,
    color: currencyColors[index],
  }));

  // 詳細資産データ生成
  const assets_data = sortedCategories
    .map((category, index) => {
      return category.assets.map((asset) => ({
        label: asset.name,
        value: asset.amount,
        color: categoryColors[index],
        category: asset.category,
        currency: asset.currency,
      }));
    })
    .flat();

  const assetsWithoutEmergencyFund = sortedCategories
    .map((category, index) => {
      return category.assets.map((asset) => {
        // 生活防衛資金を除く場合の処理
        if (asset.category === "現金" && asset.currency === "JPY") {
          return {
            label: asset.name,
            value: asset.amount - emergencyFund,
            color: categoryColors[index],
            category: asset.category,
            currency: asset.currency,
          };
        }
        return {
          label: asset.name,
          value: asset.amount,
          color: categoryColors[index],
          category: asset.category,
          currency: asset.currency,
        };
      });
    })
    .flat();

  return {
    assetsGroupedByCategory,
    assetsGroupedByCurrency,
    assetsGroupedByCategoryWithoutEmergencyFund,
    assetsGroupedByCurrencyWithoutEmergencyFund,
    assets: assets_data,
    assetsWithoutEmergencyFund,
  };
};