import prisma from "@/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

import * as types from "@/store/asset/type";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const assets = await getAssets();
      return res.status(200).json(assets);
    }
    if (req.method === "POST") {
      const newAsset = req.body;
      if (!types.isRequest(newAsset)) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const asset = await addAsset(newAsset);
      return res.status(201).json(asset);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getAssets = async () => {
  try {
    const assets = await prisma.assets.findMany({
      where: {
        deletedAt: null,
      },
    });
    return assets;
  } catch (error) {
    console.log(error);
  }
}

const addAsset = async (newAsset: types.Request) => {
  try {
    const data = {
      ...newAsset,
      id: uuid(),
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    const asset = await prisma.assets.create({
      data,
    });
    return asset;
  } catch (error) {
    console.log(error);
  }
}
