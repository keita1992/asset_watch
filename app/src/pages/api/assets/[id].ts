import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

import { docClient } from "@/libs/dynamoDb";
import { updateJpyCash } from "@/plugins/dynamoDb";
import * as types from "@/store/asset/type";
import { TABLE_NAME, USER_ID } from "@/utils/constants";


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
      updateJpyCash();
      return res.status(200).json(asset);
    }
    if (req.method === "DELETE") {
      const { id } = req.query;
      await deleteAsset(id as string);
      updateJpyCash();
      res.status(204).end();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const editAsset = async (id: types.Id, data: types.Request) => {
  try {
    // まず現在のassetsを取得
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      }
    };
    const getResult = await docClient.send(new GetCommand(getParams));
    const assets = (getResult.Item?.assets as types.Asset[]) || [];

    // 更新したいアセットを見つけて更新
    const assetIndex = assets.findIndex(asset => asset.id === id);
    if (assetIndex === -1) {
      throw new Error('Asset not found');
    }
    const newAsset = {
      ...assets[assetIndex],
      ...data,
      modifiedAt: new Date().toISOString(),
    };
    assets[assetIndex] = newAsset;
    
    // assetsを更新
    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      },
      UpdateExpression: "SET assets = :newAssets",
      ExpressionAttributeValues: {
        ":newAssets": assets
      }
    };
    const response = await docClient.send(new UpdateCommand(updateParams));
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to update asset");
    }
    return newAsset;
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteAsset = async (id: types.Id) => {
  try {
    // まず現在のassetsを取得
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      }
    };
    const getResult = await docClient.send(new GetCommand(getParams));
    const assets = (getResult.Item?.assets as types.Asset[]) || [];

    // 更新したいアセットを見つけて更新
    const assetIndex = assets.findIndex(asset => asset.id === id);
    if (assetIndex !== -1) {
      assets[assetIndex] = {
        ...assets[assetIndex],
        deletedAt: new Date().toISOString(),
      };
    } else {
      throw new Error('Asset not found');
    }
    // assetsを更新
    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      },
      UpdateExpression: "SET assets = :newAssets",
      ExpressionAttributeValues: {
        ":newAssets": assets
      }
    };
    const response = await docClient.send(new UpdateCommand(updateParams));
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to update asset");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};