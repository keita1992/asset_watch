import { Amplify } from "@aws-amplify/core";
import { generateClient } from "aws-amplify/api";

import config from "@/aws-exports";
import { mockClient } from "@/libs/mockClient";

// USE_MOCK_DATA=true のときは AWS に接続せず、メモリ上のサンプルデータを返す
const useMock = process.env.USE_MOCK_DATA === "true";

if (!useMock) {
  Amplify.configure(config);
}

const createClient = () => generateClient();
type Client = ReturnType<typeof createClient>;

export const client: Client = useMock ? (mockClient as unknown as Client) : createClient();
