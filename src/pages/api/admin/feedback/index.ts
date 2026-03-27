import type { NextApiRequest, NextApiResponse } from "next";

import {
  clearAdminSessionCookie,
  getAdminSessionTokenFromRequest,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { getAdminDb } from "@/lib/firebase-admin";

const setNoStore = (response: NextApiResponse) => {
  response.setHeader("Cache-Control", "no-store");
};

const mapTimestampToMs = (timestamp: unknown) => {
  if (
    timestamp &&
    typeof timestamp === "object" &&
    "toMillis" in timestamp &&
    typeof (timestamp as { toMillis: () => number }).toMillis === "function"
  ) {
    return (timestamp as { toMillis: () => number }).toMillis();
  }

  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }

  return null;
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  setNoStore(response);

  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  const session = verifyAdminSessionToken(getAdminSessionTokenFromRequest(request));

  if (!session) {
    response.setHeader("Set-Cookie", clearAdminSessionCookie());
    return response.status(401).json({ error: "Unauthorized." });
  }

  try {
    const snapshot = await getAdminDb()
      .collection("feedback")
      .orderBy("timestamp", "desc")
      .get();

    const feedback = snapshot.docs.map((document) => {
      const data = document.data() as {
        comment?: string;
        emoji?: string;
        page?: string;
        rating?: number;
        timestamp?: unknown;
        userId?: string;
        userid?: string;
      };

      return {
        id: document.id,
        comment: typeof data.comment === "string" ? data.comment : "",
        emoji: typeof data.emoji === "string" ? data.emoji : "N/A",
        page: typeof data.page === "string" ? data.page : "Unknown",
        rating: typeof data.rating === "number" ? data.rating : null,
        timestampMs: mapTimestampToMs(data.timestamp),
        userId:
          typeof data.userId === "string"
            ? data.userId
            : typeof data.userid === "string"
              ? data.userid
              : "anonymous",
      };
    });

    return response.status(200).json({ feedback });
  } catch (error) {
    console.error("Admin feedback fetch failed:", error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Could not load feedback.",
    });
  }
}
