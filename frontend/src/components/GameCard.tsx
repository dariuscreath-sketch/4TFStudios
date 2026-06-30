import React from 'react';
import { Sparkles, TrendingUp, MapPin } from 'lucide-react';
import type { Match } from '../mockData';

interface GameCardProps {
  match: Match;
  onClick: () => void;
  isPremium: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ match, onClick, isPremium }) => {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  return (
    <div
      onClick={onClick}
      className="sport-card bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-emerald-500/20 rounded-xl p-4 mb-2.5 cursor-pointer shadow-lg active:scale-[0.99] group"
    >
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[10px] font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md uppercase tracking-wider border border-white/5">
          {match.league}
        </span>
        <div className="flex items-center gap-1.5">
          {isLive && (
            <span className="flex items-center gap-1 bg-red-950/60 border border-red-500/20 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase pulse-ring">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
              Live
            </span>
          )}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
            isLive 
              ? 'bg-neutral-800 text-neutral-200' 
              : isCompleted 
                ? 'bg-neutral-800/50 text-neutral-400' 
                : 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20'
          }`}>
            {match.time}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center py-1">
        <div className="flex flex-col gap-3.5 flex-1">
          {/* Home Team */}
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none">{match.homeTeam.logo}</span>
              <span className="font-semibold text-neutral-200 text-sm md:text-base leading-tight">
                {match.homeTeam.name}
              </span>
            </div>
            {(isLive || isCompleted) && (
              <span className="font-bold text-base md:text-lg text-white">
                {match.homeTeam.score}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none">{match.awayTeam.logo}</span>
              <span className="font-semibold text-neutral-200 text-sm md:text-base leading-tight">
                {match.awayTeam.name}
              </span>
            </div>
            {(isLive || isCompleted) && (
              <span className="font-bold text-base md:text-lg text-white">
                {match.awayTeam.score}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-400">
        <span className="flex items-center gap-1 max-w-[55%] truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{match.venue}</span>
        </span>
        <div className="flex items-center gap-2">
          {match.hasAiSummary && (
            <span className="inline-flex items-center gap-0.5 text-purple-400 font-semibold bg-purple-950/20 px-1.5 py-0.5 rounded border border-purple-500/10">
              <Sparkles className="w-3 h-3" />
              Summary
            </span>
          )}
          {match.hasPrediction && (
            <span className={`inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded border ${
              match.prediction?.isPremium 
                ? 'text-amber-400 bg-amber-950/20 border-amber-500/10' 
                : 'text-emerald-400 bg-emerald-950/20 border-emerald-500/10'
            }`}>
              <TrendingUp className="w-3 h-3" />
              {match.prediction?.isPremium ? 'AI Lock' : 'Pick'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
