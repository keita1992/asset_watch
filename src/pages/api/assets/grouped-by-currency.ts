import { NextApiRequest, NextApiResponse } from "next";

import { listAssets, getUser } from "@/graphql/queries";
import { client as API } from "@/libs/amplify";
import * as types from "@/store/asset/type";
import { User } from "@/store/user";
import { sumBy } from "@/utils/aggregate";
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
    const assets = await groupedByCurrency(exclude);
    const responseData = {
      assets: assets,
    };
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

    const emergencyFund = user?.emergencyFund ?? 0;

    const sumByGroup = sumBy(assets, "currency", "amount") as SumByGroup;
    const sumByGroupArray = Object.entries(sumByGroup)
      .map(([currency, sum]) => {
        return {
          currency,
          sum,
        };
      })
      .sort((a, b) => b.sum - a.sum);

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
};
