import { Trend } from '@shared/api';

const THEME_COLORS: Record<string, { fill: string }> = {
  'Tax strategy': { fill: '#f59e0b' },
  'Trust & estate': { fill: '#a855f7' },
  'Invest strategy': { fill: '#4f9cf9' },
  'Heirs & family': { fill: '#14b8a6' },
  'Legal process': { fill: '#ef4444' },
  'General': { fill: '#8b90a0' },
};

interface ThemeBreakdownPanelProps {
  results: Trend[];
}

export function ThemeBreakdownPanel({ results }: ThemeBreakdownPanelProps) {
  const themes: Record<string, number> = {};
  results.forEach(q => {
    themes[q.theme] = (themes[q.theme] || 0) + 1;
  });

  const total = results.length || 1;
  const sorted = Object.entries(themes).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-3">
        <div className="font-mono text-xs uppercase text-muted-foreground">Theme breakdown</div>
      </div>
      <div className="p-5">
        {sorted.length === 0 ? (
          <div className="text-center font-mono text-xs text-muted-foreground">
            Themes will appear after your first scan.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(([name, count]) => {
              const pct = Math.round((count / total) * 100);
              const color = THEME_COLORS[name] || THEME_COLORS['General'];

              return (
                <div key={name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: color.fill }}
                      ></div>
                      <span className="text-xs text-muted-foreground">{name}</span>
                    </div>
                    <span className="font-mono text-xs text-foreground">{pct}%</span>
                  </div>
                  <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color.fill,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
