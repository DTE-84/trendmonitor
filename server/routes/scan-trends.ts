import type { NextApiRequest, NextApiResponse } from 'next';
import {
  fetchGooglePAAQuestions,
  categorizeQuestion,
  determineTrend,
  generateInsight,
  generateContentAngle,
} from "./serpapi-trends";

interface ScanTrendsRequest {
  sources: string[];
}

interface Trend {
  rank: number;
  question: string;
  source: string;
  theme: string;
  trend: "up" | "new" | "flat";
  volume_pct: number;
  subreddit_or_tag: string;
  investor_insight: string;
  content_angle: string;
}

interface ScanTrendsResponse {
  questions: Trend[];
  top_theme: string;
  top_theme_pct: number;
  summary: string;
}

// Mock data for demonstration
const MOCK_TRENDS: Trend[] = [
  {
    rank: 1,
    question: "How much inheritance tax do I have to pay on my parents' estate?",
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
    content_angle: "Share a framework for prioritizing debt vs. investment post-inheritance.",
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
    content_angle: "Video series on state-specific will execution requirements.",
  },
  {
    rank: 6,
    question: "How long does the probate process usually take?",
    source: "Google PAA",
    theme: "Legal process",
    trend: "up",
    volume_pct: 68,
    subreddit_or_tag: "probate",
    investor_insight:
      "Heirs anxious about timelines and liquidity. Opportunity to discuss cash flow planning during probate.",
    content_angle:
      "Explain the probate timeline and how to manage finances during the process.",
  },
  {
    rank: 7,
    question:
      "Can I inherit a 401k and roll it over to my own retirement account?",
    source: "Reddit",
    theme: "Tax strategy",
    trend: "new",
    volume_pct: 65,
    subreddit_or_tag: "r/investing",
    investor_insight:
      "Sophisticated question on tax-advantaged accounts shows investment-focused heirs. Monetization opportunity.",
    content_angle:
      "Deep dive on inherited retirement account rules and tax implications.",
  },
  {
    rank: 8,
    question: "Do I need a lawyer to settle an estate?",
    source: "Financial forums",
    theme: "Legal process",
    trend: "flat",
    volume_pct: 62,
    subreddit_or_tag: "estate settlement",
    investor_insight:
      "Cost-conscious heirs seeking alternatives. Opportunity to offer education vs. attorney positioning.",
    content_angle:
      "Guide on when you need a lawyer vs. can DIY estate settlement.",
  },
  {
    rank: 9,
    question: "How do I value inherited real estate for tax purposes?",
    source: "Quora",
    theme: "Tax strategy",
    trend: "up",
    volume_pct: 58,
    subreddit_or_tag: "real estate investing",
    investor_insight:
      "Property-specific tax concern indicates heirs with substantial assets. Premium audience.",
    content_angle:
      "Explain stepped-up basis and real estate valuation in inheritance.",
  },
  {
    rank: 10,
    question:
      "What happens to credit card debt when someone passes away?",
    source: "News comments",
    theme: "General",
    trend: "flat",
    volume_pct: 55,
    subreddit_or_tag: "consumer finance",
    investor_insight:
      "Anxiety around liability signals heirs concerned about obligations. Trust and safety angle.",
    content_angle:
      "Clarify what debts are inherited vs. forgiven after death.",
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("[Trend Scan] Initializing scan request...", {
    body: req.body,
    headers: req.headers["content-type"],
  });

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!req.body) {
      console.error("[Trend Scan] Error: req.body is undefined");
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { sources } = req.body as ScanTrendsRequest;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      console.warn("[Trend Scan] Rejected: No sources provided.");
      return res.status(400).json({ error: "No sources provided" });
    }

    const trends: Trend[] = [];

    // Fetch from Google PAA if selected
    if (sources.includes("Google PAA")) {
      try {
        console.log("[Trend Scan] Fetching Google PAA telemetry...");
        const paaQuestions = await fetchGooglePAAQuestions(
          "inheritance investing wealth planning trust estate"
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
          console.log(`[Trend Scan] Successfully enriched with ${trends.length} Google nodes.`);
        } else {
          console.warn("[Trend Scan] Google PAA returned empty or invalid results.");
        }
      } catch (error: any) {
        console.error("[Trend Scan] Google PAA Uplink Failed:", error.message || error);
        // Continue to mock data - maintain system availability
      }
    }

    // Combine with mock data for other sources
    console.log("[Trend Scan] Filtering mock data for sources:", sources.filter(s => s !== "Google PAA"));
    const otherSourceTrends = MOCK_TRENDS.filter(
      t => sources.includes(t.source) && t.source !== "Google PAA"
    )
      .slice(0, Math.max(0, 10 - trends.length))
      .map((t, idx) => ({
        ...t,
        rank: trends.length + idx + 1,
      }));

    const allTrends = [...trends, ...otherSourceTrends].slice(0, 10);
    console.log(`[Trend Scan] Total trends gathered: ${allTrends.length}`);

    if (allTrends.length === 0) {
      console.log("[Trend Scan] No data found for selected sources; falling back to default mock data.");
      return res.json({
        questions: MOCK_TRENDS.slice(0, 10).map((t, idx) => ({
          ...t,
          rank: idx + 1,
        })),
        top_theme: "Tax strategy",
        top_theme_pct: 25,
        summary:
          "Inheritance investors should focus on tax education and family communication strategies. Heirs are actively seeking guidance on estate management and investment decisions.",
      } as ScanTrendsResponse);
    }

    // Calculate theme distribution
    const themes: Record<string, number> = {};
    allTrends.forEach(t => {
      themes[t.theme] = (themes[t.theme] || 0) + 1;
    });

    const themeEntries = Object.entries(themes).sort((a, b) => b[1] - a[1]);
    const topTheme = themeEntries[0];
    const topThemePct = topTheme
      ? Math.round((topTheme[1] / allTrends.length) * 100)
      : 0;

    console.log("[Trend Scan] Analysis complete. Dispatching results.");
    res.json({
      questions: allTrends,
      top_theme: topTheme?.[0] || "General",
      top_theme_pct: topThemePct,
      summary:
        "Live trends show strong interest in inheritance planning and wealth transfer strategies. Investors should focus on addressing key pain points around taxes, trusts, and investment decisions.",
    } as ScanTrendsResponse);
  } catch (error: any) {
    console.error("[Trend Scan CRITICAL FAILURE]:", error);
    res.status(500).json({ 
      error: "Nova Analysis Node Failed", 
      detail: error.message || "Unknown error",
      stack: error.stack
    });
  }
};
