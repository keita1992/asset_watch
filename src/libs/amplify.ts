import { Amplify } from "@aws-amplify/core";
import { generateClient } from "aws-amplify/api";

import config from "@/aws-exports";

Amplify.configure(config);

export const client = generateClient();
