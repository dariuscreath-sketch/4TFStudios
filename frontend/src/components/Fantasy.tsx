import React, { useState, useMemo } from 'react';
import { 
  Trophy, Users, UserPlus, TrendingUp, Star, Swords,
  ArrowUp, ArrowDown, Plus, X, Search, DollarSign,
  Check, Shield, Activity, Calendar, RotateCcw
} from 'lucide-react';
import {
  FANTASY_PLAYERS, POSITIONS, POSITION_LABELS, POSITION_COLORS,
  createDefaultLeague
} from '../fantasyData';
import type { FantasyPlayer, FantasyLeague, FantasyTeam } from '../fantasyData';

interface FantasyProps {
  isPremium: boolean;
}

export const Fantasy: React.FC<FantasyProps> = ({ isPremium }) => {
  const [league, setLeague] = useState<FantasyLeague>(createDefaultLeague());
  const [userTeamId] = useState('team-0');
  const [activePanel, setActivePanel] = useState<'standings' | 'players' | 'draft'>('standings');
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [showDraftModal, setShowDraftModal] = useState(false);

  const userTeam = league.teams.find(t => t.id === userTeamId)!;
  const sortedTeams = [...league.teams].sort((a, b) => b.totalPoints - a.totalPoints);

  // Available free agents sorted by projected points
  const freeAgents = useMemo(() => {
    const ownedIds = new Set(league.teams.flatMap(t => t.players.map(p => p.id)));
    return FANTASY_PLAYERS
      .filter(p => !ownedIds.has(p.id))
      .filter(p => positionFilter === 'all' || p.position === positionFilter)
      .filter(p => 
        !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.projectedPoints - a.projectedPoints);
  }, [league, searchQuery, positionFilter]);

  // Owner lookup
  const ownerOfPlayer = (playerId: string): string => {
    for (const team of league.teams) {
      if (team.players.some(p => p.id === playerId)) return team.owner;
    }
    return 'Free Agent';
  };

  const addPlayer = (player: FantasyPlayer) => {
    if (userTeam.players.length >= 15) return;
    const posCount = userTeam.players.filter(p => p.position === player.position).length;
    const posMax = POSITIONS.find(p => p.id === player.position)?.max || 5;
    if (posCount >= posMax) return;
    
    setLeague(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id !== userTeamId) return t;
        return {
          ...t,
          players: [...t.players, { ...player, owned: true, ownerId: userTeamId }],
          totalPoints: t.totalPoints + player.fantasyPoints,
          projectedTotal: t.projectedTotal + player.projectedPoints,
        };
      }),
    }));
  };

  const removePlayer = (playerId: string) => {
    setLeague(prev => ({
      ...prev,
      teams: prev.teams.map(t => {
        if (t.id !== userTeamId) return t;
        const player = t.players.find(p => p.id === playerId);
        if (!player) return t;
        return {
          ...t,
          players: t.players.filter(p => p.id !== playerId),
          totalPoints: t.totalPoints - player.fantasyPoints,
          projectedTotal: t.projectedTotal - player.projectedPoints,
        };
      }),
    }));
  };

  // Simulate weekly score update
  const simulateWeek = () => {
    setLeague(prev => ({
      ...prev,
      currentWeek: prev.currentWeek + 1,
      teams: prev.teams.map(t => ({
        ...t,
        totalPoints: t.totalPoints + Math.floor(Math.random() * 90) + 40,
        projectedTotal: t.projectedTotal,
      })),
    }));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Fantasy Football</h2>
            <p className="text-[10px] text-neutral-500">
              {league.name} · Week {league.currentWeek} · {league.teams.length} teams
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={simulateWeek} className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all">
            <RotateCcw className="w-3 h-3" /> Simulate Week
          </button>
          {!isPremium && (
            <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
              🔒 Free Tier
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/[0.03] rounded-xl p-1">
        {[
          { id: 'standings', label: 'Standings', icon: Trophy },
          { id: 'players', label: 'My Roster', icon: Users },
          { id: 'draft', label: 'Free Agents', icon: Search },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-2 rounded-lg transition-all ${
              activePanel === tab.id
                ? 'bg-emerald-500/10 text-emerald-400 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Standings Panel */}
      {activePanel === 'standings' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">League Standings</h3>
            <span className="text-[9px] text-neutral-500">{sortedTeams.length} teams</span>
          </div>
          <div className="space-y-1.5">
            {sortedTeams.map((team, i) => {
              const isUser = team.id === userTeamId;
              const record = `${team.wins}-${team.losses}${team.ties > 0 ? `-${team.ties}` : ''}`;
              return (
                <div key={team.id} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                  isUser ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/5'
                }`}>
                  {/* Rank */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-amber-500/20 text-amber-400' :
                    i === 1 ? 'bg-slate-400/20 text-slate-300' :
                    i === 2 ? 'bg-amber-700/20 text-amber-600' :
                    'bg-white/5 text-neutral-500'
                  }`}>
                    {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>

                  {/* Team info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{team.name}</span>
                      {isUser && <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">YOU</span>}
                    </div>
                    <p className="text-[9px] text-neutral-500">{team.owner} · {record} · {team.players.length}/15 players</p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-sm font-bold font-mono text-white">{team.totalPoints}</p>
                    <p className="text-[9px] text-neutral-500">Proj: {team.projectedTotal}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Roster Panel */}
      {activePanel === 'players' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">My Team · {userTeam.name}</h3>
            <span className="text-[9px] text-neutral-500">{userTeam.players.length}/15 roster spots</span>
          </div>

          {/* Position groups */}
          {POSITIONS.filter(p => p.id !== 'DEF').map(pos => {
            const posPlayers = userTeam.players.filter(p => p.position === pos.id);
            if (posPlayers.length === 0) return null;
            return (
              <div key={pos.id} className="mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${POSITION_COLORS[pos.id]} text-white`}>
                    {pos.label}
                  </span>
                  <span className="text-[9px] text-neutral-500">{posPlayers.length}/{pos.max}</span>
                </div>
                <div className="space-y-1">
                  {posPlayers.map(player => (
                    <div key={player.id} className="flex items-center gap-2.5 p-2 bg-white/[0.03] rounded-xl border border-white/5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${POSITION_COLORS[player.position]} text-white`}>
                        {player.position}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{player.name}</p>
                        <p className="text-[9px] text-neutral-400">{player.team} · Bye W{player.byeWeek}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold font-mono text-emerald-400">{player.fantasyPoints}</p>
                        <p className="text-[8px] text-neutral-500">Proj: {player.projectedPoints}</p>
                      </div>
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="w-6 h-6 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 flex items-center justify-center transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {userTeam.players.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-neutral-600" />
              </div>
              <p className="text-sm font-bold text-neutral-400">Your roster is empty</p>
              <p className="text-[11px] text-neutral-600 mt-1">Head to Free Agents to start building your team</p>
            </div>
          )}
        </div>
      )}

      {/* Free Agents Panel */}
      {activePanel === 'draft' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search players..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <select
              value={positionFilter}
              onChange={e => setPositionFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All</option>
              {POSITIONS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {freeAgents.map(player => (
              <div key={player.id} className="flex items-center gap-2.5 p-2.5 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/5 transition-all">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r ${POSITION_COLORS[player.position]} text-white w-8 text-center`}>
                  {player.position}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{player.name}</p>
                  <p className="text-[9px] text-neutral-400">{player.team} · Bye W{player.byeWeek} · ${player.price}M</p>
                </div>
                <div className="text-right mr-1">
                  <p className="text-xs font-bold font-mono text-amber-400">{player.projectedPoints}</p>
                  <p className="text-[8px] text-neutral-500">Projected</p>
                </div>
                <button
                  onClick={() => addPlayer(player)}
                  disabled={userTeam.players.length >= 15}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    userTeam.players.length >= 15
                      ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {freeAgents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-500">No players match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <p className="text-[9px] text-neutral-600 text-center">
          Fantasy points based on standard PPR scoring. Player projections updated weekly. 
          {!isPremium && <span className="text-amber-500"> Go Gold for AI-powered draft assistance and trade analyzer.</span>}
        </p>
      </div>
    </div>
  );
};