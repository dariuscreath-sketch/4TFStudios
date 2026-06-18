// AI Content Generation Pipeline for ScoreVerse
// Run: node ai.js "sk-your-key-here"
// Or set: OPENAI_API_KEY environment variable

import { execSync } from 'child_process';

const API_KEY = process.env.OPENAI_API_KEY || process.argv[2];
if (!API_KEY) {
  console.error('ERROR: Provide an OpenAI API key');
  console.error('  node ai.js "sk-..."');
  console.error('  or set OPENAI_API_KEY');
  process.exit(1);
}

const DB = (q) => {
  try {
    const out = execSync(`team-db "${q.replace(/"/g, '\\"')}"`, { encoding: 'utf8', timeout: 10000 });
    return JSON.parse(out);
  } catch (e) { return []; }
};

async function callOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are ScoreVerse AI, a sports analytics assistant. Generate concise, accurate sports content.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.7,
    })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function generateSummary(game) {
  const prompt = `Write a 2-3 sentence game summary for a ${game.sport} match between ${game.home_team} and ${game.away_team}.
${game.home_score !== null ? `Final score: ${game.home_team} ${game.home_score} - ${game.away_score} ${game.away_team}` : 'Game is upcoming.'}
Venue: ${game.venue}
League: ${game.league}

Also provide 4 key stats (like possession %, shots, etc.) and a 1-2 sentence AI tactical analysis.
Format: TITLE|||SUMMARY|||STAT1_LABEL|STAT1_HOME|STAT1_AWAY|||STAT2_LABEL|STAT2_HOME|STAT2_AWAY|||ANALYSIS`;

  const raw = await callOpenAI(prompt);
  const parts = raw.split('|||');
  return {
    title: parts[0] || `${game.home_team} vs ${game.away_team} - Recap`,
    summary: parts[1] || `The ${game.league} match between ${game.home_team} and ${game.away_team} has concluded.`,
    analysis: parts[parts.length - 1] || '',
  };
}

async function generatePrediction(game) {
  const prompt = `Generate a pre-game AI prediction for this upcoming match:
${game.home_team} vs ${game.away_team}
Sport: ${game.sport}
League: ${game.league}
Venue: ${game.venue}

Provide: win probability for each team (as percentages adding to 100), and a 1-2 sentence prediction analysis.
Format: HOME_PCT|||AWAY_PCT|||PREDICTION_TEXT`;

  const raw = await callOpenAI(prompt);
  const parts = raw.split('|||');
  return {
    homeWinProb: parseFloat(parts[0]) || 50,
    awayWinProb: parseFloat(parts[1]) || 50,
    text: parts[2] || 'Prediction analysis unavailable.',
  };
}

async function run() {
  console.log('=== ScoreVerse AI Generation ===');
  
  // Get completed games without summaries
  const completedGames = DB(`SELECT g.id, g.sport, g.home_score, g.away_score, g.venue, g.status,
    COALESCE(ht.name, g.home_team_id) as home_team,
    COALESCE(at.name, g.away_team_id) as away_team,
    COALESCE(l.name, g.league_id) as league
    FROM games g
    LEFT JOIN teams ht ON g.home_team_id = ht.id
    LEFT JOIN teams at ON g.away_team_id = at.id
    LEFT JOIN leagues l ON g.league_id = l.id
    LEFT JOIN game_summaries gs ON g.id = gs.game_id
    WHERE g.status = 'completed' AND gs.game_id IS NULL
    LIMIT 5`);

  console.log(`Generating summaries for ${completedGames.length} completed games...`);
  for (const game of completedGames) {
    try {
      console.log(`  ${game.home_team} vs ${game.away_team}...`);
      const summary = await generateSummary(game);
      DB(`INSERT INTO game_summaries (game_id, title, summary, ai_analysis) VALUES ('${game.id}', '${summary.title.replace(/'/g, "''")}', '${summary.summary.replace(/'/g, "''")}', '${summary.analysis.replace(/'/g, "''")}')`);
      console.log(`    ✅ Summary generated`);
    } catch (e) {
      console.error(`    ❌ Error: ${e.message}`);
    }
  }

  // Get upcoming games without predictions
  const upcomingGames = DB(`SELECT g.id, g.sport, g.venue,
    COALESCE(ht.name, g.home_team_id) as home_team,
    COALESCE(at.name, g.away_team_id) as away_team,
    COALESCE(l.name, g.league_id) as league
    FROM games g
    LEFT JOIN teams ht ON g.home_team_id = ht.id
    LEFT JOIN teams at ON g.away_team_id = at.id
    LEFT JOIN leagues l ON g.league_id = l.id
    LEFT JOIN predictions p ON g.id = p.game_id
    WHERE g.status = 'scheduled' AND p.game_id IS NULL
    LIMIT 5`);

  console.log(`\nGenerating predictions for ${upcomingGames.length} upcoming games...`);
  for (const game of upcomingGames) {
    try {
      console.log(`  ${game.home_team} vs ${game.away_team}...`);
      const pred = await generatePrediction(game);
      DB(`INSERT INTO predictions (game_id, home_win_prob, away_win_prob, prediction_text, is_premium) VALUES ('${game.id}', ${pred.homeWinProb}, ${pred.awayWinProb}, '${pred.text.replace(/'/g, "''")}', 0)`);
      console.log(`    ✅ Prediction generated (${pred.homeWinProb}% vs ${pred.awayWinProb}%)`);
    } catch (e) {
      console.error(`    ❌ Error: ${e.message}`);
    }
  }

  console.log('\n=== Generation Complete ===');
  
  // Verify
  const summaries = DB('SELECT COUNT(*) as c FROM game_summaries');
  const predictions = DB('SELECT COUNT(*) as c FROM predictions');
  console.log(`Total summaries: ${summaries[0]?.c || 0}`);
  console.log(`Total predictions: ${predictions[0]?.c || 0}`);
}

run().catch(console.error);