import type { NextApiRequest, NextApiResponse } from "next";

import {
  clearAdminSessionCookie,
  getAdminSessionTokenFromRequest,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "@/lib/admin-session";

const setNoStore = (response: NextApiResponse) => {
  response.setHeader("Cache-Control", "no-store");
};

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  setNoStore(response);

  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  const configured = isAdminAuthConfigured();

  if (!configured) {
    response.setHeader("Set-Cookie", clearAdminSessionCookie());
    return response.status(200).json({ authenticated: false, configured: false, expiresAt: null });
  }

  const token = getAdminSessionTokenFromRequest(request);
  const session = verifyAdminSessionToken(token);

  if (!session) {
    response.setHeader("Set-Cookie", clearAdminSessionCookie());
    return response.status(200).json({ authenticated: false, configured: true, expiresAt: null });
  }

  return response.status(200).json({
    authenticated: true,
    configured: true,
    expiresAt: session.expiresAt,
  });
}
