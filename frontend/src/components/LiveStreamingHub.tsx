import React from 'react';
import { Tv, ExternalLink, Lock, Play, Monitor, Smartphone } from 'lucide-react';
import type { Match, Team } from '../mockData';

interface StreamProvider {
  name: string;
  url: string;
  logo: string;
  type: 'cable' | 'streaming' | 'free';
  sports: string[];
}

const STREAM_PROVIDERS: Record<string, StreamProvider[]> = {
  NBA: [
    { name: 'ESPN', url: 'https://www.espn.com/watch/basketball', logo: '📺', type: 'cable', sports: ['basketball'] },
    { name: 'TNT', url: 'https://www.tntdrama.com/watch', logo: '📺', type: 'cable', sports: ['basketball'] },
    { name: 'ABC', url: 'https://abc.com/watch-live', logo: '📺', type: 'cable', sports: ['basketball'] },
    { name: 'NBA League Pass', url: 'https://www.nba.com/watch', logo: '🏀', type: 'streaming', sports: ['basketball'] },
    { name: 'YouTube TV', url: 'https://tv.youtube.com/search?q=nba', logo: '▶️', type: 'streaming', sports: ['basketball'] },
    { name: 'Hulu + Live TV', url: 'https://www.hulu.com/live', logo: '📹', type: 'streaming', sports: ['basketball'] },
  ],
  NFL: [
    { name: 'FOX', url: 'https://www.foxsports.com/live', logo: '📺', type: 'cable', sports: ['football'] },
    { name: 'CBS', url: 'https://www.cbs.com/live', logo: '📺', type: 'cable', sports: ['football'] },
    { name: 'NBC', url: 'https://www.nbc.com/live', logo: '📺', type: 'cable', sports: ['football'] },
    { name: 'ESPN', url: 'https://www.espn.com/watch/nfl', logo: '📺', type: 'cable', sports: ['football'] },
    { name: 'NFL+', url: 'https://www.nfl.com/plus', logo: '🏈', type: 'streaming', sports: ['football'] },
    { name: 'Amazon Prime', url: 'https://www.amazon.com/gp/video', logo: '📦', type: 'streaming', sports: ['football'] },
    { name: 'YouTube TV', url: 'https://tv.youtube.com/search?q=nfl', logo: '▶️', type: 'streaming', sports: ['football'] },
  ],
  MLB: [
    { name: 'ESPN', url: 'https://www.espn.com/watch/mlb', logo: '📺', type: 'cable', sports: ['baseball'] },
    { name: 'FOX', url: 'https://www.foxsports.com/live/mlb', logo: '📺', type: 'cable', sports: ['baseball'] },
    { name: 'MLB.TV', url: 'https://www.mlb.com/live-stream-games', logo: '⚾', type: 'streaming', sports: ['baseball'] },
    { name: 'TBS', url: 'https://www.tbs.com/watch', logo: '📺', type: 'cable', sports: ['baseball'] },
  ],
  NHL: [
    { name: 'ESPN', url: 'https://www.espn.com/watch/nhl', logo: '📺', type: 'cable', sports: ['hockey'] },
    { name: 'TNT', url: 'https://www.tntdrama.com/watch', logo: '📺', type: 'cable', sports: ['hockey'] },
    { name: 'NHL.TV', url: 'https://www.nhl.com/tv', logo: '🏒', type: 'streaming', sports: ['hockey'] },
  ],
  'Premier League': [
    { name: 'NBC Sports', url: 'https://www.nbcsports.com/live', logo: '📺', type: 'cable', sports: ['soccer'] },
    { name: 'Peacock', url: 'https://www.peacocktv.com/sports', logo: '🦚', type: 'streaming', sports: ['soccer'] },
    { name: 'USA Network', url: 'https://www.usanetwork.com/watch', logo: '📺', type: 'cable', sports: ['soccer'] },
  ],
  'Champions League': [
    { name: 'Paramount+', url: 'https://www.paramountplus.com/sports', logo: '🎬', type: 'streaming', sports: ['soccer'] },
    { name: 'CBS', url: 'https://www.cbs.com/live', logo: '📺', type: 'cable', sports: ['soccer'] },
  ],
  'NCAA Football': [
    { name: 'ESPN', url: 'https://www.espn.com/watch/college-football', logo: '📺', type: 'cable', sports: ['college-fb'] },
    { name: 'FOX', url: 'https://www.foxsports.com/live/college-football', logo: '📺', type: 'cable', sports: ['college-fb'] },
    { name: 'ABC', url: 'https://abc.com/watch-live', logo: '📺', type: 'cable', sports: ['college-fb'] },
    { name: 'Big Ten Network', url: 'https://btn.com/watch', logo: '📺', type: 'cable', sports: ['college-fb'] },
  ],
  'NCAA Basketball': [
    { name: 'ESPN', url: 'https://www.espn.com/watch/college-basketball', logo: '📺', type: 'cable', sports: ['college-bb'] },
    { name: 'CBS', url: 'https://www.cbs.com/live', logo: '📺', type: 'cable', sports: ['college-bb'] },
    { name: 'FOX', url: 'https://www.foxsports.com/live/college-basketball', logo: '📺', type: 'cable', sports: ['college-bb'] },
  ],
};

const DEFAULT_PROVIDERS: StreamProvider[] = [
  { name: 'ESPN+', url: 'https://www.espn.com/watch/', logo: '📺', type: 'streaming', sports: [] },
  { name: 'YouTube TV', url: 'https://tv.youtube.com/', logo: '▶️', type: 'streaming', sports: [] },
  { name: 'Fubo', url: 'https://www.fubo.tv/', logo: '📺', type: 'streaming', sports: [] },
  { name: 'Sling TV', url: 'https://www.sling.com/', logo: '📺', type: 'streaming', sports: [] },
];

interface LiveStreamingHubProps {
  match: Match;
  isPremium: boolean;
  isLive: boolean;
}

export const LiveStreamingHub: React.FC<LiveStreamingHubProps> = ({ match, isPremium, isLive }) => {
  const league = match.league;
  const providers = STREAM_PROVIDERS[league] || DEFAULT_PROVIDERS;

  if (!isLive) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/10 rounded-2xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Watch Live</span>
        </div>
        {!isPremium && (
          <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            🔒 Gold Feature
          </span>
        )}
      </div>

      <p className="text-[10px] text-neutral-400 mb-3">
        {match.league} · {match.venue}
      </p>

      {isPremium ? (
        <>
          {/* Streaming Providers */}
          <div className="space-y-1.5">
            {providers.map((provider, i) => (
              <a
                key={i}
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 bg-white/[0.03] hover:bg-white/[0.07] rounded-xl border border-white/5 hover:border-blue-500/20 transition-all group"
              >
                <span className="text-lg">{provider.logo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {provider.name}
                  </p>
                  <p className="text-[9px] text-neutral-500 capitalize">
                    {provider.type === 'streaming' ? 'Streaming Service' : 'TV Channel'}
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>

          {/* Affiliate promo */}
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl border border-blue-500/10">
            <p className="text-[9px] text-neutral-400 text-center">
              📺 <span className="text-blue-400 font-bold">Don't have cable?</span> Try{' '}
              <a href="https://tv.youtube.com/" target="_blank" className="text-red-400 font-bold hover:underline">YouTube TV</a>
              {' '}or{' '}
              <a href="https://www.fubo.tv/" target="_blank" className="text-green-400 font-bold hover:underline">Fubo</a>
              {' '}— watch every game live!
            </p>
          </div>
        </>
      ) : (
        /* Locked preview for free users */
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs font-bold text-amber-400">Gold Feature</p>
          <p className="text-[9px] text-neutral-500 mt-1">Upgrade to see all live streaming options</p>
        </div>
      )}
    </div>
  );
};