const ALL_SOURCES = [
  'Reddit',
  'Quora',
  'Google PAA',
  'YouTube',
  'Twitter/X',
  'Financial forums',
  'News comments',
];

interface SourceControlsProps {
  activeSources: string[];
  onSourceChange: (sources: string[]) => void;
  isLoading: boolean;
  onScan: () => void;
}

export function SourceControls({
  activeSources,
  onSourceChange,
  isLoading,
  onScan,
}: SourceControlsProps) {
  const toggleSource = (source: string) => {
    onSourceChange(
      activeSources.includes(source)
        ? activeSources.filter(s => s !== source)
        : [...activeSources, source]
    );
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {ALL_SOURCES.map(source => (
          <button
            key={source}
            onClick={() => toggleSource(source)}
            className={`rounded-full border px-3 py-1 font-mono text-xs uppercase transition ${
              activeSources.includes(source)
                ? 'border-primary bg-primary text-background'
                : 'border-border text-muted-foreground hover:bg-card'
            }`}
          >
            {source}
          </button>
        ))}
      </div>

      <button
        onClick={onScan}
        disabled={isLoading || activeSources.length === 0}
        className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-background transition hover:bg-primary/90 disabled:opacity-50"
      >
        <span
          className={`inline-block h-2 w-2 rounded-full bg-blue-300 ${
            isLoading ? 'animate-pulse' : ''
          }`}
        ></span>
        {isLoading ? 'Scanning…' : 'Run live scan'}
      </button>
    </div>
  );
}
