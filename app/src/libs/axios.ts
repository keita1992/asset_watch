import Axios, { AxiosResponse, AxiosError } from "axios";

export const axios = Axios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000,
  responseType: "json",
});

export type { AxiosResponse, AxiosError };
