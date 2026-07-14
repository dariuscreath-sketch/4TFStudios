// ScoreVerse API - Vercel Serverless
// Handles all /api/* routes
import { execSync } from 'child_process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'scoreverse-dev-secret-key-2024';

function db(query) {
  try {
    const out = execSync(`team-db "${query.replace(/"/g, '\\"')}"`, { encoding: 'utf8', timeout: 10000 });
    return JSON.parse(out);
  } catch (e) {
    console.error('DB Error:', e.message);
    return [];
  }
}

function sendJSON(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

function getToken(req) {
  const auth = req.headers['authorization'];
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
  } catch { return null; }
}

// ========== ROUTES ==========

const routes = {
  // Health
  'GET /api/health': async (req, res) => {
    sendJSON(res, { status: 'ok', version: '1.0.0' });
  },

  // Scores
  'GET /api/scores': async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const sport = url.searchParams.get('sport');
    const status = url.searchParams.get('status');
    let sql = `SELECT g.*,
      COALESCE(ht.name, g.home_team_id) as home_team_name, ht.logo as home_team_logo,
      COALESCE(at.name, g.away_team_id) as away_team_name, at.logo as away_team_logo,
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
    sql += ' ORDER BY g.start_time DESC LIMIT 50';
    const rows = db(sql);
    sendJSON(res, rows.map(r => ({
      id: r.id, sport: r.sport, league: r.league_name || r.league_id, status: r.status,
      time: r.period || r.start_time || '',
      homeTeam: { id: r.home_team_id, name: r.home_team_name || r.home_team_id, logo: r.home_team_logo, score: r.home_score },
      awayTeam: { id: r.away_team_id, name: r.away_team_name || r.away_team_id, logo: r.away_team_logo, score: r.away_score },
      venue: r.venue, hasAiSummary: !!r.has_summary, hasPrediction: !!r.has_pred
    })));
  },

  // Single game
  'GET /api/scores/:id': async (req, res, id) => {
    const rows = db(`SELECT g.*,
      COALESCE(ht.name, g.home_team_id) as home_team_name, ht.logo as home_team_logo,
      COALESCE(at.name, g.away_team_id) as away_team_name, at.logo as away_team_logo,
      l.name as league_name
      FROM games g 
      LEFT JOIN teams ht ON g.home_team_id = ht.id
      LEFT JOIN teams at ON g.away_team_id = at.id
      LEFT JOIN leagues l ON g.league_id = l.id
      WHERE g.id = '${id}'`);
    if (!rows.length) return sendJSON(res, { error: 'Game not found' }, 404);
    const r = rows[0];
    sendJSON(res, {
      id: r.id, sport: r.sport, league: r.league_name || r.league_id, status: r.status,
      time: r.period || r.start_time || '',
      homeTeam: { id: r.home_team_id, name: r.home_team_name || r.home_team_id, logo: r.home_team_logo, score: r.home_score },
      awayTeam: { id: r.away_team_id, name: r.away_team_name || r.away_team_id, logo: r.away_team_logo, score: r.away_score },
      venue: r.venue,
    });
  },

  // Game summary
  'GET /api/scores/:id/summary': async (req, res, id) => {
    const rows = db(`SELECT gs.* FROM game_summaries gs WHERE gs.game_id = '${id}'`);
    if (!rows.length) return sendJSON(res, { gameId: id, summary: 'AI summary not yet generated.' });
    const r = rows[0];
    sendJSON(res, { gameId: r.game_id, title: r.title || 'Game Summary', summary: r.summary, keyStats: [], aiAnalysis: r.ai_analysis || '' });
  },

  // Game prediction
  'GET /api/scores/:id/prediction': async (req, res, id) => {
    const rows = db(`SELECT p.* FROM predictions p WHERE p.game_id = '${id}'`);
    if (!rows.length) return sendJSON(res, { gameId: id, homeWinProbability: 50, awayWinProbability: 50, predictionText: 'Prediction available for Premium users.', isPremium: true });
    const r = rows[0];
    sendJSON(res, { gameId: r.game_id, homeWinProbability: r.home_win_prob, awayWinProbability: r.away_win_prob, predictionText: r.prediction_text, isPremium: !!r.is_premium });
  },

  // Auth
  'POST /api/auth/signup': async (req, res) => {
    const body = await parseBody(req);
    const { username, email, password } = body;
    if (!username || !email || !password) return sendJSON(res, { error: 'All fields required' }, 400);
    const existing = db(`SELECT id FROM users WHERE username = '${username}' OR email = '${email}'`);
    if (existing.length) return sendJSON(res, { error: 'User already exists' }, 400);
    const hash = await bcrypt.hash(password, 10);
    const id = `user-${Date.now()}`;
    db(`INSERT INTO users (id, username, email, password_hash) VALUES ('${id}', '${username}', '${email}', '${hash}')`);
    const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
    sendJSON(res, { token, user: { id, username, email, isPremium: false } });
  },

  'POST /api/auth/login': async (req, res) => {
    const body = await parseBody(req);
    const { username, password } = body;
    const users = db(`SELECT * FROM users WHERE username = '${username}'`);
    if (!users.length) return sendJSON(res, { error: 'Invalid credentials' }, 401);
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return sendJSON(res, { error: 'Invalid credentials' }, 401);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    sendJSON(res, { token, user: { id: user.id, username: user.username, email: user.email, isPremium: !!user.is_premium } });
  },

  'GET /api/auth/me': async (req, res) => {
    const decoded = getToken(req);
    if (!decoded) return sendJSON(res, { error: 'Not authenticated' }, 401);
    const users = db(`SELECT * FROM users WHERE id = '${decoded.id}'`);
    if (!users.length) return sendJSON(res, { error: 'User not found' }, 404);
    const u = users[0];
    sendJSON(res, { id: u.id, username: u.username, email: u.email, isPremium: !!u.is_premium });
  },

  // User profile
  'GET /api/user/profile': async (req, res) => {
    const decoded = getToken(req);
    if (decoded) {
      const users = db(`SELECT * FROM users WHERE id = '${decoded.id}'`);
      if (users.length) {
        const u = users[0];
        const subs = db(`SELECT * FROM subscriptions WHERE user_id = '${u.id}' AND active = 1`);
        const follows = db(`SELECT * FROM user_follows WHERE user_id = '${u.id}'`);
        return sendJSON(res, { id: u.id, username: u.username, email: u.email, isPremium: u.is_premium === 1 || subs.length > 0, favorites: { sports: ['soccer', 'basketball'], teams: follows.map(f => f.team_id) }, notificationsEnabled: true });
      }
    }
    sendJSON(res, { id: 'demo-user', username: 'DemoFan', isPremium: false, favorites: { sports: ['soccer', 'basketball'], teams: [] }, notificationsEnabled: true });
  },

  'POST /api/user/subscribe': async (req, res) => {
    const body = await parseBody(req);
    const decoded = getToken(req);
    if (decoded) {
      db(`UPDATE users SET is_premium = 1 WHERE id = '${decoded.id}'`);
    }
    db(`INSERT OR IGNORE INTO subscriptions (user_id, plan) VALUES ('${decoded?.id || 'demo-user'}', '${body.plan || 'premium_monthly'}')`);
    sendJSON(res, { success: true, isPremium: true, message: 'Welcome to ScoreVerse Premium!' });
  },

  // Community channels
  'GET /api/community/channels': async (req, res) => {
    const rows = db('SELECT * FROM community_channels ORDER BY member_count DESC');
    sendJSON(res, rows.map(r => ({ id: r.id, name: r.name, description: r.description, sport: r.sport, memberCount: r.member_count })));
  },

  'GET /api/community/channels/:id/messages': async (req, res, id) => {
    const rows = db(`SELECT * FROM community_messages WHERE channel_id = '${id}' ORDER BY created_at ASC LIMIT 100`);
    sendJSON(res, rows.map(r => ({ id: r.id, channelId: r.channel_id, user: { name: r.user_name, isPremium: false }, text: r.text, timestamp: r.created_at })));
  },

  'POST /api/community/channels/:id/messages': async (req, res, id) => {
    const body = await parseBody(req);
    if (!body.text) return sendJSON(res, { error: 'text is required' }, 400);
    const decoded = getToken(req);
    const senderName = decoded?.username || 'DemoFan';
    db(`INSERT INTO community_messages (id, channel_id, user_name, text) VALUES ('msg-${Date.now()}', '${id}', '${senderName.replace(/'/g, "''")}', '${body.text.replace(/'/g, "''")}')`);
    sendJSON(res, { success: true });
  },

  // Teams
  'GET /api/teams/:id': async (req, res, id) => {
    const teams = db(`SELECT t.*, l.name as league_name, l.sport FROM teams t LEFT JOIN leagues l ON t.league_id = l.id WHERE t.id = '${id}'`);
    if (!teams.length) return sendJSON(res, { error: 'Team not found' }, 404);
    const team = teams[0];
    const games = db(`SELECT g.*,
      COALESCE(ht.name, g.home_team_id) as home_name, COALESCE(at.name, g.away_team_id) as away_name,
      COALESCE(ht.logo, '') as home_logo, COALESCE(at.logo, '') as away_logo
      FROM games g
      LEFT JOIN teams ht ON g.home_team_id = ht.id
      LEFT JOIN teams at ON g.away_team_id = at.id
      WHERE g.home_team_id = '${id}' OR g.away_team_id = '${id}'
      ORDER BY g.start_time DESC LIMIT 10`);
    sendJSON(res, {
      id: team.id, name: team.name, logo: team.logo, league: team.league_name, sport: team.sport,
      standingsPosition: null,
      recentGames: games.map(g => ({ id: g.id, status: g.status, homeTeam: g.home_name, awayTeam: g.away_name, homeScore: g.home_score, awayScore: g.away_score, time: g.period || g.start_time, venue: g.venue, sport: g.sport })),
    });
  },

  'GET /api/teams/:id/schedule': async (req, res, id) => {
    const games = db(`SELECT g.*, COALESCE(ht.name, g.home_team_id) as home_name, COALESCE(at.name, g.away_team_id) as away_name
      FROM games g LEFT JOIN teams ht ON g.home_team_id = ht.id LEFT JOIN teams at ON g.away_team_id = at.id
      WHERE (g.home_team_id = '${id}' OR g.away_team_id = '${id}') AND g.status = 'scheduled'
      ORDER BY g.start_time ASC LIMIT 10`);
    sendJSON(res, games);
  },
};

// Parse URL to extract params
function matchRoute(url, method) {
  const path = url.pathname.replace(/\/$/, '');
  for (const [route, handler] of Object.entries(routes)) {
    const [routeMethod, routePath] = route.split(' ');
    if (routeMethod !== method) continue;
    const routeParts = routePath.split('/');
    const pathParts = path.split('/');
    if (routeParts.length !== pathParts.length) continue;
    const params = {};
    let match = true;
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }
    if (match) return { handler, params };
  }
  return null;
}

// Main handler
export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  const matched = matchRoute(url, req.method);

  if (matched) {
    const { handler, params } = matched;
    await handler(req, res, ...Object.values(params));
  } else {
    sendJSON(res, { error: 'Not found' }, 404);
  }
}