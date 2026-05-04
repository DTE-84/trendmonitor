interface TrendMonitorHeaderProps {
  lastRunTime: string;
}

export function TrendMonitorHeader({ lastRunTime }: TrendMonitorHeaderProps) {
  return (
    <header className="border-b border-border px-6 py-6">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-background"
            >
              <path
                d="M3 14L9 4L15 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="4" r="1.5" fill="currentColor" />
              <line
                x1="5.5"
                y1="10"
                x2="12.5"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold">Inherit Intelligence</div>
            <div className="font-mono text-xs text-muted-foreground">Trend Monitor v1.0</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-muted-foreground">
            Last scan: <span className="text-success">{lastRunTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
