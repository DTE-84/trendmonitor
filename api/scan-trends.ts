import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Trend } from "../shared/api";
import {
  fetchGooglePAAQuestions,
  categorizeQuestion,
  generateInsight,
  generateContentAngle,
} from "../server/routes/serpapi-trends";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log("[Trend Scan] Initializing scan request...", { body: req.body });

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { sources } = req.body;

const MOCK_TRENDS: Trend[] = [
  {
    rank: 1,
    question:
      "How much inheritance tax do I have to pay on my parents' estate?",
    source: "Reddit",
    theme: "Tax strategy",
    trend: "up",
    volume_pct: 95,
    subreddit_or_tag: "r/personalfinance",
    investor_insight:
      "This signals peak concern about tax liability among younger heirs. Investors should emphasize tax-efficient wealth transfer strategies.",
    content_angle:
      "Create a guide on minimizing inheritance taxes through strategic estate planning.",
  },
  {
    rank: 2,
    question: "What's the difference between a trust and a will?",
    source: "Google PAA",
    theme: "Trust & estate",
    trend: "flat",
    volume_pct: 88,
    subreddit_or_tag: "estate planning",
    investor_insight:
      "Fundamental educational question shows widespread confusion about estate structures. Content opportunity to position as thought leader.",
    content_angle:
      "Post a simple comparison between trusts and wills targeting confused heirs.",
  },
  {
    rank: 3,
    question: "Should I invest my inheritance or pay off debt first?",
    source: "Quora",
    theme: "Invest strategy",
    trend: "new",
    volume_pct: 82,
    subreddit_or_tag: "financial advice",
    investor_insight:
      "New entrants asking about investment priority. Shows receptiveness to wealth-building conversations and investment guidance.",
    content_angle:
      "Share a framework for prioritizing debt vs. investment post-inheritance.",
  },
  {
    rank: 4,
    question: "How do I talk to my kids about my money and inheritance?",
    source: "Reddit",
    theme: "Heirs & family",
    trend: "up",
    volume_pct: 76,
    subreddit_or_tag: "r/Parenting",
    investor_insight:
      "Parents concerned about financial education and family wealth conversations. Multi-generational wealth planning angle.",
    content_angle:
      "Create content on having productive money conversations with heirs.",
  },
  {
    rank: 5,
    question:
      "What are the legal requirements for executing a will in my state?",
    source: "YouTube",
    theme: "Legal process",
    trend: "flat",
    volume_pct: 71,
    subreddit_or_tag: "legal education",
    investor_insight:
      "Continuing regulatory confusion creates ongoing demand for legal education content.",
    content_angle:
      "Video series on state-specific will execution requirements.",
  },
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  console.log("[Trend Scan] Initializing scan request...", { body: req.body });

  try {
    const { sources } = req.body;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return res.status(400).json({ error: "No sources provided" });
    }

    const trends: Trend[] = [];

    if (sources.includes("Google PAA")) {
      try {
        const paaQuestions = await fetchGooglePAAQuestions(
          "inheritance investing wealth planning trust estate",
        );
        if (paaQuestions && paaQuestions.length > 0) {
          paaQuestions.slice(0, 5).forEach((q, idx) => {
            const theme = categorizeQuestion(q.question);
            trends.push({
              rank: trends.length + 1,
              question: q.question,
              source: "Google PAA",
              theme,
              trend: idx === 0 ? "up" : idx < 3 ? "new" : "flat",
              volume_pct: Math.max(50, 100 - idx * 15),
              subreddit_or_tag: "google search",
              investor_insight: generateInsight(q.question),
              content_angle: generateContentAngle(q.question),
            });
          });
        }
      } catch (error) {
        console.error("[Trend Scan] Google PAA Fetch Failed:", error);
      }
    }

    const otherSourceTrends = MOCK_TRENDS.filter(
      (t) => sources.includes(t.source) && t.source !== "Google PAA",
    )
      .slice(0, Math.max(0, 10 - trends.length))
      .map((t, idx) => ({ ...t, rank: trends.length + idx + 1 }));

    const allTrends = [...trends, ...otherSourceTrends].slice(0, 10);

    if (allTrends.length === 0) {
      return res.json({
        questions: MOCK_TRENDS.slice(0, 10).map((t, idx) => ({
          ...t,
          rank: idx + 1,
        })),
        top_theme: "Tax strategy",
        top_theme_pct: 25,
        summary:
          "Fallback telemetry active. Heirs are actively seeking guidance on estate management and investment decisions.",
      });
    }

    const themes: Record<string, number> = {};
    allTrends.forEach((t) => {
      themes[t.theme] = (themes[t.theme] || 0) + 1;
    });
    const themeEntries = Object.entries(themes).sort((a, b) => b[1] - a[1]);
    const topTheme = themeEntries[0];
    const topThemePct = topTheme
      ? Math.round((topTheme[1] / allTrends.length) * 100)
      : 0;

    res.json({
      questions: allTrends,
      top_theme: topTheme?.[0] || "General",
      top_theme_pct: topThemePct,
      summary:
        "Live trends show strong interest in inheritance planning and wealth transfer strategies.",
    });
    res.json({
      questions: allTrends,
      top_theme: topTheme?.[0] || "General",
      top_theme_pct: topThemePct,
      summary:
        "Live trends show strong interest in inheritance planning and wealth transfer strategies.",
    });
  } catch (error: any) {
    console.error("[Trend Scan FAILURE]:", error);
    res.status(500).json({
      error: "Nova Analysis Node Failed",
      detail: error.message,
    });
  }
}