import prisma from "@/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
    const assets = await getAssets(exclude);
    const responseData = {
      assets: assets,
    }
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getAssets = async (exclude: boolean = false) => {
  try {
    const groups = await prisma.assets.groupBy({
      by: ["category"],
      _sum: {
        amount: true,
      },
      where: {
        deletedAt: null,
      },
      orderBy: [{
        category: "desc",
      }],
    });
    const assets = await prisma.assets.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [{
        category: "desc",
      }, {
        amount: "desc",
      }],
    });
    const profile = await prisma.profiles.findFirst();
    const emergencyFund = profile?.emergencyFund ?? 0;

    const colors: { [id: string]: string } = {};
    getColors(groups.length).forEach((color, index) => {
      colors[groups[index].category] = color;
    });
    const assetsData = assets.map((asset) => {
      // 生活防衛資金を集計に含めない場合は、日本円現金から生活防衛資金を引く
      if (exclude && asset.category === "現金" && asset.currency === "JPY") {
        return {
          label: asset.name,
          value: asset.amount - emergencyFund,
          color: colors[asset.category],
          category: asset.category,
          currency: asset.currency,
        };
      }
      return {
        label: asset.name,
        value: asset.amount,
        color: colors[asset.category],
        category: asset.category,
        currency: asset.currency,
      };
    })

    return assetsData;
  } catch (error) {
    console.log(error);
  }
}
