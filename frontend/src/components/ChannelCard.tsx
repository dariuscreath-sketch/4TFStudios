import React from 'react';
import { Users, Lock } from 'lucide-react';
import type { CommunityChannel } from '../mockData';

interface ChannelCardProps {
  channel: CommunityChannel;
  isSelected: boolean;
  onClick: () => void;
  isPremiumUser: boolean;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  isSelected,
  onClick,
  isPremiumUser,
}) => {
  const isPremiumChannel = channel.id === 'chan-premium';

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer shadow-md mb-2 flex items-center justify-between active:scale-[0.98] ${
        isSelected
          ? isPremiumUser
            ? 'bg-amber-950/20 border-amber-500/50'
            : 'bg-emerald-950/20 border-emerald-500/50'
          : 'bg-slate-900/60 border-neutral-800 hover:border-neutral-700/60 hover:bg-slate-900'
      }`}
    >
      <div className="flex-1 truncate pr-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <h4 className={`font-semibold text-sm leading-none ${
            isSelected 
              ? isPremiumUser 
                ? 'text-amber-400' 
                : 'text-emerald-400' 
              : 'text-neutral-200'
          }`}>
            {channel.name}
          </h4>
          {isPremiumChannel && (
            <span className="bg-amber-950 text-amber-400 border border-amber-500/20 text-[8px] font-bold px-1 py-0.5 rounded tracking-wider uppercase flex items-center gap-0.5">
              <Lock className="w-2 h-2" />
              VIP
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-400 truncate max-w-full">
          {channel.description}
        </p>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-800/60 px-2 py-1 rounded-lg">
          <Users className="w-3 h-3 text-neutral-500" />
          {channel.memberCount}
        </span>
      </div>
    </div>
  );
};
