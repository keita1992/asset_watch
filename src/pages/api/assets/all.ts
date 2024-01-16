import { NextApiRequest, NextApiResponse } from "next";

import { getUser, listAssets } from "@/graphql/queries";
import { client as API } from "@/libs/amplify";
import * as types from "@/store/asset/type";
import { User } from "@/store/user";
import { getColors } from "@/utils/color";
import { USER_ID } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const exclude = req.query?.excludeEmergencyFund === "true";
    const assets = await getAssets(exclude);
    const responseData = {
      assets: assets,
    };
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getAssets = async (exclude: boolean = false) => {
  try {
    const fetchAssetsResponse = await API.graphql({
      query: listAssets,
      variables: {
        filter: {
          userId: { eq: USER_ID },
          deletedAt: { attributeExists: false },
        },
      },
    });
    const fetchUserResponse = await API.graphql({
      query: getUser,
      variables: { id: USER_ID },
    });
    const assets = fetchAssetsResponse.data.listAssets.items as types.Asset[];
    const user = fetchUserResponse.data.getUser as User;

    // カテゴリでグループ化
    const groupedByCategory = assets.reduce((acc, asset) => {
      (acc[asset.category] = acc[asset.category] || []).push(asset);
      return acc;
    }, {} as { [key: string]: types.Asset[] });

    // 各カテゴリの合計amountを計算
    const categoriesWithTotalAmount = Object.entries(groupedByCategory).map(
      ([category, assets]) => {
        const totalAmount = assets.reduce(
          (sum, asset) => sum + asset.amount,
          0
        );
        return { category, totalAmount, assets };
      }
    );

    // 合計amountが大きい順にカテゴリを並び替え、各カテゴリ内のアセットをamountが大きい順に並び替え
    const sortedCategories = categoriesWithTotalAmount.sort(
      (a, b) => b.totalAmount - a.totalAmount
    );
    sortedCategories.forEach((category) => {
      category.assets.sort((a, b) => b.amount - a.amount);
    });

    // categoryの数を集計
    const colors = getColors(sortedCategories.length);
    const data = sortedCategories
      .map((category, index) => {
        const assets = category.assets.map((asset) => {
          // 生活防衛資金を集計に含めない場合は、日本円現金から生活防衛資金を引く
          if (
            exclude &&
            asset.category === "現金" &&
            asset.currency === "JPY"
          ) {
            return {
              label: asset.name,
              value: asset.amount - user.emergencyFund,
              color: colors[index],
              category: asset.category,
              currency: asset.currency,
            };
          }
          return {
            label: asset.name,
            value: asset.amount,
            color: colors[index],
            category: asset.category,
            currency: asset.currency,
          };
        });
        return assets;
      })
      .flat();

    return data;
  } catch (error) {
    console.error(error);
  }
};
