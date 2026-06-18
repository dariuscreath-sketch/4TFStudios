import { execSync } from 'child_process';

const DB = (q) => {
  try {
    const out = execSync(`team-db "${q.replace(/"/g, '\\"')}"`, { encoding: 'utf8', timeout: 10000 });
    return JSON.parse(out);
  } catch (e) { return []; }
};

// ESPN API mapping: sport key -> ESPN URL path
const SPORTS = {
  nba: { path: 'basketball/nba', sport: 'basketball', league: 'nba' },
  nfl: { path: 'football/nfl', sport: 'football', league: 'nfl' },
  nhl: { path: 'hockey/nhl', sport: 'hockey', league: 'nhl' },
  mlb: { path: 'baseball/mlb', sport: 'baseball', league: 'mlb' },
  epl: { path: 'soccer/eng.1', sport: 'soccer', league: 'epl' },
  laliga: { path: 'soccer/esp.1', sport: 'soccer', league: 'laliga' },
  seriea: { path: 'soccer/ita.1', sport: 'soccer', league: 'seriea' },
  bundesliga: { path: 'soccer/ger.1', sport: 'soccer', league: 'bundesliga' },
  ligue1: { path: 'soccer/fra.1', sport: 'soccer', league: 'ligue1' },
  mls: { path: 'soccer/usa.1', sport: 'soccer', league: 'mls' },
};

async function fetchESPN(path) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.events || [];
  } catch (e) {
    console.error(`ESPN fetch error for ${path}:`, e.message);
    return null;
  }
}

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function mapStatus(espnStatus) {
  const type = espnStatus?.type?.name || '';
  if (type === 'STATUS_FINAL' || type === 'STATUS_FINAL_FULL') return 'completed';
  if (type === 'STATUS_IN_PROGRESS' || type === 'STATUS_HALFTIME') return 'live';
  return 'scheduled';
}

function getClock(espnStatus) {
  const display = espnStatus?.displayClock || '';
  const period = espnStatus?.period || '';
  if (!display && !period) return '';
  const isFinal = espnStatus?.type?.name?.includes('FINAL');
  if (isFinal) return 'Final';
  return display ? `${period} ${display}` : `${period}`;
}

async function ingestSport(key, cfg) {
  const events = await fetchESPN(cfg.path);
  if (!events) return 0;
  
  let count = 0;
  for (const event of events) {
    const comp = event.competitions?.[0];
    if (!comp) continue;
    
    const competitors = comp.competitors || [];
    const home = competitors.find(c => c.homeAway === 'home') || competitors[0];
    const away = competitors.find(c => c.homeAway === 'away') || competitors[1];
    if (!home || !away) continue;
    
    const gameId = `espn-${event.id}`;
    const status = mapStatus(comp.status);
    const clock = getClock(comp.status);
    const homeScore = parseInt(home.score) || 0;
    const awayScore = parseInt(away.score) || 0;
    const venue = comp.venue?.fullName || comp.venue?.displayName || '';
    
    // Upsert game
    const sql = `INSERT OR REPLACE INTO games (id, sport, league_id, home_team_id, away_team_id, home_score, away_score, status, start_time, period, venue) 
        VALUES (${esc(gameId)}, ${esc(cfg.sport)}, ${esc(cfg.league)}, ${esc(home.team.abbreviation)}, ${esc(away.team.abbreviation)}, 
        ${homeScore}, ${awayScore}, ${esc(status)}, ${esc(event.date || '')}, ${esc(clock)}, ${esc(venue)})`;
    try {
      DB(sql);
      count++;
    } catch(e) {
      console.error(`  Error inserting ${gameId}:`, e.message.substring(0,80));
    }
  }
  return count;
}

async function runAll() {
  console.log('=== ScoreVerse Data Ingestion ===');
  for (const [key, cfg] of Object.entries(SPORTS)) {
    try {
      const count = await ingestSport(key, cfg);
      console.log(`${key}: ${count} games ingested`);
    } catch (e) {
      console.error(`${key}: Error - ${e.message}`);
    }
  }
  console.log('=== Ingestion Complete ===');
  
  // Show total games in DB
  const total = DB('SELECT COUNT(*) as c FROM games');
  console.log(`Total games in database: ${total[0]?.c || 0}`);
}

runAll().catch(console.error);