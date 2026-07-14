# ScoreVerse AI — Database Schema (v2.0)

## Overview
The ScoreVerse database uses Turso (SQLite-compatible) with 12 tables covering users, teams, leagues, games, AI content, community, and subscriptions. All tables are created and seeded with data.

---

## Table Definitions

### leagues
Stores sport leagues across all major sports.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | League code (e.g., 'nba', 'epl', 'nfl') |
| `name` | TEXT NOT NULL | Full league name |
| `sport` | TEXT NOT NULL | Sport category (basketball, football, soccer, hockey, mma) |
| `logo` | TEXT | Emoji logo |

**Seeded:** 18 leagues (NBA, NFL, NHL, MLB, EPL, La Liga, Bundesliga, Serie A, Ligue 1, MLS, Liga MX, UCL, FIFA WC, FIFA WWC, NCAA BB, NCAA FB, WNBA, UFC)

### teams
Teams across all seeded leagues.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Team code abbreviation |
| `name` | TEXT NOT NULL | Full team name |
| `league_id` | TEXT FK → leagues | Parent league |
| `logo` | TEXT | Team logo URL or emoji |

**Seeded:** 40 teams across multiple leagues.

### games
Game schedules and live scores.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Game ID (format: `espn-{id}` for ESPN data) |
| `sport` | TEXT NOT NULL | Sport category |
| `league_id` | TEXT FK → leagues | League code |
| `home_team_id` | TEXT FK → teams | Home team |
| `away_team_id` | TEXT FK → teams | Away team |
| `home_score` | INTEGER | Home team score |
| `away_score` | INTEGER | Away team score |
| `status` | TEXT NOT NULL | 'live', 'scheduled', 'completed' |
| `start_time` | TEXT | ISO 8601 start time |
| `period` | TEXT | Current period/clock display |
| `venue` | TEXT | Venue/stadium name |

**Seeded:** 92 games with mixed statuses.

### users
User accounts and authentication.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | User ID |
| `username` | TEXT UNIQUE NOT NULL | Display name |
| `email` | TEXT | Email address (for auth) |
| `password_hash` | TEXT | bcrypt password hash |
| `is_premium` | INTEGER DEFAULT 0 | Premium flag |
| `created_at` | TEXT DEFAULT NOW | Join timestamp |

### user_follows
Many-to-many relationship between users and followed teams.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | TEXT FK → users | User |
| `team_id` | TEXT FK → teams | Followed team |
| PRIMARY KEY | (user_id, team_id) | |

### game_summaries
AI-generated game summaries and analysis.

| Column | Type | Description |
|--------|------|-------------|
| `game_id` | TEXT PK FK → games | Game reference |
| `title` | TEXT | Summary headline |
| `summary` | TEXT | AI-generated narrative |
| `ai_analysis` | TEXT | Strategic analysis |
| `created_at` | TEXT DEFAULT NOW | Generation timestamp |

### predictions
AI-generated win probability predictions.

| Column | Type | Description |
|--------|------|-------------|
| `game_id` | TEXT PK FK → games | Game reference |
| `home_win_prob` | REAL | Home win probability (0-100) |
| `away_win_prob` | REAL | Away win probability (0-100) |
| `prediction_text` | TEXT | AI analysis text |
| `is_premium` | INTEGER DEFAULT 0 | Premium-only flag |

### news_articles
Sports news articles (from ESPN API).

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Article ID |
| `title` | TEXT NOT NULL | Headline |
| `summary` | TEXT | Article summary |
| `sport` | TEXT | Sport category |
| `image_url` | TEXT | Article image URL |
| `source` | TEXT | Source attribution |
| `affiliate_url` | TEXT | Affiliate link |
| `affiliate_text` | TEXT | Affiliate CTA text |
| `published_at` | TEXT | Publication timestamp |

### community_channels
Fan discussion channels.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Channel ID |
| `name` | TEXT NOT NULL | Channel name |
| `description` | TEXT | Channel description |
| `sport` | TEXT | Sport category |
| `member_count` | INTEGER DEFAULT 0 | Member count |

**Seeded:** 3 channels (NBA Fan Hub, English Premier League, MMA Fight Club).

### community_messages
Messages in community channels.

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PK | Message ID |
| `channel_id` | TEXT FK → channels | Parent channel |
| `user_name` | TEXT | Sender username |
| `text` | TEXT NOT NULL | Message body |
| `created_at` | TEXT DEFAULT NOW | Timestamp |

### subscriptions
Premium subscription records.

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | TEXT FK → users | Subscriber |
| `plan` | TEXT NOT NULL | Plan type (e.g., 'premium_monthly') |
| `active` | INTEGER DEFAULT 1 | Active flag |
| `started_at` | TEXT DEFAULT NOW | Start timestamp |

### user_settings
Key-value store for user preferences (push subscriptions, etc.).

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | TEXT NOT NULL | User ID |
| `key` | TEXT NOT NULL | Setting key |
| `value` | TEXT | Setting value (JSON) |
| PRIMARY KEY | (user_id, key) | |

---

## API Server

**Port:** 3000 (serves both API + frontend)
**Stack:** Fastify (Node.js) with JWT auth, CORS, Web Push

### API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/health` | Health check | No |
| GET | `/api/scores` | List games (filter: sport, status) | No |
| GET | `/api/scores/:id` | Single game detail | No |
| GET | `/api/scores/:id/summary` | AI game summary | No |
| GET | `/api/scores/:id/prediction` | AI prediction | No |
| GET | `/api/news` | News articles (ESPN) | No |
| GET | `/api/videos` | Video highlights (ESPN) | No |
| GET | `/api/standings` | All league standings | No |
| GET | `/api/standings/:league` | Specific league standings | No |
| GET | `/api/sports` | Available sports list | No |
| GET | `/api/community/channels` | Forum channels | No |
| GET | `/api/community/channels/:id/messages` | Channel messages | No |
| POST | `/api/community/channels/:id/messages` | Post message | Optional |
| GET | `/api/teams/:id` | Team page data | No |
| GET | `/api/teams/:id/schedule` | Team schedule | No |
| GET | `/api/user/profile` | User profile | Optional |
| POST | `/api/user/preferences` | Update favorites | Optional |
| POST | `/api/user/subscribe` | Premium subscription | Optional |
| POST | `/api/auth/signup` | Create account | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Current user info | JWT |
| POST | `/api/notifications/subscribe` | Push notification subscribe | No |
| DELETE | `/api/notifications/unsubscribe` | Push notification unsubscribe | No |

### Database Seed Data
- **18 leagues** across basketball, football, soccer, hockey, mma
- **40 teams** with logos and league associations
- **92 games** with mixed statuses (live, scheduled, completed)
- **3 community channels** with member counts

### Data Ingestion
- `ingest.js` — ESPN API integration for live scores (NFL, NBA, MLB, NHL, EPL, La Liga, etc.)
- `ai.js` — OpenAI content generation for game summaries and predictions
- `espn-service.js` — Standings, news, and video fetching from ESPN

### Push Notifications
- Web Push API with VAPID keys
- `POST /api/notifications/subscribe` — Save push subscription
- `DELETE /api/notifications/unsubscribe` — Remove subscription
- Service worker at `/sw.js`