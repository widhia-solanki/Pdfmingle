import type { NextApiRequest, NextApiResponse } from "next";

import {
  createAdminSessionCookie,
  createAdminSessionToken,
  isAdminAuthConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-session";

const setNoStore = (response: NextApiResponse) => {
  response.setHeader("Cache-Control", "no-store");
};

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  setNoStore(response);

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  if (!isAdminAuthConfigured()) {
    return response.status(500).json({
      error: "Admin credentials are not configured on the server.",
    });
  }

  const { email, password } = request.body as { email?: string; password?: string };

  if (typeof email !== "string" || typeof password !== "string") {
    return response.status(400).json({ error: "Email and password are required." });
  }

  if (!verifyAdminCredentials(email, password)) {
    return response.status(401).json({ error: "Invalid admin credentials." });
  }

  const token = createAdminSessionToken();
  const expiresAt = Date.now() + 3 * 60 * 1000;

  response.setHeader("Set-Cookie", createAdminSessionCookie(token));

  return response.status(200).json({
    authenticated: true,
    expiresAt,
  });
}
