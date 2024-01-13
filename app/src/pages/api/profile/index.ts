import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

import { docClient } from "@/libs/dynamoDb";
import { updateJpyCash } from "@/plugins/dynamoDb";
import * as types from "@/store/profile/type";
import { TABLE_NAME, USER_ID } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const profile = await getProfile();
      return res.status(200).json(profile);
    }
    if (req.method === "PATCH") {
      const newProfile = req.body;
      if (!types.isRequest(newProfile)) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const profile = await editProfile(newProfile);
      updateJpyCash();
      return res.status(200).json(profile);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getProfile = async () => {
  try {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId: USER_ID,
    }
  }
  const result = await docClient.send(new GetCommand(params));
  if (!result.Item) {
    return {};
  }
  const profile = result.Item.profile;
  
  return profile;
  } catch (error) {
    console.log(error);
  }
}

const editProfile = async (data: types.Request) => {
  try {
    // まず現在のprofileを取得
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      }
    };
    const getResult = await docClient.send(new GetCommand(getParams));
    const profile = (getResult.Item?.profile as types.Profile) || [];

    // profileを更新
    const newProfile = { ...profile, ...data };
    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        userId: USER_ID,
      },
      UpdateExpression: "SET profile = :newProfile",
      ExpressionAttributeValues: {
        ":newProfile": newProfile
      }
    };
    await docClient.send(new UpdateCommand(updateParams));

    return newProfile;
  } catch (error) {
    console.error(error);
  }
};
