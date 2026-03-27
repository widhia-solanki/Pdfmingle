import type { NextApiRequest, NextApiResponse } from "next";

const MAX_TEXT_LENGTH = 20000;
const MAX_QUESTION_LENGTH = 1000;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

interface DeepSeekResponse {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string; type?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

const normalizeContent = (content: DeepSeekResponse["choices"] extends Array<infer T>
  ? T extends { message?: { content?: infer U } }
    ? U
    : never
  : never) => {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item?.text === "string" ? item.text : ""))
      .join("\n")
      .trim();
  }

  return "";
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: "DeepSeek API key is not configured." });
  }

  const { question, text } = request.body as {
    question?: unknown;
    text?: unknown;
  };

  if (typeof text !== "string" || typeof question !== "string") {
    return response.status(400).json({ error: "Text and question are required." });
  }

  const normalizedText = text.trim().slice(0, MAX_TEXT_LENGTH);
  const normalizedQuestion = question.trim().slice(0, MAX_QUESTION_LENGTH);

  if (!normalizedText || !normalizedQuestion) {
    return response.status(400).json({ error: "Text and question cannot be empty." });
  }

  try {
    const upstreamResponse = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that answers questions based on provided document text.",
          },
          {
            role: "user",
            content: `Document text:\n"""\n${normalizedText}\n"""\n\nQuestion: ${normalizedQuestion}`,
          },
        ],
      }),
    });

    const payload = (await upstreamResponse.json()) as DeepSeekResponse;

    if (!upstreamResponse.ok) {
      return response.status(upstreamResponse.status).json({
        error: payload.error?.message ?? "DeepSeek request failed.",
      });
    }

    const answer = normalizeContent(payload.choices?.[0]?.message?.content);

    if (!answer) {
      return response.status(502).json({ error: "DeepSeek returned an empty response." });
    }

    return response.status(200).json({ answer });
  } catch (error) {
    console.error("Ask PDF API failed:", error);
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected server error.",
    });
  }
}
