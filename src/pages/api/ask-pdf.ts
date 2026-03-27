import type { NextApiRequest, NextApiResponse } from "next";

const DEFAULT_BACKEND_URL = "https://pdfmingle-backend.onrender.com";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  const backendBaseUrl =
    process.env.ASK_PDF_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_BACKEND_URL;

  try {
    const upstreamResponse = await fetch(`${backendBaseUrl}/api/ask-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
    });

    const text = await upstreamResponse.text();
    response.status(upstreamResponse.status);
    response.setHeader("Content-Type", upstreamResponse.headers.get("content-type") || "application/json");
    return response.send(text);
  } catch (error) {
    return response.status(502).json({
      error: error instanceof Error ? error.message : "Could not reach the AI backend.",
    });
  }
}
