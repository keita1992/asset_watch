import prisma from "@/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

import * as types from "@/store/asset/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PATCH") {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const newAsset = req.body;
      if (!types.isRequest(newAsset)) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const asset = await editAsset(id, newAsset);
      return res.status(200).json(asset);
    }
    if (req.method === "DELETE") {
      const { id } = req.query;
      const asset = await deleteAsset(id as string);
      return res.status(200).json(asset);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const editAsset = async (id: types.Id, newAsset: types.Request) => {
  try {
    const data = {
      ...newAsset,
      modifiedAt: new Date(),
    };
    const asset = await prisma.assets.update({
      where: { id },
      data,
    });
    return asset;
  } catch (error) {
    console.log(error);
  }
}

const deleteAsset = async (id: types.Id) => {
  try {
    const asset = await prisma.assets.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return asset;
  } catch (error) {
    console.log(error);
  }
}
