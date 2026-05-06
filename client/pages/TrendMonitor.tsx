import { useState, useEffect } from 'react';
import { Trend, ScanResult } from '@shared/api';
import { TrendMonitorHeader } from '@/components/trend-monitor/Header';
import { MetricsStrip } from '@/components/trend-monitor/MetricsStrip';
import { SourceControls } from '@/components/trend-monitor/SourceControls';
import { ResultsPanel } from '@/components/trend-monitor/ResultsPanel';
import { DetailPanel } from '@/components/trend-monitor/DetailPanel';
import { ThemeBreakdownPanel } from '@/components/trend-monitor/ThemeBreakdownPanel';

export default function TrendMonitor() {
  const [results, setResults] = useState<Trend[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [scanData, setScanData] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<string>('never');
  const [activeSources, setActiveSources] = useState<string[]>([
    'Reddit',
    'Quora',
    'Google PAA',
    'YouTube',
  ]);

  useEffect(() => {
    const updateTime = () => {
      const el = document.getElementById('footerTime');
      if (el) {
        const now = new Date();
        el.textContent = now.toLocaleTimeString();
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScan = async () => {
    if (activeSources.length === 0) {
      alert('Select at least one source to scan.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/scan-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sources: activeSources }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Scan failed response:', response.status, errorText);
        throw new Error(errorText || 'Scan failed');
      }

      const data: ScanResult = await response.json();
      setScanData(data);
      setResults(data.questions || []);
      setSelectedIdx(null);
      setLastRunTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Scan error:', error);
      alert('Failed to run scan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TrendMonitorHeader lastRunTime={lastRunTime} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <MetricsStrip
          total={results.length}
          topTheme={scanData?.top_theme}
          topThemePct={scanData?.top_theme_pct}
          hotQuestion={results[0]?.question}
          sourcesCount={activeSources.length}
        />

        <SourceControls
          activeSources={activeSources}
          onSourceChange={setActiveSources}
          isLoading={isLoading}
          onScan={handleScan}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 lg:gap-6">
          <div className="lg:col-span-3">
            <ResultsPanel
              results={results}
              selectedIdx={selectedIdx}
              onSelectRow={setSelectedIdx}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6">
            <DetailPanel
              trend={selectedIdx !== null ? results[selectedIdx] : null}
            />
            <ThemeBreakdownPanel results={results} />
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t border-border px-6 py-4">
        <div className="mx-auto max-w-7xl flex justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            Inherit Intelligence · DTE Solutions LLC
          </span>
          <span
            className="font-mono text-xs text-muted-foreground"
            id="footerTime"
          ></span>
        </div>
      </footer>
    </div>
  );
}
