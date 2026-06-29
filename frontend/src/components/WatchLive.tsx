import React from 'react';

interface WatchLiveProps {
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  isLive: boolean;
}

export const WatchLive: React.FC<WatchLiveProps> = ({ sport, league, homeTeam, awayTeam, isLive }) => {
  if (!isLive) return null;

  // Generate streaming links based on sport
  const getStreamUrl = () => {
    const sportLower = sport.toLowerCase();
    if (sportLower === 'basketball') return 'https://www.espn.com/watch/';
    if (sportLower === 'soccer') return 'https://www.espn.com/watch/soccer/';
    if (sportLower === 'football') return 'https://www.espn.com/watch/nfl/';
    if (sportLower === 'hockey') return 'https://www.espn.com/watch/nhl/';
    if (sportLower === 'baseball') return 'https://www.espn.com/watch/mlb/';
    return 'https://www.espn.com/watch/';
  };

  return (
    <div className="bg-gradient-to-r from-red-950/20 to-neutral-950 border border-red-500/20 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500" />
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            {league} — Live
          </span>
        </div>
        <a
          href={getStreamUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-red-600/20"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Watch Live
        </a>
      </div>
      <div className="text-sm text-neutral-300 font-medium">
        {homeTeam} vs {awayTeam}
      </div>
      <p className="text-[10px] text-neutral-500 mt-1.5 leading-snug">
        Stream available via ESPN. Ad-supported viewing. ScoreVerse may earn affiliate commission.
      </p>
    </div>
  );
};
