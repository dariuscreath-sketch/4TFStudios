import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, TrendingUp, Newspaper, Users, Trophy } from 'lucide-react';
import type { Match, NewsArticle, CommunityChannel, Team } from '../mockData';

interface SearchResult {
  type: 'game' | 'news' | 'team' | 'channel';
  title: string;
  subtitle?: string;
  sport?: string;
  score?: string;
  image?: string;
  href?: string;
  onClick?: () => void;
}

interface SearchBarProps {
  games: Match[];
  news: NewsArticle[];
  channels: CommunityChannel[];
  onGameSelect: (game: Match) => void;
  onNewsSelect?: (article: NewsArticle) => void;
  onChannelSelect?: (channel: CommunityChannel) => void;
  onTeamSelect?: (teamName: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  games,
  news,
  channels,
  onGameSelect,
  onNewsSelect,
  onChannelSelect,
  onTeamSelect,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Extract unique teams from games (Team objects have .name)
  const allTeams = React.useMemo(() => {
    const teamSet = new Set<string>();
    games.forEach(g => {
      if (typeof g.homeTeam === 'string') {
        teamSet.add(g.homeTeam);
        teamSet.add(g.awayTeam as string);
      } else {
        teamSet.add((g.homeTeam as Team).name);
        teamSet.add((g.awayTeam as Team).name);
      }
    });
    return Array.from(teamSet).sort();
  }, [games]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase().trim();
    const newResults: SearchResult[] = [];

    // Search games
    games.forEach(g => {
      const homeName = typeof g.homeTeam === 'string' ? g.homeTeam : (g.homeTeam as Team).name;
      const awayName = typeof g.awayTeam === 'string' ? g.awayTeam : (g.awayTeam as Team).name;
      const match = 
        homeName.toLowerCase().includes(q) ||
        awayName.toLowerCase().includes(q) ||
        g.league?.toLowerCase().includes(q) ||
        g.sport?.toLowerCase().includes(q);
      if (match) {
        newResults.push({
          type: 'game',
          title: `${homeName} vs ${awayName}`,
          subtitle: g.league || g.sport,
          score: g.homeTeam.score !== undefined ? `${g.homeTeam.score} - ${g.awayTeam.score}` : undefined,
          sport: g.sport,
          onClick: () => onGameSelect(g),
        });
      }
    });

    // Search teams
    allTeams.forEach(team => {
      if (team.toLowerCase().includes(q) && !newResults.some(r => r.type === 'team' && r.title === team)) {
        // Find the sport for this team
        const teamGame = games.find(g => {
          const homeName = typeof g.homeTeam === 'string' ? g.homeTeam : (g.homeTeam as Team).name;
          const awayName = typeof g.awayTeam === 'string' ? g.awayTeam : (g.awayTeam as Team).name;
          return homeName === team || awayName === team;
        });
        newResults.push({
          type: 'team',
          title: team,
          subtitle: 'View team page',
          sport: teamGame?.sport,
          onClick: () => onTeamSelect?.(team),
        });
      }
    });

    // Search news
    news.forEach(article => {
      if (
        article.title.toLowerCase().includes(q) ||
        article.content?.toLowerCase().includes(q) ||
        article.sport?.toLowerCase().includes(q)
      ) {
        newResults.push({
          type: 'news',
          title: article.title,
          subtitle: article.sport ? `${article.sport} · ${article.source || 'ScoreVerse'}` : article.source,
          image: article.imageUrl,
          onClick: () => onNewsSelect?.(article),
        });
      }
    });

    // Search channels
    channels.forEach(ch => {
      if (
        ch.name.toLowerCase().includes(q) ||
        (ch.description && ch.description.toLowerCase().includes(q))
      ) {
        newResults.push({
          type: 'channel',
          title: ch.name,
          subtitle: ch.description,
          onClick: () => onChannelSelect?.(ch),
        });
      }
    });

    // Limit results
    setResults(newResults.slice(0, 12));
    setIsOpen(newResults.length > 0);
    setFocusedIdx(-1);
  }, [query, games, news, channels, allTeams, onGameSelect, onNewsSelect, onChannelSelect, onTeamSelect]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && focusedIdx >= 0) {
      e.preventDefault();
      results[focusedIdx]?.onClick?.();
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (result: SearchResult) => {
    result.onClick?.();
    setIsOpen(false);
    setQuery('');
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'game': return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case 'news': return <Newspaper className="w-3.5 h-3.5 text-blue-400" />;
      case 'team': return <Users className="w-3.5 h-3.5 text-emerald-400" />;
      case 'channel': return <TrendingUp className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Search className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(results.length > 0)}
          onKeyDown={handleKeyDown}
          placeholder="Search games, teams, news, channels..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-[70vh] overflow-y-auto backdrop-blur-xl"
        >
          {/* Count */}
          <div className="px-4 py-2 border-b border-white/5">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Results */}
          <div className="py-1">
            {results.map((result, idx) => (
              <button
                key={`${result.type}-${result.title}-${idx}`}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setFocusedIdx(idx)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  idx === focusedIdx ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  {result.image ? (
                    <img src={result.image} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    typeIcon(result.type)
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{result.title}</p>
                  <p className="text-[11px] text-neutral-400 truncate flex items-center gap-1.5">
                    {result.sport && (
                      <span className="text-emerald-400/80 font-medium">{result.sport}</span>
                    )}
                    {result.sport && result.subtitle && <span className="text-neutral-600">·</span>}
                    {result.subtitle}
                    {result.score && (
                      <>
                        <span className="text-neutral-600">·</span>
                        <span className="text-white font-mono">{result.score}</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Type badge */}
                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  result.type === 'game' ? 'bg-amber-500/10 text-amber-400' :
                  result.type === 'news' ? 'bg-blue-500/10 text-blue-400' :
                  result.type === 'team' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-purple-500/10 text-purple-400'
                }`}>
                  {result.type}
                </span>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-white/5 text-center">
            <p className="text-[9px] text-neutral-600">
              ↑↓ navigate · ↵ select · esc close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};