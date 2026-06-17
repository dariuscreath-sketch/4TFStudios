# ScoreVerse AI - API Contract Proposal
This document outlines the API contracts designed by the Frontend Engineer for integration with the Backend.

The base URL for all endpoints is `/api`.

---

## 1. Scores & Game Summaries

### `GET /api/scores`
Retrieve live, upcoming, and finished game scores.
- **Query Params:**
  - `sport`: string (optional, e.g., `soccer`, `basketball`, `football`, `baseball`, `hockey`)
  - `status`: string (optional, e.g., `live`, `scheduled`, `completed`)
- **Response (200 OK):**
```json
[
  {
    "id": "game-101",
    "sport": "basketball",
    "league": "NBA",
    "status": "live", // "live" | "scheduled" | "completed"
    "time": "Q4 08:32", // "scheduled time" e.g., "19:00" or game clock e.g., "Q4 08:32"
    "homeTeam": {
      "id": "team-bos",
      "name": "Boston Celtics",
      "logo": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=48&h=48&fit=crop",
      "score": 102
    },
    "awayTeam": {
      "id": "team-gsw",
      "name": "Golden State Warriors",
      "logo": "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=48&h=48&fit=crop",
      "score": 98
    },
    "venue": "TD Garden",
    "hasAiSummary": true,
    "hasPrediction": true
  }
]
```

### `GET /api/scores/:id/summary`
Retrieve AI-generated game summary and advanced match analytics.
- **Response (200 OK):**
```json
{
  "gameId": "game-101",
  "title": "Celtics Edge Out Warriors in Thrilling Q4 Showcase",
  "summary": "The Boston Celtics secured a narrow 104-102 victory over the Golden State Warriors in an intense battle at the TD Garden. Tatum led the Celtics with 34 points, including a crucial stepback three-pointer with 12 seconds remaining. Curry's desperate heave at the buzzer clanged off the back rim, sealing GSW's fate. Boston's dominant bench play proved to be the difference-maker.",
  "keyStats": [
    { "label": "FG %", "home": "48.2%", "away": "45.1%" },
    { "label": "3PT %", "home": "38.5%", "away": "41.2%" },
    { "label": "Rebounds", "home": "45", "away": "38" },
    { "label": "Turnovers", "home": "12", "away": "15" }
  ],
  "aiAnalysis": "Boston exploited Golden State's interior defense successfully. The Celtics' transitional defense limited transition points to just 8, a season-low for GSW. Curry was constantly doubled, creating open looks for Klay Thompson who struggled, shooting 4-15."
}
```

### `GET /api/scores/:id/prediction`
Retrieve game winner probability, line analysis, and expert predictions.
- **Response (200 OK):**
```json
{
  "gameId": "game-101",
  "homeWinProbability": 58.5,
  "awayWinProbability": 41.5,
  "predictionText": "Boston Celtics are projected to win by 4.5 points. Boston has won 85% of home games when favored by 3+ points. Golden State is playing on the second night of a back-to-back, which historically lowers their shooting accuracy by 2.8%.",
  "isPremium": false
}
```

---

## 2. News Feed

### `GET /api/news`
Retrieve latest sports news articles and AI aggregated summaries.
- **Query Params:**
  - `sport`: string (optional, e.g., `soccer`, `basketball`)
  - `personalized`: boolean (optional, true if user wants favorite sports only)
- **Response (200 OK):**
```json
[
  {
    "id": "news-201",
    "title": "Mbappe Completes Historic Real Madrid Move",
    "summary": "Kylian Mbappe has officially joined Real Madrid on a free transfer, signing a five-year deal. The French superstar joins an already star-studded lineup featuring Vinicius Jr. and Jude Bellingham, creating one of the most formidable attack lines in football history.",
    "sport": "soccer",
    "imageUrl": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop",
    "publishedAt": "2026-06-17T12:00:00Z",
    "source": "Aggregated AI News",
    "affiliateLink": {
      "text": "Shop Real Madrid Mbappe Jersey",
      "url": "https://store.realmadrid.com"
    }
  }
]
```

---

## 3. Community Forums & Chats

### `GET /api/community/channels`
Retrieve available fan group channels.
- **Response (200 OK):**
```json
[
  {
    "id": "chan-nba",
    "name": "NBA Fan Hub",
    "description": "General discussions about the NBA, drafts, and matchups",
    "sport": "basketball",
    "memberCount": 1420
  },
  {
    "id": "chan-premier",
    "name": "English Premier League",
    "description": "Weekly matches, transfers, and banter",
    "sport": "soccer",
    "memberCount": 850
  }
]
```

### `GET /api/community/channels/:id/messages`
Retrieve message log for a particular group chat channel.
- **Response (200 OK):**
```json
[
  {
    "id": "msg-501",
    "channelId": "chan-nba",
    "user": {
      "name": "SlamDunk99",
      "isPremium": true
    },
    "text": "Tatum is definitely the MVP frontrunner this season!",
    "timestamp": "2026-06-17T18:05:00Z"
  }
]
```

### `POST /api/community/channels/:id/messages`
Publish a new message inside a community fan chat channel.
- **Request Body:**
```json
{
  "text": "Curry's final shot was crazy close though!"
}
```
- **Response (201 Created):**
```json
{
  "id": "msg-502",
  "channelId": "chan-nba",
  "user": {
    "name": "DemoFan",
    "isPremium": false
  },
  "text": "Curry's final shot was crazy close though!",
  "timestamp": "2026-06-17T18:10:00Z"
}
```

---

## 4. User Profile & Subscription

### `GET /api/user/profile`
Get active user profile details, favorites, and tier status.
- **Response (200 OK):**
```json
{
  "username": "DemoFan",
  "isPremium": false, // premium subscription status
  "favorites": {
    "sports": ["basketball", "soccer"],
    "teams": ["team-bos", "team-gsw"]
  },
  "notificationsEnabled": true
}
```

### `POST /api/user/preferences`
Save user sports/team interests.
- **Request Body:**
```json
{
  "favorites": {
    "sports": ["basketball", "soccer"],
    "teams": ["team-bos", "team-gsw"]
  }
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "favorites": {
    "sports": ["basketball", "soccer"],
    "teams": ["team-bos", "team-gsw"]
  }
}
```

### `POST /api/user/subscribe`
Activate Gold / Premium tier ($4.99/mo).
- **Request Body:**
```json
{
  "plan": "premium_monthly",
  "paymentMethodNonce": "fake-nonce"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "isPremium": true,
  "message": "Welcome to ScoreVerse Premium! AI Predictions and betting insights are now unlocked."
}
```
