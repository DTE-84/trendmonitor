import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    return res.status(200).json({
      questions: [],
      top_theme: "Test",
      top_theme_pct: 100,
      summary: "API route is working",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Unknown error",
    });
  }
}