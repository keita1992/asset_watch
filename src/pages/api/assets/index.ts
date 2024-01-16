import { NextApiRequest, NextApiResponse } from "next";


import { createAsset } from "@/graphql/mutations";
import { listAssets } from "@/graphql/queries";
import { client as API } from "@/libs/amplify";
import { updateJpyCash } from "@/plugins/dynamoDb";
import * as types from "@/store/asset/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const userId = req.query.userId;
      if (typeof userId !== "string") {
        return res.status(400).json({ message: "Invalid query" });
      }
      const assets = await getAssets(userId);
      return res.status(200).json(assets);
    }
    if (req.method === "POST") {
      const newAsset = req.body;
      if (!types.isRequest(newAsset)) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const asset = await addAsset(newAsset);
      await updateJpyCash();

      return res.status(201).json(asset);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const getAssets = async (userId: string) => {
  try {
    const assets = await API.graphql({
      query: listAssets,
      variables: {
        filter: {
          userId: { eq: userId },
          deletedAt: { attributeExists: false },
        },
      },
    });

    return assets.data.listAssets.items;
  } catch (error) {
    return Promise.reject(error);
  }
};

const addAsset = async (data: types.Request & { userId: string }) => {
  try {
    const newAsset = await API.graphql({
      query: createAsset,
      variables: { input: data },
    });
    return newAsset.data.createAsset;
  } catch (error) {
    return Promise.reject(error);
  }
};
