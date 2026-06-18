import React from 'react';
import type { ChatMessage as ChatMessageType } from '../mockData';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser = false }) => {
  const isPremiumUser = message.user.isPremium;

  return (
    <div className={`flex items-start gap-2.5 mb-3.5 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md shrink-0 border select-none ${
        isPremiumUser 
          ? 'bg-amber-950 border-amber-500/30' 
          : 'bg-neutral-800 border-neutral-700/50'
      }`}>
        {message.user.avatar}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-[75%] ${isCurrentUser ? 'items-end' : ''}`}>
        {/* Username */}
        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">
          <span className={`${isPremiumUser ? 'text-amber-400 font-bold' : ''}`}>
            {message.user.name}
          </span>
          {isPremiumUser && (
            <span className="text-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-1 rounded-sm font-bold scale-90">
              PRO
            </span>
          )}
          <span className="text-[8px] text-neutral-500 tracking-normal">{message.timestamp}</span>
        </div>

        {/* Bubble */}
        <div className={`p-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
          isCurrentUser
            ? 'bg-emerald-600 text-white rounded-tr-none'
            : isPremiumUser
              ? 'bg-amber-950/15 border border-amber-500/20 text-neutral-100 rounded-tl-none shadow-md shadow-amber-500/5'
              : 'bg-neutral-900 border border-neutral-800/80 text-neutral-200 rounded-tl-none'
        }`}>
          {message.text}
        </div>
      </div>
    </div>
  );
};
