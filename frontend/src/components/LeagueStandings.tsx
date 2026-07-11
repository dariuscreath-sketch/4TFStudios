import React from 'react';

interface Standing {
  rank: string;
  name: string;
  logo: string;
  gamesPlayed: string;
  wins: string;
  losses: string;
  ties: string;
  points: string;
  winPct: string;
}

interface LeagueStandingsProps {
  league: string;
  standings: Standing[];
}

const leagueNames: Record<string, string> = {
  epl: 'Premier League', laliga: 'La Liga', seriea: 'Serie A',
  bundesliga: 'Bundesliga', ligue1: 'Ligue 1', mls: 'MLS',
  nba: 'NBA', nfl: 'NFL', mlb: 'MLB', nhl: 'NHL',
};

export const LeagueStandings: React.FC<LeagueStandingsProps> = ({ league, standings }) => {
  if (!standings || standings.length === 0) return null;
  
  const top8 = standings.slice(0, 8);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          {leagueNames[league] || league} Standings
        </h3>
        <span className="text-[10px] text-neutral-500">{standings.length} teams</span>
      </div>
      <div className="divide-y divide-white/5">
        {top8.map((team, i) => (
          <div key={i} className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
            <span className={`text-[11px] font-bold w-5 text-center ${
              parseInt(team.rank) <= 4 ? 'text-emerald-400' : 
              parseInt(team.rank) <= 6 ? 'text-blue-400' : 'text-neutral-500'
            }`}>
              {team.rank}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-neutral-200 truncate block">{team.name}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-neutral-400">
              <span className="w-5 text-center">{team.wins}</span>
              <span className="w-5 text-center">{team.losses}</span>
              <span className="w-5 text-center font-bold text-emerald-400">{team.points}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-white/5 flex gap-4 text-[9px] text-neutral-500 justify-end">
        <span>W</span><span>L</span><span className="font-bold">Pts</span>
      </div>
    </div>
  );
};