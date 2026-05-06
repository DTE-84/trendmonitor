import { Trend } from '@shared/api';
import { useState } from 'react';

interface DetailPanelProps {
  trend: Trend | null;
}

export function DetailPanel({ trend }: DetailPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (trend?.content_angle) {
      navigator.clipboard.writeText(trend.content_angle);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-3">
        <div className="font-mono text-xs uppercase text-muted-foreground">Question detail</div>
      </div>
      <div className="p-5">
        {!trend ? (
          <div className="text-center font-mono text-xs text-muted-foreground">
            Select a question from the list to see investor insight and content angle.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm leading-relaxed">{trend.question}</div>

            <div>
              <div className="mb-1 font-mono text-xs uppercase text-muted-foreground">Source</div>
              <div className="text-xs text-muted-foreground">
                {trend.source}
                {trend.subreddit_or_tag && ` · ${trend.subreddit_or_tag}`}
              </div>
            </div>

            <div>
              <div className="mb-1 font-mono text-xs uppercase text-muted-foreground">
                Investor insight
              </div>
              <div className="text-xs italic text-muted-foreground">{trend.investor_insight}</div>
            </div>

            <div>
              <div className="mb-1 font-mono text-xs uppercase text-muted-foreground">
                Content angle
              </div>
              <div className="text-xs text-muted-foreground">{trend.content_angle}</div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 font-mono text-xs uppercase transition hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              {copied ? 'Copied!' : 'Copy content angle'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
