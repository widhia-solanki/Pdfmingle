import type { NextApiRequest, NextApiResponse } from "next";

import {
  clearAdminSessionCookie,
  getAdminSessionTokenFromRequest,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { getAdminDb } from "@/lib/firebase-admin";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "DELETE") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  const session = verifyAdminSessionToken(getAdminSessionTokenFromRequest(request));

  if (!session) {
    response.setHeader("Set-Cookie", clearAdminSessionCookie());
    return response.status(401).json({ error: "Unauthorized." });
  }

  const id = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;

  if (!id) {
    return response.status(400).json({ error: "Feedback id is required." });
  }

  try {
    const reference = getAdminDb().collection("feedback").doc(id);
    const snapshot = await reference.get();

    if (!snapshot.exists) {
      return response.status(404).json({ error: "Feedback entry not found." });
    }

    await reference.delete();
    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Admin feedback delete failed:", error);
    return response.status(500).json({ error: "Could not delete feedback." });
  }
}
