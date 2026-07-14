import React, { useMemo, useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Tv, Play, ChevronRight, Ticket, Volume2, ExternalLink } from 'lucide-react';
import type { Match, Team } from '../mockData';

// Broadcast network mapping
const BROADCAST_NETWORKS: Record<string, string[]> = {
  NBA: ['ESPN', 'TNT', 'ABC', 'NBA TV'],
  NFL: ['FOX', 'CBS', 'NBC', 'ESPN', 'Amazon Prime'],
  MLB: ['ESPN', 'FOX', 'MLB Network', 'TBS'],
  'Premier League': ['NBC Sports', 'Peacock', 'USA Network'],
  'Champions League': ['Paramount+', 'CBS', 'TUDN'],
  'La Liga': ['ESPN+', 'ESPN Deportes'],
  'Serie A': ['CBS Sports', 'Paramount+'],
  'Bundesliga': ['ESPN+'],
  'Ligue 1': ['beIN Sports'],
  NHL: ['ESPN', 'TNT', 'NHL Network'],
  MLS: ['Apple TV+', 'FOX'],
  'NCAA Football': ['FOX', 'ABC', 'ESPN', 'CBS', 'Big Ten Network', 'SEC Network'],
  'NCAA Basketball': ['ESPN', 'CBS', 'FOX', 'Big Ten Network', 'SEC Network', 'ACC Network'],
};

const getBroadcastForSport = (match: Match): string => {
  const league = match.league;
  const networks = BROADCAST_NETWORKS[league];
  if (networks) return networks[Math.floor(Math.random() * networks.length)];
  
  // Fallback by sport
  const sportNetworks: Record<string, string[]> = {
    basketball: ['ESPN', 'NBA TV', 'TNT'],
    football: ['FOX', 'CBS', 'NBC', 'ESPN'],
    'college-fb': ['FOX', 'ABC', 'ESPN', 'CBS', 'Big Ten Network', 'SEC Network'],
    'college-bb': ['ESPN', 'CBS', 'FOX', 'Big Ten Network', 'SEC Network', 'ACC Network'],
    soccer: ['ESPN+', 'CBS Sports', 'Paramount+'],
    baseball: ['ESPN', 'FOX', 'MLB Network'],
    hockey: ['ESPN', 'TNT', 'NHL Network'],
    tennis: ['ESPN', 'Tennis Channel'],
    f1: ['ESPN', 'F1 TV'],
    ufc: ['ESPN+', 'UFC Fight Pass'],
    cricket: ['Willow TV', 'ESPN+'],
    boxing: ['ESPN', 'DAZN', 'Showtime'],
  };
  const sportMatch = sportNetworks[match.sport];
  return sportMatch ? sportMatch[Math.floor(Math.random() * sportMatch.length)] : 'ESPN';
};

interface TodayScheduleProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export const TodaySchedule: React.FC<TodayScheduleProps> = ({ matches, onSelectMatch }) => {
  // Get today's games (scheduled or live)
  const todayGames = useMemo(() => {
    return matches.filter(m => m.status === 'live' || m.status === 'scheduled').slice(0, 8);
  }, [matches]);

  if (todayGames.length === 0) return null;

  // Build the "Now Playing" announcement string
  const announcement = todayGames.map(m => {
    const home = typeof m.homeTeam === 'string' ? m.homeTeam : (m.homeTeam as Team).name;
    const away = typeof m.awayTeam === 'string' ? m.awayTeam : (m.awayTeam as Team).name;
    return `${home} vs ${away}`;
  }).join(' · ');

  const getTicketLink = (match: Match): string => {
    const home = typeof match.homeTeam === 'string' ? match.homeTeam : (match.homeTeam as Team).name;
    const away = typeof match.awayTeam === 'string' ? match.awayTeam : (match.awayTeam as Team).name;
    const team = home.split(' ').pop() || home;
    return `https://www.ticketmaster.com/search?q=${encodeURIComponent(team + ' tickets')}`;
  };

  return (
    <div className="mb-5">
      {/* Broadcast Ticker - "Now Playing" announcement */}
      <div className="mb-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-blue-950/60 border border-emerald-500/10 p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Now Playing</span>
          <span className="text-[8px] text-neutral-500">· Today's Matchups</span>
        </div>
        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-xs font-bold text-white">
              {announcement}
              <span className="mx-8 text-emerald-400">●</span>
              {announcement}
              <span className="mx-8 text-emerald-400">●</span>
              {announcement}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Games</h3>
        <span className="text-[9px] text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full">{todayGames.length} games</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {todayGames.map(match => {
          const homeName = typeof match.homeTeam === 'string' ? match.homeTeam : (match.homeTeam as Team).name;
          const awayName = typeof match.awayTeam === 'string' ? match.awayTeam : (match.awayTeam as Team).name;
          const homeLogo = typeof match.homeTeam === 'string' ? '' : (match.homeTeam as Team).logo;
          const awayLogo = typeof match.awayTeam === 'string' ? '' : (match.awayTeam as Team).logo;
          const homeScore = typeof match.homeTeam === 'string' ? undefined : (match.homeTeam as Team).score;
          const awayScore = typeof match.awayTeam === 'string' ? undefined : (match.awayTeam as Team).score;
          const broadcast = getBroadcastForSport(match);
          const isLive = match.status === 'live';

          return (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className={`relative group text-left bg-white/[0.03] hover:bg-white/[0.07] border ${
                isLive ? 'border-emerald-500/30' : 'border-white/5'
              } rounded-xl p-3 transition-all hover:shadow-lg hover:shadow-emerald-500/5 active:scale-[0.98]`}
            >
              {/* Live badge */}
              {isLive && (
                <div className="absolute -top-1.5 -right-1.5">
                  <span className="flex items-center gap-1 bg-emerald-500 text-black text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    LIVE
                  </span>
                </div>
              )}

              {/* League tag */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                  isLive ? 'text-emerald-400' : 'text-neutral-400'
                }`}>{match.league}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-[8px] text-neutral-500 capitalize">{match.sport}</span>
              </div>

              {/* Teams */}
              <div className="space-y-1.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{homeLogo}</span>
                  <span className={`text-xs font-semibold truncate ${
                    isLive && homeScore && awayScore && homeScore > awayScore ? 'text-emerald-400' : 'text-white'
                  }`}>{homeName}</span>
                  {homeScore !== undefined && (
                    <span className="ml-auto text-sm font-bold font-mono text-white">{homeScore}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">{awayLogo}</span>
                  <span className={`text-xs font-semibold truncate ${
                    isLive && homeScore && awayScore && awayScore > homeScore ? 'text-emerald-400' : 'text-white'
                  }`}>{awayName}</span>
                  {awayScore !== undefined && (
                    <span className="ml-auto text-sm font-bold font-mono text-white">{awayScore}</span>
                  )}
                </div>
              </div>

              {/* Time + Venue + Broadcast */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {match.time}
                </span>
                <span className="flex items-center gap-1 truncate max-w-[120px]">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{match.venue || 'TBD'}</span>
                </span>
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <Tv className="w-3 h-3" />
                  {broadcast}
                </span>
              </div>

              {/* Ticket Link */}
              <a
                href={getTicketLink(match)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 flex items-center gap-1.5 text-[8px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/5 hover:bg-emerald-500/10 px-2 py-1 rounded-full transition-all w-fit"
              >
                <Ticket className="w-3 h-3" />
                Get Tickets
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              {/* Click hint */}
              <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};