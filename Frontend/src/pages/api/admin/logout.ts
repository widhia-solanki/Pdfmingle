import type { NextApiRequest, NextApiResponse } from "next";

import { clearAdminSessionCookie } from "@/lib/admin-session";

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  response.setHeader("Set-Cookie", clearAdminSessionCookie());
  return response.status(200).json({ success: true });
}
