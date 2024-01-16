import { NextApiRequest, NextApiResponse } from "next";

import { updateAsset } from "@/graphql/mutations";
import { client as API } from "@/libs/amplify";
import { updateJpyCash } from "@/plugins/dynamoDb";
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
      const asset = await update(id, newAsset);
      await updateJpyCash();

      return res.status(200).json(asset);
    }
    if (req.method === "DELETE") {
      const { id } = req.query;
      await deleteById(id as string);
      await updateJpyCash();

      res.status(204).end();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const update = async (id: types.Id, data: types.Request) => {
  try {
    const response = await API.graphql({
      query: updateAsset,
      variables: { input: { id, ...data } },
    });
    return response.data.updateAsset;
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteById = async (id: types.Id) => {
  try {
    const response = await API.graphql({
      query: updateAsset,
      variables: { input: { id, deletedAt: new Date().toISOString() } },
    });
    return response.data.updateAsset;
  } catch (error) {
    return Promise.reject(error);
  }
};
