/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export interface Trend {
  rank: number;
  question: string;
  source: string;
  theme: string;
  trend: 'up' | 'new' | 'flat';
  volume_pct: number;
  subreddit_or_tag: string;
  investor_insight: string;
  content_angle: string;
}

export interface ScanResult {
  questions: Trend[];
  top_theme: string;
  top_theme_pct: number;
  summary: string;
}
