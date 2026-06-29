import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Zap, Clock, RefreshCw } from 'lucide-react';

interface GameCenterProps {
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  homeWinProb?: number;
  awayWinProb?: number;
  isPremium: boolean;
}

interface Play {
  time: string;
  team: string;
  text: string;
  type: 'score' | 'key' | 'penalty' | 'injury' | 'substitution';
}

export const GameCenter: React.FC<GameCenterProps> = ({
  sport, league, homeTeam, awayTeam,
  homeScore, awayScore, status,
  homeWinProb, awayWinProb, isPremium
}) => {
  const [plays, setPlays] = useState<Play[]>([]);
  const [aiCommentary, setAiCommentary] = useState('');
  const [commentating, setCommentating] = useState(false);

  // Generate simulated plays for live games
  useEffect(() => {
    if (status !== 'live') return;

    const sportEmoji = sport === 'basketball' ? '🏀' : sport === 'soccer' ? '⚽' : sport === 'football' ? '🏈' : sport === 'hockey' ? '🏒' : '⚾';
    
    const possiblePlays: Record<string, Play[]> = {
      basketball: [
        { time: 'Q4 08:32', team: homeTeam, text: `${homeTeam} takes a timeout to regroup`, type: 'key' },
        { time: 'Q4 07:15', team: awayTeam, text: `Three-pointer by ${awayTeam}! Swish from downtown`, type: 'score' },
        { time: 'Q4 06:40', team: homeTeam, text: `Fast break layup by ${homeTeam} off the turnover`, type: 'score' },
        { time: 'Q4 05:55', team: awayTeam, text: `${awayTeam} draws a foul, heading to the line`, type: 'key' },
        { time: 'Q4 04:30', team: homeTeam, text: `Steal and score! ${homeTeam} ties the game!`, type: 'score' },
        { time: 'Q4 03:15', team: awayTeam, text: `${awayTeam} answers with a mid-range jumper`, type: 'score' },
        { time: 'Q4 02:00', team: homeTeam, text: `Alley-oop! The crowd is on their feet!`, type: 'score' },
        { time: 'Q4 01:30', team: awayTeam, text: `${awayTeam} called for a charging foul`, type: 'penalty' },
        { time: 'Q4 00:45', team: homeTeam, text: `Clutch free throws — ${homeTeam} sinks both`, type: 'score' },
      ],
      football: [
        { time: 'Q3 12:15', team: homeTeam, text: `${homeTeam} 3rd & 5 at midfield — QB under center`, type: 'key' },
        { time: 'Q3 10:30', team: awayTeam, text: `Sack! ${awayTeam} defense breaks through`, type: 'key' },
        { time: 'Q3 08:45', team: homeTeam, text: `${homeTeam} RB breaks a 22-yard run! First down`, type: 'score' },
        { time: 'Q3 06:00', team: awayTeam, text: `Field goal attempt by ${awayTeam} — GOOD!`, type: 'score' },
        { time: 'Q3 04:20', team: homeTeam, text: `Interception! ${homeTeam} picks it off!`, type: 'key' },
        { time: 'Q3 02:00', team: homeTeam, text: `Touchdown! ${homeTeam} punches it in from the 2`, type: 'score' },
        { time: 'Q3 00:30', team: awayTeam, text: `${awayTeam} called for holding — 10 yard penalty`, type: 'penalty' },
      ],
      soccer: [
        { time: '58\'', team: homeTeam, text: `${homeTeam} corner kick — cleared by the defense`, type: 'key' },
        { time: '62\'', team: awayTeam, text: `${awayTeam} on the counter! Shot saved by the keeper!`, type: 'key' },
        { time: '67\'', team: homeTeam, text: `GOAL! ${homeTeam} finds the back of the net!`, type: 'score' },
        { time: '74\'', team: awayTeam, text: `Yellow card — ${awayTeam} midfielder cautioned`, type: 'penalty' },
        { time: '78\'', team: homeTeam, text: `${homeTeam} substitution — fresh legs up front`, type: 'substitution' },
        { time: '83\'', team: awayTeam, text: `GOAL! ${awayTeam} equalizes! What a strike!`, type: 'score' },
        { time: '88\'', team: homeTeam, text: `${homeTeam} free kick in dangerous territory...`, type: 'key' },
      ],
    };

    const sportPlays = possiblePlays[sport] || possiblePlays.football;
    
    // Start with first few plays
    setPlays(sportPlays.slice(0, 3));
    
    // Simulate new plays coming in
    let idx = 3;
    const interval = setInterval(() => {
      if (idx < sportPlays.length) {
        setPlays(prev => [...prev, sportPlays[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [status, sport, homeTeam, awayTeam]);

  // Generate AI commentary
  const generateCommentary = async () => {
    setCommentating(true);
    
    const commentaryLines = [
      `${homeTeam} is controlling the tempo here in the ${league} matchup. Their defensive adjustments have been key.`,
      `${awayTeam} needs to respond — the momentum is shifting with every possession.`,
      `AI analysis: ${homeTeam}'s transition game has been the difference-maker. They're generating high-quality looks.`,
      `${awayTeam} is settling into their half-court sets now. Look for them to attack the paint.`,
      `The ${league} analytics suggest ${homeWinProb && homeWinProb > 50 ? homeTeam : awayTeam} has the edge in the final stretch.`,
    ];
    
    let lineIdx = 0;
    const interval = setInterval(() => {
      if (lineIdx < commentaryLines.length) {
        setAiCommentary(commentaryLines[lineIdx]);
        lineIdx++;
      } else {
        clearInterval(interval);
        setCommentating(false);
      }
    }, 5000);
  };

  if (status !== 'live') {
    return (
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 text-center">
        <Clock className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm text-neutral-400">
          {status === 'scheduled' ? 'Game hasn\'t started yet' : 'Game has ended'}
        </p>
        <p className="text-xs text-neutral-500 mt-1">
          Live Game Center activates when the game is live
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 border border-emerald-500/10 rounded-2xl overflow-hidden shadow-xl">
      {/* Live Header */}
      <div className="bg-gradient-to-r from-emerald-950/30 to-neutral-950 border-b border-emerald-500/10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">LIVE</span>
          <span className="text-[10px] text-neutral-500">{league}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-neutral-500">
          <RefreshCw className="w-3 h-3" />
          <span>Auto-updating</span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="p-4 border-b border-neutral-800/50">
        <div className="grid grid-cols-3 items-center gap-2 text-center">
          <div>
            <div className="text-lg font-black text-white">{homeTeam}</div>
            {homeScore !== null && <div className="text-3xl font-black text-emerald-400 mt-1">{homeScore}</div>}
          </div>
          <div>
            <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">VS</div>
            {homeWinProb && awayWinProb && (
              <div className="mt-2">
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${homeWinProb}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-neutral-500 mt-0.5">
                  <span>{homeWinProb}%</span>
                  <span>{awayWinProb}%</span>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="text-lg font-black text-white">{awayTeam}</div>
            {awayScore !== null && <div className="text-3xl font-black text-red-400 mt-1">{awayScore}</div>}
          </div>
        </div>
      </div>

      {/* Play-by-Play Feed */}
      <div className="max-h-64 overflow-y-auto p-3 space-y-2 border-b border-neutral-800/50 no-scrollbar">
        <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2">
          <Zap className="w-3 h-3 text-emerald-500" />
          <span>Play-by-Play</span>
        </div>
        {plays.map((play, i) => (
          <div key={i} className="flex gap-2 text-xs animate-fade-in">
            <span className="text-[10px] text-neutral-500 font-mono w-14 shrink-0 pt-0.5">{play.time}</span>
            <div className={`flex-1 p-2 rounded-lg ${
              play.type === 'score' ? 'bg-emerald-950/20 border border-emerald-500/10' :
              play.type === 'penalty' ? 'bg-red-950/20 border border-red-500/10' :
              play.type === 'substitution' ? 'bg-blue-950/20 border border-blue-500/10' :
              'bg-neutral-900/50 border border-neutral-800/50'
            }`}>
              <span className={`text-[10px] font-bold ${
                play.type === 'score' ? 'text-emerald-400' :
                play.type === 'penalty' ? 'text-red-400' :
                play.type === 'substitution' ? 'text-blue-400' : 'text-neutral-300'
              }`}>
                {play.type === 'score' ? '⚡ SCORE ' : play.type === 'penalty' ? '🚩 PENALTY ' : play.type === 'substitution' ? '🔄 SUB ' : '📌 '}
              </span>
              <span className="text-neutral-300">{play.text}</span>
            </div>
          </div>
        ))}
        {plays.length === 0 && (
          <div className="text-center py-6 text-neutral-600 italic text-xs">
            Waiting for live updates...
          </div>
        )}
      </div>

      {/* AI Commentary */}
      <div className="p-3 bg-gradient-to-r from-purple-950/10 to-neutral-950">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-purple-400" />
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Commentary</span>
          </div>
          {!isPremium && (
            <span className="text-[8px] text-amber-500 font-bold uppercase tracking-widest">Premium</span>
          )}
        </div>
        
        {isPremium ? (
          <div>
            {aiCommentary ? (
              <p className="text-xs text-neutral-300 leading-relaxed italic">
                "{aiCommentary}"
              </p>
            ) : (
              <button
                onClick={generateCommentary}
                disabled={commentating}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center gap-1"
              >
                {commentating ? (
                  <>Generating...</>
                ) : (
                  <><Activity className="w-3 h-3" /> Generate AI Analysis</>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-neutral-900/60 border border-amber-500/10 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-neutral-400">
              <span className="text-amber-400 font-bold">Gold</span> members get live AI commentary
            </p>
          </div>
        )}
      </div>
    </div>
  );
};