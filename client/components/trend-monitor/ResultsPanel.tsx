import { Trend } from '@/pages/TrendMonitor';
import { TrendRow } from './TrendRow';

interface ResultsPanelProps {
  results: Trend[];
  selectedIdx: number | null;
  onSelectRow: (idx: number) => void;
  isLoading: boolean;
}

export function ResultsPanel({
  results,
  selectedIdx,
  onSelectRow,
  isLoading,
}: ResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="font-mono text-xs uppercase text-muted-foreground">
            Trending questions
          </span>
          <span className="rounded-sm bg-card px-2 py-1 font-mono text-xs text-info">
            LIVE
          </span>
        </div>
        <div className="p-5">
          <div className="mb-5 font-mono text-xs text-muted-foreground text-center">
            Scanning sources…
          </div>
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="mb-2 h-16 animate-pulse rounded-lg bg-gradient-to-r from-muted to-card"
              ></div>
            ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="font-mono text-xs uppercase text-muted-foreground">
            Trending questions
          </span>
          <span className="rounded-sm bg-card px-2 py-1 font-mono text-xs text-info">
            LIVE
          </span>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 text-2xl opacity-30">◈</div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">No data yet</h3>
          <p className="max-w-xs text-center text-xs text-muted-foreground">
            Select your sources above and hit "Run live scan" to pull trending inheritance
            investing questions from across the web.
          </p>
        </div>
      </div>
    );
  }

  const maxVol = Math.max(...results.map(r => r.volume_pct || 1));

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <span className="font-mono text-xs uppercase text-muted-foreground">
          Trending questions
        </span>
        <span className="rounded-sm bg-card px-2 py-1 font-mono text-xs text-info">
          LIVE
        </span>
      </div>
      <div>
        {results.map((trend, idx) => (
          <TrendRow
            key={idx}
            trend={trend}
            maxVolume={maxVol}
            isSelected={selectedIdx === idx}
            onClick={() => onSelectRow(idx)}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
