const SERPAPI_KEY = process.env.SERPAPI_KEY || "";

export interface GooglePAAQuestion {
  question: string;
  snippet: string;
  title: string;
  link: string;
}

/**
 * Fetch questions from Google "People Also Ask" via SerpAPI
 */
export async function fetchGooglePAAQuestions(
  query: string
): Promise<GooglePAAQuestion[]> {
  console.log(`[SerpAPI] Initiating fetch for query: "${query}"`);
  
  if (!SERPAPI_KEY || SERPAPI_KEY === "REPLACE_ENV.SERPAPI_KEY" || SERPAPI_KEY.includes("REPLACE")) {
    console.warn("[SerpAPI] SERPAPI_KEY is not configured or contains placeholder. Returning empty results.");
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      engine: "google",
      api_key: SERPAPI_KEY,
    });

    const url = `https://serpapi.com/search?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[SerpAPI] Error response (${response.status}):`, errorBody);
      return [];
    }

    const data = await response.json();
    console.log(`[SerpAPI] Successfully retrieved ${data.people_also_ask?.length || 0} PAA results.`);
    const paaResults = data.people_also_ask || [];

    return paaResults.map(
      (item: any) => ({
        question: item.question || "",
        snippet: item.snippet || "",
        title: item.title || "",
        link: item.link || "",
      })
    ).filter((item: any) => item.question !== "");
  } catch (error: any) {
    console.error("[SerpAPI] Fetch execution failed:", error.message || error);
    return [];
  }
}

/**
 * Fetch recent discussions from specific subreddits via SerpAPI Google engine
 */
export async function fetchRedditTrends(
  query: string,
  subreddits: string[] = ["personalfinance", "estateplanning", "inheritance"]
): Promise<any[]> {
  console.log(`[SerpAPI] Initiating Reddit telemetry for: "${query}"`);

  if (!SERPAPI_KEY || SERPAPI_KEY.includes("REPLACE")) {
    return [];
  }

  try {
    const siteQuery = subreddits.map(s => `site:reddit.com/r/${s}`).join(" OR ");
    const fullQuery = `(${siteQuery}) ${query}`;

    const params = new URLSearchParams({
      q: fullQuery,
      engine: "google",
      tbs: "qdr:m", // Results from the past month
      api_key: SERPAPI_KEY,
    });

    const response = await fetch(`https://serpapi.com/search?${params}`);
    if (!response.ok) return [];

    const data = await response.json();
    const results = data.organic_results || [];

    return results.map((item: any) => ({
      question: item.title || "",
      snippet: item.snippet || "",
      link: item.link || "",
      subreddit: item.link?.split("/r/")[1]?.split("/")[0] || "reddit",
    })).filter((item: any) => item.question !== "");
  } catch (error: any) {
    console.error("[SerpAPI Reddit] Fetch execution failed:", error.message);
    return [];
  }
}

/**
 * Categorize a question into one of the inheritance themes
 */
export function categorizeQuestion(question: string): string {
  if (!question) return "General";
  const lower = question.toLowerCase();

  if (
    lower.includes("tax") ||
    lower.includes("estate tax") ||
    lower.includes("inheritance tax")
  ) {
    return "Tax strategy";
  } else if (
    lower.includes("trust") ||
    lower.includes("will") ||
    lower.includes("estate planning")
  ) {
    return "Trust & estate";
  } else if (
    lower.includes("invest") ||
    lower.includes("stock") ||
    lower.includes("portfolio") ||
    lower.includes("return")
  ) {
    return "Invest strategy";
  } else if (
    lower.includes("family") ||
    lower.includes("heir") ||
    lower.includes("parent") ||
    lower.includes("child") ||
    lower.includes("children")
  ) {
    return "Heirs & family";
  } else if (
    lower.includes("legal") ||
    lower.includes("attorney") ||
    lower.includes("probate") ||
    lower.includes("lawsuit")
  ) {
    return "Legal process";
  }

  return "General";
}

/**
 * Determine trend status based on query recency
 */
export function determineTrend(
  index: number
): "up" | "new" | "flat" {
  if (index === 0) return "up";
  if (index === 1 || index === 2) return "new";
  return "flat";
}

/**
 * Generate investor insight based on question
 */
export function generateInsight(question: string): string {
  const insights: Record<string, string> = {
    "Tax strategy":
      "Signals peak concern about tax liability among younger heirs. Investors should emphasize tax-efficient wealth transfer strategies.",
    "Trust & estate":
      "Fundamental educational interest shows widespread confusion about estate structures. Content opportunity to position as thought leader.",
    "Invest strategy":
      "New entrants asking about investment priority. Shows receptiveness to wealth-building conversations and investment guidance.",
    "Heirs & family":
      "Highlights multi-generational wealth planning interest. Opportunity to position as family advisor.",
    "Legal process":
      "Reveals confusion about procedures. Educational content addressing legal concerns builds trust.",
    "General":
      "Baseline interest in inheritance topics. Opportunity for broader wealth education content.",
  };

  const theme = categorizeQuestion(question);
  return insights[theme] || insights["General"];
}

/**
 * Generate content angle for creators
 */
export function generateContentAngle(question: string): string {
  if (!question) return "Create educational content addressing this specific question.";
  if (question.toLowerCase().includes("how much")) {
    return "Create a calculator tool or guide showing actual inheritance tax scenarios.";
  } else if (question.toLowerCase().includes("difference between")) {
    return "Post a side-by-side comparison addressing this common confusion point.";
  } else if (question.toLowerCase().includes("should")) {
    return "Share a decision framework addressing the specific scenario raised.";
  } else if (question.toLowerCase().includes("how to")) {
    return "Create a step-by-step guide addressing this practical question.";
  } else if (question.toLowerCase().includes("what")) {
    return "Publish an explainer article or video addressing this knowledge gap.";
  }

  return "Create educational content addressing this specific question.";
}
