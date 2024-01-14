import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { docClient } from "@/libs/dynamoDb";
import { Asset } from "@/store/asset";
import { Profile } from "@/store/profile";
import { TABLE_NAME, USER_ID } from "@/utils/constants";

export const updateJpyCash = async () => {
  try {
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      }
    }
    const result = await docClient.send(new GetCommand(getParams));
    if (!result.Item) return [];

    const assets = result.Item.assets.filter((asset: Asset) => !asset.deletedAt) as Asset[];
    const profile = result.Item.profile as Profile;

    const amountWithoutJpyCash = assets.reduce((acc, asset) => {
      if (asset.currency === "JPY" && asset.category === "現金") {
        return acc;
      }
      return acc + asset.amount;
    }, 0);

    const jpyCashAmount = profile.netAssets - profile.liabilities - amountWithoutJpyCash;
    const jpyCash = assets.find((asset) => asset.currency === "JPY" && asset.category === "現金");
    if (!jpyCash) return;

    const updateParam = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      },
      UpdateExpression: "set assets = :assets",
      ExpressionAttributeValues: {
        ":assets": [
          ...assets.filter((asset) => asset.id !== jpyCash.id),
          {
            ...jpyCash,
            amount: jpyCashAmount,
          }
        ]
      }
    }
    return await docClient.send(new UpdateCommand(updateParam));
  } catch (error) {
    console.log(error);
  }
}