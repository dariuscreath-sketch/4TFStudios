# ScoreVerse AI — Database Schema

## Tables

### leagues
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | League code (e.g., 'nba', 'epl') |
| name | TEXT NOT NULL | Full league name |
| sport | TEXT NOT NULL | Sport category |
| logo | TEXT | Emoji/text logo |

### teams
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Team code |
| name | TEXT NOT NULL | Full team name |
| league_id | TEXT FK → leagues | Parent league |
| logo | TEXT | Emoji logo |

### games
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Game ID |
| sport | TEXT NOT NULL | Sport category |
| league_id | TEXT FK → leagues | League |
| home_team_id | TEXT FK → teams | Home team |
| away_team_id | TEXT FK → teams | Away team |
| home_score | INTEGER | Home score |
| away_score | INTEGER | Away score |
| status | TEXT NOT NULL | 'live', 'scheduled', 'completed' |
| start_time | TEXT | ISO 8601 start time |
| period | TEXT | Current period/clock |
| venue | TEXT | Venue name |

### users
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | User ID |
| username | TEXT UNIQUE NOT NULL | Display name |
| is_premium | INTEGER DEFAULT 0 | Premium flag |
| created_at | TEXT | Join timestamp |

### user_follows
| Column | Type | Description |
|--------|------|-------------|
| user_id | TEXT FK → users | User |
| team_id | TEXT FK → teams | Followed team |

### game_summaries
| Column | Type | Description |
|--------|------|-------------|
| game_id | TEXT PK FK → games | Game |
| title | TEXT | Summary headline |
| summary | TEXT | AI-generated narrative |
| ai_analysis | TEXT | Strategic analysis |
| created_at | TEXT | Generation timestamp |

### predictions
| Column | Type | Description |
|--------|------|-------------|
| game_id | TEXT PK FK → games | Game |
| home_win_prob | REAL | Home win % |
| away_win_prob | REAL | Away win % |
| prediction_text | TEXT | AI analysis text |
| is_premium | INTEGER DEFAULT 0 | Premium-only flag |

### news_articles
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Article ID |
| title | TEXT NOT NULL | Headline |
| summary | TEXT | AI summary |
| sport | TEXT | Sport category |
| image_url | TEXT | Article image |
| source | TEXT | Source attribution |
| affiliate_url | TEXT | Affiliate link |
| affiliate_text | TEXT | Affiliate CTA text |
| published_at | TEXT | Publication timestamp |

### community_channels
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Channel ID |
| name | TEXT NOT NULL | Channel name |
| description | TEXT | Channel description |
| sport | TEXT | Sport category |
| member_count | INTEGER DEFAULT 0 | Member count |

### community_messages
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | Message ID |
| channel_id | TEXT FK → channels | Parent channel |
| user_name | TEXT | Sender username |
| text | TEXT NOT NULL | Message body |
| created_at | TEXT | Timestamp |

### subscriptions
| Column | Type | Description |
|--------|------|-------------|
| user_id | TEXT FK → users | Subscriber |
| plan | TEXT NOT NULL | Plan type |
| active | INTEGER DEFAULT 1 | Active flag |
| started_at | TEXT | Start timestamp |

## API Server

**Port:** 3002
**Stack:** Fastify (Node.js)
**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/scores | List games |
| GET | /api/scores/:id | Single game |
| GET | /api/scores/:id/summary | AI summary |
| GET | /api/scores/:id/prediction | AI prediction |
| GET | /api/news | News articles |
| GET | /api/community/channels | Forum channels |
| GET | /api/community/channels/:id/messages | Channel messages |
| POST | /api/community/channels/:id/messages | Post message |
| GET | /api/user/profile | User profile |
| POST | /api/user/preferences | Update preferences |
| POST | /api/user/subscribe | Premium subscription |
| GET | /api/health | Health check |