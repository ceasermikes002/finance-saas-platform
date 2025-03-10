import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return 'http://localhost:3000';
};

export const client = hc<AppType>(getBaseUrl());