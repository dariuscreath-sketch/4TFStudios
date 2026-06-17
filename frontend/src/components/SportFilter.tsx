import React from 'react';
import { initialSports } from '../mockData';

interface SportFilterProps {
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  isPremium: boolean;
}

export const SportFilter: React.FC<SportFilterProps> = ({
  selectedSport,
  setSelectedSport,
  isPremium,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar scroll-smooth">
      {initialSports.map((sport) => {
        const isActive = selectedSport === sport.id;
        return (
          <button
            key={sport.id}
            onClick={() => setSelectedSport(sport.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? isPremium
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10 border-amber-500'
                  : 'bg-emerald-500 text-black shadow-md shadow-emerald-500/10 border-emerald-500'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700/80 hover:text-neutral-200'
            }`}
          >
            {sport.name}
          </button>
        );
      })}
    </div>
  );
};
