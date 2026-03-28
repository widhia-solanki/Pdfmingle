import type { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs } from "firebase/firestore";

import {
  clearAdminSessionCookie,
  getAdminSessionTokenFromRequest,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { db } from "@/lib/firebase";
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

const mapFeedbackDocument = (
  id: string,
  data: {
    comment?: string;
    emoji?: string;
    page?: string;
    rating?: number;
    timestamp?: unknown;
    userId?: string;
    userid?: string;
  }
) => {
  return {
    id,
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
};

const sortFeedback = <
  T extends {
    timestampMs: number | null;
  },
>(
  feedback: T[]
) => {
  return feedback.sort((left, right) => (right.timestampMs ?? 0) - (left.timestampMs ?? 0));
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

    const feedback = snapshot.docs.map((document) =>
      mapFeedbackDocument(
        document.id,
        document.data() as {
          comment?: string;
          emoji?: string;
          page?: string;
          rating?: number;
          timestamp?: unknown;
          userId?: string;
          userid?: string;
        }
      )
    );

    return response.status(200).json({ feedback });
  } catch (error) {
    console.error("Admin feedback fetch failed:", error);

    try {
      const snapshot = await getDocs(collection(db, "feedback"));
      const feedback = sortFeedback(
        snapshot.docs.map((document) =>
          mapFeedbackDocument(
            document.id,
            document.data() as {
              comment?: string;
              emoji?: string;
              page?: string;
              rating?: number;
              timestamp?: unknown;
              userId?: string;
              userid?: string;
            }
          )
        )
      );

      return response.status(200).json({
        feedback,
        degraded: true,
      });
    } catch (fallbackError) {
      console.error("Fallback feedback fetch failed:", fallbackError);
      return response.status(500).json({
        error:
          fallbackError instanceof Error
            ? fallbackError.message
            : error instanceof Error
              ? error.message
              : "Could not load feedback.",
      });
    }
  }
}
