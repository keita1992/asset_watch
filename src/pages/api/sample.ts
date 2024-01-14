import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    return res.status(200).json({
      message: "API call success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
