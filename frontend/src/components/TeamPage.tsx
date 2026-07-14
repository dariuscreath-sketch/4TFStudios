import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowLeft, TrendingUp } from 'lucide-react';

interface TeamPageProps {
  teamId: string;
  onBack: () => void;
  onSelectMatch: (game: any) => void;
  isPremium: boolean;
}

export const TeamPage: React.FC<TeamPageProps> = ({ teamId, onBack, onSelectMatch, isPremium }) => {
  const [team, setTeam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'stats'>('overview');

  useEffect(() => {
    fetch(`/api/teams/${teamId}`)
      .then(r => r.json())
      .then(d => setTeam(d))
      .catch(() => {});
  }, [teamId]);

  if (!team) return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl flex items-center justify-center animate-fade-in">
      <div className="text-neutral-400 text-sm">Loading team...</div>
    </div>
  );

  if (team.error) return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl flex flex-col animate-fade-in">
      <div className="glass-strong px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-neutral-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
        <span className="text-sm font-bold text-white">Team not found</span>
      </div>
      <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">Could not find this team</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl flex flex-col animate-fade-in">
      {/* Header */}
      <div className="glass-strong px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{team.logo || '🏟️'}</span>
          <div>
            <h2 className="text-sm font-bold text-white">{team.name}</h2>
            <span className="text-[10px] text-neutral-400">{team.league}</span>
          </div>
        </div>
        {team.standingsPosition && (
          <div className="ml-auto text-right">
            <div className="text-xs font-bold text-emerald-400">#{team.standingsPosition}</div>
            <div className="text-[9px] text-neutral-500">Standings</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 px-4">
        {['overview', 'schedule', 'stats'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`text-[10px] font-bold uppercase tracking-wider px-4 py-3 border-b-2 transition-all ${
              activeTab === tab ? 'text-emerald-400 border-emerald-500' : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}>{tab}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {activeTab === 'overview' && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Recent Games</h3>
            {team.recentGames?.length > 0 ? team.recentGames.map((game: any) => (
              <div key={game.id} onClick={() => onSelectMatch(game)}
                className="glass rounded-xl p-3 cursor-pointer hover:bg-white/[0.04] transition-colors sport-card">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${game.homeTeam === team.name ? 'text-emerald-400' : 'text-neutral-200'}`}>
                      {game.homeTeam} {game.homeScore !== null ? game.homeScore : ''}
                    </p>
                  </div>
                  <span className="text-[10px] text-neutral-500 mx-2">vs</span>
                  <div className="flex-1 text-right">
                    <p className={`text-sm font-bold ${game.awayTeam === team.name ? 'text-emerald-400' : 'text-neutral-200'}`}>
                      {game.awayTeam} {game.awayScore !== null ? game.awayScore : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-neutral-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{game.venue || 'TBD'}</span>
                  <span className="mx-1">·</span>
                  <span className={`font-medium ${game.status === 'live' ? 'text-emerald-400' : ''}`}>
                    {game.status === 'live' ? '● Live' : game.time}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-xs text-neutral-500 text-center py-8">No recent games</p>
            )}
          </>
        )}

        {activeTab === 'schedule' && (
          <div className="text-center py-12 text-neutral-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Schedule coming soon</p>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="text-center py-12 text-neutral-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Team stats coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};