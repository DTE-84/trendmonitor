interface MetricsStripProps {
  total: number;
  topTheme?: string;
  topThemePct?: number;
  hotQuestion?: string;
  sourcesCount: number;
}

function MetricCard({
  label,
  value,
  subtext,
  accent,
}: {
  label: string;
  value: string | number;
  subtext: string;
  accent: 'blue' | 'green' | 'amber' | 'purple';
}) {
  const accentColors = {
    blue: 'bg-info',
    green: 'bg-success',
    amber: 'bg-warning',
    purple: 'bg-purple',
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentColors[accent]}`}></div>
      <div className="font-mono text-xs uppercase text-muted-foreground">
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div className="mt-1 font-mono text-xs text-muted-foreground">{subtext}</div>
    </div>
  );
}

export function MetricsStrip({
  total,
  topTheme,
  topThemePct,
  hotQuestion,
  sourcesCount,
}: MetricsStripProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Questions found"
        value={total || '—'}
        subtext={total ? '↑ from live web scan' : 'run a scan to populate'}
        accent="blue"
      />
      <MetricCard
        label="Top theme"
        value={topTheme || '—'}
        subtext={topThemePct ? `${topThemePct}% of questions` : '—'}
        accent="green"
      />
      <MetricCard
        label="Hottest question"
        value={
          hotQuestion ? (hotQuestion.length > 40 ? hotQuestion.slice(0, 37) + '…' : hotQuestion) : '—'
        }
        subtext=""
        accent="amber"
      />
      <MetricCard
        label="Sources scanned"
        value={sourcesCount}
        subtext={sourcesCount === 0 ? 'none selected' : `${sourcesCount} active`}
        accent="purple"
      />
    </div>
  );
}
