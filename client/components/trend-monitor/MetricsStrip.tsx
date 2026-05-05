import { Hash, TrendingUp, Search, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsStripProps {
  total: number;
  topTheme?: string;
  topThemePct?: number;
  hotQuestion?: string;
  sourcesCount: number;
}

export function MetricsStrip({
  total,
  topTheme,
  topThemePct,
  hotQuestion,
  sourcesCount,
}: MetricsStripProps) {
  const metrics = [
    {
      label: 'Question Nodes',
      value: total || 0,
      sub: `${sourcesCount} Sources Syncing`,
      icon: Hash,
      color: 'text-primary'
    },
    {
      label: 'Primary Theme',
      value: topTheme || 'N/A',
      sub: topThemePct ? `${topThemePct}% concentration` : 'Calculating...',
      icon: Layers,
      color: 'text-blue-400'
    },
    {
      label: 'Momentum Peak',
      value: hotQuestion ? (hotQuestion.length > 25 ? hotQuestion.substring(0, 25) + '...' : hotQuestion) : 'N/A',
      sub: 'High-Velocity Signal',
      icon: TrendingUp,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {metrics.map((m, i) => (
        <div key={i} className="bg-[#12110F] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <m.icon size={80} className={m.color} />
          </div>
          
          <div className="flex flex-col h-full relative z-10">
             <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40 mb-4 flex items-center gap-2">
                <div className={cn("h-1 w-1 rounded-full", m.color.replace('text-', 'bg-'))} />
                {m.label}
             </span>
             <h4 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">
                {m.value}
             </h4>
             <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                {m.sub}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}
