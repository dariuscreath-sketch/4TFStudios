import React from 'react';
import { BarChart2, CheckCircle2 } from 'lucide-react';
import type { Poll } from '../mockData';

interface PollWidgetProps {
  poll: Poll;
  onVote: (optionIndex: number) => void;
  isPremium: boolean;
}

export const PollWidget: React.FC<PollWidgetProps> = ({ poll, onVote, isPremium }) => {
  const hasVoted = poll.userVotedIndex !== undefined;

  return (
    <div className="bg-slate-900/60 border border-neutral-800 rounded-xl p-4 mb-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <BarChart2 className={`w-4.5 h-4.5 ${isPremium ? 'text-amber-500' : 'text-emerald-500'}`} />
        <h4 className="font-bold text-white text-xs md:text-sm leading-tight uppercase tracking-wide">
          Fan Opinion Poll
        </h4>
      </div>

      <p className="text-sm font-semibold text-neutral-200 mb-4 leading-snug">
        {poll.question}
      </p>

      <div className="flex flex-col gap-2.5">
        {poll.options.map((option, idx) => {
          const isSelected = poll.userVotedIndex === idx;
          const percentage = poll.totalVotes > 0 
            ? Math.round((option.votes / poll.totalVotes) * 100) 
            : 0;

          if (hasVoted) {
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-lg p-3 border text-xs md:text-sm flex justify-between items-center transition-all ${
                  isSelected
                    ? isPremium
                      ? 'border-amber-500/50 bg-amber-950/15'
                      : 'border-emerald-500/50 bg-emerald-950/15'
                    : 'border-neutral-800/60 bg-neutral-900/40 text-neutral-300'
                }`}
              >
                {/* Progress bar overlay */}
                <div
                  className={`absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out opacity-20 ${
                    isPremium ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />

                <span className="font-semibold relative z-10 flex items-center gap-1.5 truncate max-w-[70%]">
                  {isSelected && (
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                      isPremium ? 'text-amber-500' : 'text-emerald-500'
                    }`} />
                  )}
                  <span className="truncate">{option.text}</span>
                </span>
                <span className="font-bold relative z-10 shrink-0">
                  {percentage}% ({option.votes.toLocaleString()})
                </span>
              </div>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => onVote(idx)}
              className="w-full text-left rounded-lg p-3 text-xs md:text-sm font-semibold border border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900/80 hover:text-white transition-all active:scale-[0.99]"
            >
              {option.text}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-4 pt-3 border-t border-neutral-800/60">
        <span>{poll.totalVotes.toLocaleString()} votes cast</span>
        {hasVoted && <span className="italic font-medium">Thank you for voting!</span>}
      </div>
    </div>
  );
};
