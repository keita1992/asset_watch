import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const profiles = await getProfiles();
      return res.status(200).json(profiles);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

const getProfiles = async () => {
  try {
    const profiles = await prisma.profiles.findMany();
    return profiles;
  } catch (error) {
    console.log(error);
  }
}
