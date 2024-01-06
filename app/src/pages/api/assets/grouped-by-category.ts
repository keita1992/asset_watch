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
    const assets = await getAssetsGroupedByCategory(exclude);
    const responseData = {
      assets: assets,
    }
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getAssetsGroupedByCategory = async (exclude: boolean = false) => {
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
    const profile = await prisma.profiles.findFirst();
    const emergencyFund = profile?.emergencyFund ?? 0;

    const colors = getColors(groups.length)
    const assetsGroupedByCategory = groups.map((group, index) => {
      // 生活防衛資金を含まない場合は現金の金額から生活防衛資金を引く
      if (exclude && group.category === "現金") {
        return {
          label: group.category,
          value: (group._sum.amount ?? 0) - emergencyFund,
          color: colors[index],
        };
      }
      return {
        label: group.category,
        value: group._sum.amount,
        color: colors[index],
      };
    });

    return assetsGroupedByCategory;
  } catch (error) {
    console.log(error);
  }
}
