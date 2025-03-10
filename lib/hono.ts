import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

export const client = hc<AppType>('https://finance-saas-platform-seven.vercel.app');