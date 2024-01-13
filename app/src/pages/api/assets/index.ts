import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

import { docClient } from "@/libs/dynamoDb";
import { updateJpyCash } from "@/plugins/dynamoDb";
import * as types from "@/store/asset/type";
import { TABLE_NAME, USER_ID } from "@/utils/constants";


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
      updateJpyCash();
      return res.status(201).json(asset);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const getAssets = async (): Promise<types.Asset[]> => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      }
    }
    const result = await docClient.send(new GetCommand(params));
    if (!result.Item) return [];

    const assets = result.Item.assets.filter((asset: types.Asset) => !asset.deletedAt);
    return assets;
  } catch (error) {
    return Promise.reject(error);
  }
}

const addAsset = async (data: types.Request) => {
  try {
    const newAsset = {
      id: uuid(),
      ...data,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      deletedAt: null,
    };
    const params = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      },
      UpdateExpression: "SET assets = list_append(if_not_exists(assets, :empty_list), :newAsset)",
      ExpressionAttributeValues: {
          ":newAsset": [newAsset],
          ":empty_list": []
      }
    }
    const response = await docClient.send(new UpdateCommand(params));
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to add asset");
    }
    return newAsset;
  } catch (error) {
    return Promise.reject(error);
  }
}
