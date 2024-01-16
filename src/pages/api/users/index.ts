import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";

import { createUser } from "@/graphql/mutations";
import { listUsers } from "@/graphql/queries";
import { client as API } from "@/libs/amplify";
import { Request } from "@/store/user";

const newUser = {
  id: uuid(),
  name: "test",
  netAssets: 0,
  liabilities: 0,
  emergencyFund: 0,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const users = await getUsers();
      return res.status(200).json(users);
    } else if (req.method === "POST") {
      const user = await addUser(newUser);
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getUsers = async () => {
  const response = await API.graphql({
    query: listUsers,
  });

  return response.data.listUsers.items;
};

const addUser = async (data: Request) => {
  const response = await API.graphql({
    query: createUser,
    variables: { input: data },
  });

  return response.data.createUser;
};
