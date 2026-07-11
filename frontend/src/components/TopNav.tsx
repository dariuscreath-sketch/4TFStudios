import React from 'react';

interface TopNavProps {
  activeSport: string;
  onSelectSport: (sport: string) => void;
  isPremium: boolean;
}

const sports = [
  { id: 'all', label: 'Home' },
  { id: 'soccer', label: 'Soccer' },
  { id: 'basketball', label: 'NBA' },
  { id: 'football', label: 'NFL' },
  { id: 'baseball', label: 'MLB' },
  { id: 'hockey', label: 'NHL' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'golf', label: 'Golf' },
  { id: 'f1', label: 'F1' },
  { id: 'ufc', label: 'UFC' },
  { id: 'cricket', label: 'Cricket' },
];

export const TopNav: React.FC<TopNavProps> = ({ activeSport, onSelectSport, isPremium }) => {
  return (
    <div className="bg-white/[0.02] border-b border-white/5 overflow-x-auto no-scrollbar">
      <div className="flex gap-0 px-2 max-w-4xl mx-auto">
        {sports.map(sport => (
          <button
            key={sport.id}
            onClick={() => onSelectSport(sport.id)}
            className={`text-[11px] font-bold px-3 py-3 whitespace-nowrap transition-all border-b-2 shrink-0 ${
              activeSport === sport.id
                ? isPremium
                  ? 'text-amber-400 border-amber-500'
                  : 'text-emerald-400 border-emerald-500'
                : 'text-neutral-400 border-transparent hover:text-neutral-200 hover:border-neutral-600'
            }`}
          >
            {sport.label}
          </button>
        ))}
      </div>
    </div>
  );
};