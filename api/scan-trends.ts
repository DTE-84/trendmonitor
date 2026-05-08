import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * ULTIMATE STANDALONE VERCEL API HANDLER
 * Hardened with explicit types to satisfy strict TS checks.
 */

const SERPAPI_KEY = process.env.SERPAPI_KEY || "";

interface GooglePAAQuestion {
  question: string;
  snippet: string;
  title: string;
  link: string;
}

async function fetchPAA(query: string): Promise<GooglePAAQuestion[]> {
  if (!SERPAPI_KEY || SERPAPI_KEY.includes("REPLACE")) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      engine: "google",
      api_key: SERPAPI_KEY,
    });
    const response = await fetch(`https://serpapi.com/search?${params}`);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.people_also_ask || []).map((item: any) => ({
      question: item.question || "",
      snippet: item.snippet || "",
      title: item.title || "",
      link: item.link || "",
    })).filter((item: GooglePAAQuestion) => item.question !== "");
  } catch (e) {
    console.error("[SerpAPI Error]", e);
    return [];
  }
}

function getTheme(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("tax")) return "Tax strategy";
  if (l.includes("trust") || l.includes("will")) return "Trust & estate";
  if (l.includes("invest") || l.includes("stock")) return "Invest strategy";
  if (l.includes("family") || l.includes("heir")) return "Heirs & family";
  if (l.includes("legal") || l.includes("probate")) return "Legal process";
  return "General";
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

const MOCK: Trend[] = [
  {
    rank: 1,
    question: "How much inheritance tax do I have to pay on my parents' estate?",
    source: "Reddit",
    theme: "Tax strategy",
    trend: "up",
    volume_pct: 95,
    subreddit_or_tag: "r/personalfinance",
    investor_insight: "Peak concern about tax liability detected.",
    content_angle: "Guide on minimizing inheritance taxes.",
  },
  {
    rank: 2,
    question: "What's the difference between a trust and a will?",
    source: "Google PAA",
    theme: "Trust & estate",
    trend: "flat",
    volume_pct: 88,
    subreddit_or_tag: "estate planning",
    investor_insight: "Confusion about estate structures is high.",
    content_angle: "Trust vs Will comparison.",
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("[API] Scan Trends invoked");

    if (req.method !== "POST") {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { sources } = req.body || {};
    if (!sources || !Array.isArray(sources)) {
      return res.status(400).json({ error: "No sources provided" });
    }

    const trends: Trend[] = [];

    if (sources.includes("Google PAA")) {
      const paa = await fetchPAA("inheritance investing wealth planning trust estate");
      paa.slice(0, 5).forEach((q, idx) => {
        trends.push({
          rank: trends.length + 1,
          question: q.question,
          source: "Google PAA",
          theme: getTheme(q.question),
          trend: idx === 0 ? "up" : idx < 3 ? "new" : "flat",
          volume_pct: Math.max(50, 100 - idx * 15),
          subreddit_or_tag: "google search",
          investor_insight: "Real-time PAA Insight generated.",
          content_angle: "PAA-driven content strategy.",
        });
      });
    }

    const others = MOCK.filter(t => sources.includes(t.source) && t.source !== "Google PAA")
      .slice(0, Math.max(0, 10 - trends.length))
      .map((t, idx) => ({ ...t, rank: trends.length + idx + 1 }));

    const all = [...trends, ...others].slice(0, 10);

    if (all.length === 0) {
      return res.json({
        questions: MOCK.map((t, i) => ({ ...t, rank: i + 1 })),
        top_theme: "Tax strategy",
        top_theme_pct: 25,
        summary: "Fallback telemetry active.",
      });
    }

    const themes: Record<string, number> = {};
    all.forEach(t => { themes[t.theme] = (themes[t.theme] || 0) + 1; });
    const sortedThemes = Object.entries(themes).sort((a, b) => b[1] - (a[1] as any)); // Simple hack for sort typing
    const top = sortedThemes[0] as [string, number] | undefined;

    return res.status(200).json({
      questions: all,
      top_theme: top?.[0] || "General",
      top_theme_pct: top ? Math.round((top[1] / all.length) * 100) : 0,
      summary: "Live trends show interest in inheritance planning.",
    });
  } catch (error: any) {
    console.error("[CRITICAL ERROR]", error);
    return res.status(500).json({ error: "Invocation failed", detail: error.message });
  }
}
