import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import bcrypt from 'bcryptjs';
import webPush from 'web-push';
import { execSync } from 'child_process';
import { fetchStandings, fetchNews, fetchVideos, fetchAllStandings, EXTRA_SPORTS } from './espn-service.js';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });
await app.register(jwt, { secret: process.env.JWT_SECRET || 'scoreverse-dev-secret-key-2024' });

// Configure web push
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BP3JcPtR3qPvJc5dGq5c8qR5cJcPvJc5dGq5c8qR5cJcPvJc5dGq5c8qR5cJcPvJc5dGq5c',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'scoreverse-dev-private-key',
};
// Configure web push (skip if keys invalid)
try {
  webPush.setVapidDetails('mailto:support@scoreverse.live', vapidKeys.publicKey, vapidKeys.privateKey);
} catch (e) {
  console.log('Web push not configured:', e.message);
}

function db(query) {
  try {
    const out = execSync(`team-db "${query.replace(/"/g, '\\"')}"`, { encoding: 'utf8', timeout: 10000 });
    return JSON.parse(out);
  } catch (e) {
    console.error('DB Error:', e.message);
    return [];
  }
}

// GET /api/scores - list games with optional sport/status filter
app.get('/api/scores', async (req) => {
  const { sport, status } = req.query;
  let sql = `SELECT g.*, 
    ht.name as home_team_name, ht.logo as home_team_logo,
    at.name as away_team_name, at.logo as away_team_logo,
    l.name as league_name,
    CASE WHEN gs.game_id IS NOT NULL THEN 1 ELSE 0 END as has_summary,
    CASE WHEN p.game_id IS NOT NULL THEN 1 ELSE 0 END as has_pred
    FROM games g 
    LEFT JOIN teams ht ON g.home_team_id = ht.id 
    LEFT JOIN teams at ON g.away_team_id = at.id 
    LEFT JOIN leagues l ON g.league_id = l.id
    LEFT JOIN game_summaries gs ON g.id = gs.game_id
    LEFT JOIN predictions p ON g.id = p.game_id
    WHERE 1=1`;
  if (sport && sport !== 'all') sql += ` AND g.sport = '${sport}'`;
  if (status) sql += ` AND g.status = '${status}'`;
  sql += ' ORDER BY g.start_time DESC';
  
  const rows = db(sql);
  return rows.map(r => ({
    id: r.id,
    sport: r.sport,
    league: r.league_name || r.league_id,
    status: r.status,
    time: r.period || r.start_time || '',
    homeTeam: { id: r.home_team_id, name: r.home_team_name, logo: r.home_team_logo, score: r.home_score },
    awayTeam: { id: r.away_team_id, name: r.away_team_name, logo: r.away_team_logo, score: r.away_score },
    venue: r.venue,
    hasAiSummary: !!r.has_summary,
    hasPrediction: !!r.has_pred
  }));
});

// GET /api/scores/:id - single game detail
app.get('/api/scores/:id', async (req) => {
  const rows = db(`SELECT g.*, 
    ht.name as home_team_name, ht.logo as home_team_logo,
    at.name as away_team_name, at.logo as away_team_logo,
    l.name as league_name
    FROM games g 
    LEFT JOIN teams ht ON g.home_team_id = ht.id 
    LEFT JOIN teams at ON g.away_team_id = at.id 
    LEFT JOIN leagues l ON g.league_id = l.id
    WHERE g.id = '${req.params.id}'`);
  if (!rows.length) return { error: 'Game not found' };
  const r = rows[0];
  return {
    id: r.id,
    sport: r.sport,
    league: r.league_name || r.league_id,
    status: r.status,
    time: r.period || r.start_time || '',
    homeTeam: { id: r.home_team_id, name: r.home_team_name, logo: r.home_team_logo, score: r.home_score },
    awayTeam: { id: r.away_team_id, name: r.away_team_name, logo: r.away_team_logo, score: r.away_score },
    venue: r.venue,
    hasAiSummary: false,
    hasPrediction: false
  };
});

// GET /api/scores/:id/summary - AI game summary
app.get('/api/scores/:id/summary', async (req) => {
  const rows = db(`SELECT gs.*, g.home_score, g.away_score,
    ht.name as home_team_name, at.name as away_team_name
    FROM game_summaries gs 
    LEFT JOIN games g ON gs.game_id = g.id
    LEFT JOIN teams ht ON g.home_team_id = ht.id
    LEFT JOIN teams at ON g.away_team_id = at.id
    WHERE gs.game_id = '${req.params.id}'`);
  if (!rows.length) {
    return { gameId: req.params.id, summary: 'AI summary not yet generated for this game.' };
  }
  const r = rows[0];
  return {
    gameId: r.game_id,
    title: r.title || 'Game Summary',
    summary: r.summary,
    keyStats: [],
    aiAnalysis: r.ai_analysis || ''
  };
});

// GET /api/scores/:id/prediction - AI prediction
app.get('/api/scores/:id/prediction', async (req) => {
  const rows = db(`SELECT p.* FROM predictions p WHERE p.game_id = '${req.params.id}'`);
  if (!rows.length) {
    return { gameId: req.params.id, homeWinProbability: 50, awayWinProbability: 50, predictionText: 'Prediction available for Premium users.', isPremium: true };
  }
  const r = rows[0];
  return {
    gameId: r.game_id,
    homeWinProbability: r.home_win_prob,
    awayWinProbability: r.away_win_prob,
    predictionText: r.prediction_text,
    isPremium: !!r.is_premium
  };
});

  // GET /api/community/channels
app.get('/api/community/channels', async () => {
  const rows = db('SELECT * FROM community_channels ORDER BY member_count DESC');
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    sport: r.sport,
    memberCount: r.member_count
  }));
});

// GET /api/community/channels/:id/messages
app.get('/api/community/channels/:id/messages', async (req) => {
  const rows = db(`SELECT * FROM community_messages WHERE channel_id = '${req.params.id}' ORDER BY created_at ASC`);
  return rows.map(r => ({
    id: r.id,
    channelId: r.channel_id,
    user: { name: r.user_name, isPremium: false },
    text: r.text,
    timestamp: r.created_at
  }));
});

// POST /api/community/channels/:id/messages
app.post('/api/community/channels/:id/messages', async (req) => {
  const { text } = req.body;
  if (!text) return { error: 'text is required' };

  let senderName = 'DemoFan';
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = app.jwt.verify(token);
      if (decoded && decoded.username) {
        senderName = decoded.username;
      }
    }
  } catch (err) {
    // Ignore JWT errors
  }

  db(`INSERT INTO community_messages (id, channel_id, user_name, text) VALUES ('msg-${Date.now()}', '${req.params.id}', '${senderName.replace(/'/g, "''")}', '${text.replace(/'/g, "''")}')`);
  return { success: true };
});

// GET /api/user/profile
app.get('/api/user/profile', async (req) => {
  let user = null;
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      user = app.jwt.verify(token);
    }
  } catch (err) {
    // Ignore token errors
  }

  if (user) {
    const users = db(`SELECT * FROM users WHERE id = '${user.id}'`);
    if (users && users.length > 0) {
      const u = users[0];
      const subs = db(`SELECT * FROM subscriptions WHERE user_id = '${u.id}' AND active = 1`);
      const follows = db(`SELECT * FROM user_follows WHERE user_id = '${u.id}'`);
      return {
        id: u.id,
        username: u.username,
        email: u.email,
        isPremium: u.is_premium === 1 || subs.length > 0,
        favorites: { sports: ['soccer', 'basketball'], teams: follows.map(f => f.team_id) },
        notificationsEnabled: true
      };
    }
  }

  return {
    id: 'demo-user',
    username: 'DemoFan',
    isPremium: false,
    favorites: { sports: ['soccer', 'basketball'], teams: [] },
    notificationsEnabled: true
  };
});

// POST /api/user/preferences
app.post('/api/user/preferences', async (req) => {
  let user = null;
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      user = app.jwt.verify(token);
    }
  } catch (err) {
    // Ignore token errors
  }

  const { favorites } = req.body;
  if (user && favorites?.teams) {
    // Keep user's followed teams synchronized
    db(`DELETE FROM user_follows WHERE user_id = '${user.id}'`);
    for (const teamId of favorites.teams) {
      db(`INSERT OR IGNORE INTO user_follows (user_id, team_id) VALUES ('${user.id}', '${teamId}')`);
    }
  }

  return { success: true, favorites };
});

// POST /api/user/subscribe
app.post('/api/user/subscribe', async (req) => {
  const { plan } = req.body;
  let userId = 'demo-user';
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      const decoded = app.jwt.verify(token);
      if (decoded && decoded.id) {
        userId = decoded.id;
        db(`UPDATE users SET is_premium = 1 WHERE id = '${userId}'`);
      }
    }
  } catch (err) {
    // Ignore token errors
  }

  db(`INSERT OR IGNORE INTO subscriptions (user_id, plan) VALUES ('${userId}', '${plan}')`);
  return { success: true, isPremium: true, message: 'Welcome to ScoreVerse Premium!' };
});

// Health check
app.get('/api/health', async () => ({ status: 'ok', version: '1.0.0' }));

// GET /api/standings/:league
app.get('/api/standings/:league', async (req) => {
  const STANDINGS_MAP = {
    'epl': ['soccer', 'eng.1'], 'laliga': ['soccer', 'esp.1'], 'seriea': ['soccer', 'ita.1'],
    'bundesliga': ['soccer', 'ger.1'], 'ligue1': ['soccer', 'fra.1'], 'mls': ['soccer', 'usa.1'],
    'nba': ['basketball', 'nba'], 'nfl': ['football', 'nfl'], 'mlb': ['baseball', 'mlb'],
    'nhl': ['hockey', 'nhl'],
  };
  const mapping = STANDINGS_MAP[req.params.league];
  if (!mapping) return { error: 'League not found' };
  const data = await fetchStandings(mapping[0], mapping[1]);
  return { league: req.params.league, standings: data || [] };
});

// GET /api/standings
app.get('/api/standings', async () => {
  const data = await fetchAllStandings();
  return data;
});

// GET /api/news
app.get('/api/news', async (req) => {
  const { sport } = req.query;
  const articles = await fetchNews(sport || 'all');
  return articles;
});

// GET /api/videos
app.get('/api/videos', async (req) => {
  const { sport } = req.query;
  const videos = await fetchVideos(sport || 'all');
  return videos;
});

// GET /api/sports - list available extra sports
app.get('/api/sports', async () => {
  return EXTRA_SPORTS;
});

// ============ AUTH ============

// POST /api/auth/signup
app.post('/api/auth/signup', async (req) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return { error: 'All fields required' };
  const existing = db(`SELECT id FROM users WHERE username = '${username}' OR email = '${email}'`);
  if (existing.length) return { error: 'User already exists' };
  const hash = await bcrypt.hash(password, 10);
  const id = `user-${Date.now()}`;
  db(`INSERT INTO users (id, username, email, password_hash) VALUES ('${id}', '${username}', '${email}', '${hash}')`);
  const token = await app.jwt.sign({ id, username });
  return { token, user: { id, username, email, isPremium: false } };
});

// POST /api/auth/login
app.post('/api/auth/login', async (req) => {
  const { username, password } = req.body;
  const users = db(`SELECT * FROM users WHERE username = '${username}'`);
  if (!users.length) return { error: 'Invalid credentials' };
  const user = users[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { error: 'Invalid credentials' };
  const token = await app.jwt.sign({ id: user.id, username: user.username });
  return { token, user: { id: user.id, username: user.username, email: user.email, isPremium: !!user.is_premium } };
});

// GET /api/auth/me
app.get('/api/auth/me', async (req) => {
  try {
    await req.jwtVerify();
    const users = db(`SELECT * FROM users WHERE id = '${req.user.id}'`);
    if (!users.length) return { error: 'User not found' };
    const u = users[0];
    return { id: u.id, username: u.username, email: u.email, isPremium: !!u.is_premium };
  } catch { return { error: 'Not authenticated' }; }
});

// ============ TEAM PAGES ============

// GET /api/teams/:id - full team page data
app.get('/api/teams/:id', async (req) => {
  const { id } = req.params;
  // Get team info
  const teams = db(`SELECT t.*, l.name as league_name, l.sport FROM teams t LEFT JOIN leagues l ON t.league_id = l.id WHERE t.id = '${id}'`);
  if (!teams.length) {
    // Try ESPN API for team lookup
    return { error: 'Team not found', id };
  }
  const team = teams[0];
  
  // Get recent games
  const games = db(`SELECT g.*, 
    COALESCE(ht.name, g.home_team_id) as home_name, COALESCE(at.name, g.away_team_id) as away_name,
    COALESCE(ht.logo, '') as home_logo, COALESCE(at.logo, '') as away_logo
    FROM games g 
    LEFT JOIN teams ht ON g.home_team_id = ht.id
    LEFT JOIN teams at ON g.away_team_id = at.id
    WHERE g.home_team_id = '${id}' OR g.away_team_id = '${id}'
    ORDER BY g.start_time DESC LIMIT 10`);
  
  // Get standings position
  const standingsData = await fetchStandings(team.sport, team.league_id);
  const position = standingsData?.findIndex(e => e.name?.toLowerCase().includes(team.name?.toLowerCase() || '')) ?? -1;

  return {
    id: team.id,
    name: team.name,
    logo: team.logo,
    league: team.league_name,
    sport: team.sport,
    standingsPosition: position >= 0 ? position + 1 : null,
    recentGames: games.map(g => ({
      id: g.id, status: g.status, homeTeam: g.home_name, awayTeam: g.away_name,
      homeScore: g.home_score, awayScore: g.away_score, time: g.period || g.start_time,
      venue: g.venue, sport: g.sport,
    })),
  };
});

// GET /api/teams/:id/schedule
app.get('/api/teams/:id/schedule', async (req) => {
  const { id } = req.params;
  const games = db(`SELECT g.*,
    COALESCE(ht.name, g.home_team_id) as home_name, COALESCE(at.name, g.away_team_id) as away_name
    FROM games g
    LEFT JOIN teams ht ON g.home_team_id = ht.id
    LEFT JOIN teams at ON g.away_team_id = at.id
    WHERE (g.home_team_id = '${id}' OR g.away_team_id = '${id}') AND g.status = 'scheduled'
    ORDER BY g.start_time ASC LIMIT 10`);
  return games;
});

// ============ PUSH NOTIFICATIONS ============

// POST /api/notifications/subscribe
app.post('/api/notifications/subscribe', async (req) => {
  const { subscription, userId } = req.body;
  if (!subscription) return { error: 'Subscription required' };
  db(`INSERT OR REPLACE INTO user_settings (user_id, key, value) VALUES ('${userId || 'anonymous'}', 'push_subscription', '${JSON.stringify(subscription).replace(/'/g, "''")}')`);
  return { success: true };
});

// DELETE /api/notifications/unsubscribe
app.delete('/api/notifications/unsubscribe', async (req) => {
  const { userId } = req.body;
  db(`DELETE FROM user_settings WHERE user_id = '${userId || 'anonymous'}' AND key = 'push_subscription'`);
  return { success: true };
});

// Serve static frontend in production
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '..', 'frontend', 'dist');

try {
  const indexHtml = readFileSync(join(distPath, 'index.html'), 'utf8');
  
  // Serve static assets
  app.get('/*', async (req, reply) => {
    // Let API routes handle themselves
    if (req.url.startsWith('/api/')) return;
    
    const filePath = join(distPath, req.url === '/' ? 'index.html' : req.url);
    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const mime = {
        'html': 'text/html', 'js': 'application/javascript', 'css': 'text/css',
        'png': 'image/png', 'svg': 'image/svg+xml', 'json': 'application/json',
        'ico': 'image/x-icon', 'webmanifest': 'application/manifest+json'
      };
      reply.type(mime[ext] || 'text/plain').send(content);
    } catch {
      reply.type('text/html').send(indexHtml);
    }
  });
  console.log('Serving frontend static files');
} catch (e) {
  console.log('Frontend dist not found, API-only mode:', e.message);
}

const port = parseInt(process.env.PORT || '3002');
await app.listen({ port, host: '0.0.0.0' });
console.log(`ScoreVerse running on port ${port}`);
