import { Trend } from '@shared/api';

const THEME_COLORS: Record<
  string,
  { dot: string; fill: string; label: string; bgClass: string }
> = {
  'Tax strategy': {
    dot: '#f59e0b',
    fill: '#f59e0b',
    label: 'TAG-TAX',
    bgClass: 'bg-amber-400/20 text-amber-400',
  },
  'Trust & estate': {
    dot: '#a855f7',
    fill: '#a855f7',
    label: 'TAG-TRUST',
    bgClass: 'bg-purple/20 text-purple',
  },
  'Invest strategy': {
    dot: '#4f9cf9',
    fill: '#4f9cf9',
    label: 'TAG-STRATEGY',
    bgClass: 'bg-info/20 text-info',
  },
  'Heirs & family': {
    dot: '#14b8a6',
    fill: '#14b8a6',
    label: 'TAG-HEIRS',
    bgClass: 'bg-teal/20 text-teal',
  },
  'Legal process': {
    dot: '#ef4444',
    fill: '#ef4444',
    label: 'TAG-LEGAL',
    bgClass: 'bg-red-500/20 text-red-500',
  },
  'General': {
    dot: '#8b90a0',
    fill: '#8b90a0',
    label: 'TAG-GENERAL',
    bgClass: 'bg-muted text-muted-foreground',
  },
};

interface TrendRowProps {
  trend: Trend;
  maxVolume: number;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function TrendRow({
  trend,
  maxVolume,
  isSelected,
  onClick,
  index,
}: TrendRowProps) {
  const trendColors = {
    up: { arrow: '▲', className: 'text-success' },
    new: { arrow: '★', className: 'text-info' },
    flat: { arrow: '–', className: 'text-muted-foreground' },
  };

  const trendInfo = trendColors[trend.trend] || trendColors.flat;
  const volPct = Math.round(((trend.volume_pct || 50) / maxVolume) * 100);
  const themeColor = THEME_COLORS[trend.theme] || THEME_COLORS['General'];

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border-b border-border px-5 py-4 transition hover:bg-muted/30 ${
        isSelected ? 'bg-muted/20' : ''
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1 pt-0.5 min-w-fit">
          <span className="font-mono text-xs font-medium text-muted-foreground">
            {trend.rank || index + 1}
          </span>
          <span className={`text-xs ${trendInfo.className}`}>{trendInfo.arrow}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 text-sm leading-relaxed">{trend.question}</div>

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{trend.source}</span>
            {trend.subreddit_or_tag && (
              <span className="font-mono text-xs text-muted-foreground">
                · {trend.subreddit_or_tag}
              </span>
            )}
            <span
              className={`rounded-sm px-2 py-0.5 font-mono text-xs uppercase ${themeColor.bgClass}`}
            >
              {trend.theme}
            </span>
          </div>

          <div className="h-0.5 w-full rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-info transition-all duration-600"
              style={{ width: `${volPct}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
