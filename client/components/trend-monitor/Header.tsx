import { Search, Sparkles, Activity } from 'lucide-react';

interface TrendMonitorHeaderProps {
  lastRunTime: string;
}

export function TrendMonitorHeader({ lastRunTime }: TrendMonitorHeaderProps) {
  return (
    <header className="border-b border-white/5 bg-[#12110F] px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative flex h-12 w-12 items-center justify-center">
             {/* High-Fidelity Glow Node */}
             <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />
             <div className="relative z-10 h-10 w-10 bg-zinc-900 border-2 border-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(45,237,156,0.2)]">
                <Search className="h-5 w-5 text-primary" />
             </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
              Trend <span className="text-primary italic">Monitor</span>
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                Inherit Intelligence Node
              </span>
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-mono text-primary/80 uppercase">
                Uplink: Deterministic
              </span>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
              System Telemetry
            </span>
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-primary/50" />
              <span className="text-xs font-bold text-white/90">
                Last Scan: {lastRunTime}
              </span>
            </div>
          </div>
          
          <div className="h-10 w-px bg-white/5" />
          
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-white/5 group hover:border-primary/20 transition-all cursor-help">
            <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
