import Fastify from 'fastify';
import cors from '@fastify/cors';
import { execSync } from 'child_process';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

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
    l.name as league_name
    FROM games g 
    JOIN teams ht ON g.home_team_id = ht.id 
    JOIN teams at ON g.away_team_id = at.id 
    JOIN leagues l ON g.league_id = l.id
    WHERE 1=1`;
  if (sport && sport !== 'all') sql += ` AND g.sport = '${sport}'`;
  if (status) sql += ` AND g.status = '${status}'`;
  sql += ' ORDER BY g.start_time DESC';
  
  const rows = db(sql);
  return rows.map(r => ({
    id: r.id,
    sport: r.sport,
    league: r.league_name,
    status: r.status,
    time: r.period || r.start_time || '',
    homeTeam: { id: r.home_team_id, name: r.home_team_name, logo: r.home_team_logo, score: r.home_score },
    awayTeam: { id: r.away_team_id, name: r.away_team_name, logo: r.away_team_logo, score: r.away_score },
    venue: r.venue,
    hasAiSummary: false,
    hasPrediction: false
  }));
});

// GET /api/scores/:id - single game detail
app.get('/api/scores/:id', async (req) => {
  const rows = db(`SELECT g.*, 
    ht.name as home_team_name, ht.logo as home_team_logo,
    at.name as away_team_name, at.logo as away_team_logo,
    l.name as league_name
    FROM games g 
    JOIN teams ht ON g.home_team_id = ht.id 
    JOIN teams at ON g.away_team_id = at.id 
    JOIN leagues l ON g.league_id = l.id
    WHERE g.id = '${req.params.id}'`);
  if (!rows.length) return { error: 'Game not found' };
  const r = rows[0];
  return {
    id: r.id,
    sport: r.sport,
    league: r.league_name,
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
    JOIN games g ON gs.game_id = g.id
    JOIN teams ht ON g.home_team_id = ht.id
    JOIN teams at ON g.away_team_id = at.id
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

// GET /api/news
app.get('/api/news', async (req) => {
  const { sport } = req.query;
  let sql = 'SELECT * FROM news_articles';
  if (sport && sport !== 'all') sql += ` WHERE sport = '${sport}'`;
  sql += ' ORDER BY published_at DESC';
  const rows = db(sql);
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    sport: r.sport,
    imageUrl: r.image_url,
    publishedAt: r.published_at,
    source: r.source,
    affiliateLink: r.affiliate_url ? { text: r.affiliate_text, url: r.affiliate_url } : undefined
  }));
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
  db(`INSERT INTO community_messages (id, channel_id, user_name, text) VALUES ('msg-${Date.now()}', '${req.params.id}', 'DemoFan', '${text.replace(/'/g, "''")}')`);
  return { success: true };
});

// GET /api/user/profile
app.get('/api/user/profile', async () => {
  return {
    username: 'DemoFan',
    isPremium: false,
    favorites: { sports: ['soccer', 'basketball'], teams: [] },
    notificationsEnabled: true
  };
});

// POST /api/user/preferences
app.post('/api/user/preferences', async (req) => {
  return { success: true, favorites: req.body.favorites };
});

// POST /api/user/subscribe
app.post('/api/user/subscribe', async (req) => {
  const { plan } = req.body;
  db(`INSERT OR IGNORE INTO subscriptions (user_id, plan) VALUES ('demo-user', '${plan}')`);
  return { success: true, isPremium: true, message: 'Welcome to ScoreVerse Premium!' };
});

// Health check
app.get('/api/health', async () => ({ status: 'ok', version: '1.0.0' }));

const port = parseInt(process.env.PORT || '3002');
await app.listen({ port, host: '0.0.0.0' });
console.log(`ScoreVerse API running on port ${port}`);
