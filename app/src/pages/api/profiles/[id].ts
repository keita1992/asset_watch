import prisma from "@/libs/prisma";
import { NextApiRequest, NextApiResponse } from "next";

import * as types from "@/store/profile/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PATCH") {
      const id = Number(req.query?.id);
      if (typeof id !== "number") {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const newProfile = req.body;
      if (!types.isRequest(newProfile)) {
        return res.status(400).json({ message: "Invalid request body" });
      }
      const profile = await editProfile(id, newProfile);
      return res.status(200).json(profile);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const editProfile = async (id: types.Id, newProfile: types.Request) => {
  try {
    const data = {
      ...newProfile,
      modifiedAt: new Date(),
    };
    const profile = await prisma.profiles.update({
      where: { id },
      data,
    });
    return profile;
  } catch (error) {
    console.log(error);
  }
}
