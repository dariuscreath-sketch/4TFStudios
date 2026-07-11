import React from 'react';
import { Trophy, TrendingUp, Zap } from 'lucide-react';

interface ScoreTickerProps {
  matches: any[];
  onSelectMatch: (match: any) => void;
}

export const ScoreTicker: React.FC<ScoreTickerProps> = ({ matches, onSelectMatch }) => {
  const liveMatches = matches.filter(m => m.status === 'live').slice(0, 8);
  if (liveMatches.length === 0) return null;

  return (
    <div className="bg-white/[0.03] border-y border-white/5 overflow-hidden">
      <div className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto no-scrollbar">
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase shrink-0 mr-1">
          <Zap className="w-3 h-3" />
          LIVE
        </span>
        {liveMatches.map(m => (
          <button
            key={m.id}
            onClick={() => onSelectMatch(m)}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-full px-2.5 py-1 shrink-0 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-medium text-neutral-200 whitespace-nowrap">{m.homeTeam.name}</span>
            <span className="text-[11px] font-bold text-emerald-400">{m.homeTeam.score}</span>
            <span className="text-[9px] text-neutral-500">-</span>
            <span className="text-[11px] font-bold text-red-400">{m.awayTeam.score}</span>
            <span className="text-[11px] font-medium text-neutral-200 whitespace-nowrap">{m.awayTeam.name}</span>
            <span className="text-[9px] text-neutral-500 ml-0.5">{m.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
};