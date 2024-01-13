import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

import { docClient } from "@/libs/dynamoDb";
import * as types from "@/store/asset/type";
import { Profile } from "@/store/profile";
import { sumBy } from "@/utils/aggregate";
import { getColors } from "@/utils/color";
import { TABLE_NAME, USER_ID } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const exclude = req.query?.excludeEmergencyFund === "true";
    const assets = await groupedByCurrency(exclude);
    const responseData = {
      assets: assets,
    }
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

type SumByGroup = {
  [_key in types.Currency]: number;
};

const groupedByCurrency = async (exclude: boolean = false) => {
  try {
    // アセットとプロフィールを取得
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      }
    };
    const response = await docClient.send(new GetCommand(params));
    const assets = (response.Item?.assets as types.Asset[]) || [];
    const validAssets = assets.filter(asset => asset.deletedAt === null);

    const profile = response.Item?.profile as Profile;
    const emergencyFund = profile?.emergencyFund ?? 0;

    const sumByGroup = sumBy(validAssets, "currency", "amount") as SumByGroup;
    const sumByGroupArray = Object.entries(sumByGroup).map(([currency, sum]) => {
      return {
        currency,
        sum,
      };
    }).sort((a, b) => b.sum - a.sum);

    const colors = getColors(Object.keys(sumByGroup).length);
    
    const assetsGroupedByCurrency = sumByGroupArray.map((group, index) => {
      // 生活防衛資金を含まない場合は現金の金額から生活防衛資金を引く
      if (exclude && group.currency === "JPY") {
        return {
          label: group.currency,
          value: group.sum - emergencyFund,
          color: colors[index],
        };
      }
      return {
        label: group.currency,
        value: group.sum,
        color: colors[index],
      };
    });

    return assetsGroupedByCurrency;
  } catch (error) {
    console.log(error);
  }
}
