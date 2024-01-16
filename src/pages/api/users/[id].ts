import { NextApiRequest, NextApiResponse } from "next";

import { updateUser, deleteUser } from "@/graphql/mutations";
import { getUser } from "@/graphql/queries";
import { client as API } from "@/libs/amplify";
import { updateJpyCash } from "@/plugins/dynamoDb";
import * as types from "@/store/user/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "id is required" });
      }
      const user = await get(id);

      return res.status(200).json(user);
    } else if (req.method === "PATCH") {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "id is required" });
      }
      const user = await update(id, req.body);
      await updateJpyCash();

      return res.status(200).json(user);
    } else if (req.method === "DELETE") {
      const { id } = req.query;
      if (typeof id !== "string") {
        return res.status(400).json({ message: "id is required" });
      }
      const user = await deleteById(id);

      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const get = async (id: string) => {
  const response = await API.graphql({
    query: getUser,
    variables: { id },
  });

  return response.data.getUser;
};

const update = async (id: types.Id, data: types.Request) => {
  const response = await API.graphql({
    query: updateUser,
    variables: { input: { ...data, id } },
  });

  return response.data.updateUser;
};

const deleteById = async (id: types.Id) => {
  const response = await API.graphql({
    query: deleteUser,
    variables: { input: { id } },
  });

  return response.data.deleteUser;
};
