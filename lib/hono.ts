import { hc } from "hono/client";

import { AppType } from "@/app/api/[[...route]]/route";

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // Browser should use relative url
        return ''
    }
    if (process.env.VERCEL_URL) {
        // Reference for vercel.com
        return `https://${process.env.VERCEL_URL}`
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
        // Reference for custom domain
        return process.env.NEXT_PUBLIC_API_URL
    }
    // Assume localhost
    return `http://localhost:${process.env.PORT || 3000}`
}

export const client = hc<AppType>(getBaseUrl());