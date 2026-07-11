// ESPN API Service for ScoreVerse
// Provides: standings, news, videos, player stats, more sports

import { execSync } from 'child_process';

const DB = (q) => {
  try {
    const out = execSync(`team-db "${q.replace(/"/g, '\\"')}"`, { encoding: 'utf8', timeout: 10000 });
    return JSON.parse(out);
  } catch (e) { return []; }
};

// More sports available from ESPN
export const EXTRA_SPORTS = {
  'tennis': { path: 'tennis', name: 'Tennis', icon: '🎾' },
  'golf': { path: 'golf', name: 'Golf', icon: '⛳' },
  'f1': { path: 'racing/f1', name: 'Formula 1', icon: '🏎️' },
  'ufc': { path: 'mma/ufc', name: 'UFC', icon: '🥊' },
  'cricket': { path: 'cricket', name: 'Cricket', icon: '🏏' },
  'boxing': { path: 'boxing', name: 'Boxing', icon: '🥊' },
  'ncaam': { path: 'basketball/mens-college-basketball', name: 'NCAA MBB', icon: '🏀' },
};

// Fetch standings for a league
export async function fetchStandings(sport, leagueId) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${leagueId}/standings`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const standings = data.standings || [];
    if (!standings.length) return null;
    
    const entries = standings[0].entries || [];
    return entries.map(e => {
      const team = e.team || {};
      const stats = {};
      (e.stats || []).forEach(s => { stats[s.name] = s.value; });
      return {
        rank: stats.rank || '-',
        name: team.displayName || team.shortDisplayName || team.abbreviation || '?',
        logo: team.logos?.[0]?.href || '',
        gamesPlayed: stats.gamesPlayed || stats.gamesplayed || '-',
        wins: stats.wins || '-',
        losses: stats.losses || '-',
        ties: stats.ties || '-',
        points: stats.points || stats.pts || '-',
        winPct: stats.winPct || '-',
      };
    });
  } catch (e) {
    console.error(`Standings error for ${leagueId}:`, e.message);
    return null;
  }
}

// Fetch news from ESPN
export async function fetchNews(sport) {
  const leagues = {
    'soccer': 'soccer', 'basketball': 'basketball/nba', 'football': 'football/nfl',
    'baseball': 'baseball/mlb', 'hockey': 'hockey/nhl', 'tennis': 'tennis',
    'golf': 'golf', 'ufc': 'mma', 'boxing': 'boxing', 'all': ''
  };
  const path = leagues[sport] || '';
  const url = `https://site.api.espn.com/apis/site/v2/sports${path ? '/' + path : ''}/news`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).slice(0, 10).map(a => ({
      id: a.id || `news-${Date.now()}-${Math.random()}`,
      title: a.headline || a.title || '',
      summary: a.description || a.summary || '',
      sport: sport || 'all',
      imageUrl: a.images?.[0]?.url || a.image || '',
      publishedAt: a.published || a.date || '',
      source: 'ESPN',
      url: a.links?.web?.href || a.links?.api?.href || '',
    }));
  } catch (e) {
    console.error(`News error:`, e.message);
    return [];
  }
}

// Fetch video highlights from ESPN
export async function fetchVideos(sport) {
  const leagues = {
    'soccer': 'soccer', 'basketball': 'basketball/nba', 'football': 'football/nfl',
    'baseball': 'baseball/mlb', 'hockey': 'hockey/nhl', 'all': ''
  };
  const path = leagues[sport] || '';
  const url = `https://site.api.espn.com/apis/site/v2/sports${path ? '/' + path : ''}/news?type=Video`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).filter(a => a.type === 'Video' || a.videos?.length).slice(0, 6).map(a => ({
      id: a.id || `video-${Date.now()}`,
      title: a.headline || a.title || '',
      description: a.description || '',
      imageUrl: a.images?.[0]?.url || '',
      duration: a.videos?.[0]?.duration || '',
      publishedAt: a.published || a.date || '',
      source: 'ESPN',
      url: a.links?.web?.href || '',
      thumbnail: a.images?.[0]?.url || '',
    }));
  } catch (e) {
    console.error(`Videos error:`, e.message);
    return [];
  }
}

// Map league to ESPN sport path for standings
const STANDINGS_MAP = {
  'epl': ['soccer', 'eng.1'], 'laliga': ['soccer', 'esp.1'], 'seriea': ['soccer', 'ita.1'],
  'bundesliga': ['soccer', 'ger.1'], 'ligue1': ['soccer', 'fra.1'], 'mls': ['soccer', 'usa.1'],
  'nba': ['basketball', 'nba'], 'nfl': ['football', 'nfl'], 'mlb': ['baseball', 'mlb'],
  'nhl': ['hockey', 'nhl'], 'ucl': ['soccer', 'uefa.champions'],
};

export async function fetchAllStandings() {
  const results = {};
  for (const [league, [sport, leagueId]] of Object.entries(STANDINGS_MAP)) {
    const data = await fetchStandings(sport, leagueId);
    if (data) results[league] = data;
  }
  return results;
}