
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";
import { getColors } from "@/utils/color";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    const exclude = req.query?.excludeEmergencyFund === "true";
    const assets = await getAssetsGroupedByCurrency(exclude);
    const responseData = {
      assets: assets,
    }
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getAssetsGroupedByCurrency = async (exclude: boolean = false) => {
  try {
    const assetsGroupedByCurrency = await prisma.assets.groupBy({
      by: ["currency"],
      _sum: {
        amount: true,
      },
      where: {
        deletedAt: null,
      }
    });
    const profile = await prisma.profiles.findFirst();
    const emergencyFund = profile?.emergencyFund ?? 0;

    const colors = getColors(assetsGroupedByCurrency.length);
    const assets = assetsGroupedByCurrency.map((asset, index) => {
      // 生活防衛資金を含まない場合はJPYから生活防衛資金を引く
      if (exclude && asset.currency === "JPY") {
        return {
          label: asset.currency,
          value: (asset._sum.amount ?? 0) - emergencyFund,
          color: colors[index],
        };
      }
      return {
        label: asset.currency,
        value: asset._sum.amount,
        color: colors[index],
      };
    });
    return assets;
  } catch (error) {
    console.log(error);
  }
}
