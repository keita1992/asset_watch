import Axios, { AxiosResponse, AxiosError } from "axios";

import { NEXT_PUBLIC_API_URL } from "@/utils/constants";

export const axios = Axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  timeout: 1000,
  responseType: "json",
});

export type { AxiosResponse, AxiosError };
