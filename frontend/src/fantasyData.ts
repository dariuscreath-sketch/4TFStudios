// Fantasy Football data types and mock data
export interface FantasyPlayer {
  id: string;
  name: string;
  team: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  jerseyNumber?: number;
  byeWeek: number;
  projectedPoints: number;
  fantasyPoints: number; // current season
  stats: {
    passingYards?: number;
    passingTDs?: number;
    interceptions?: number;
    rushingYards?: number;
    rushingTDs?: number;
    receptions?: number;
    receivingYards?: number;
    receivingTDs?: number;
    fieldGoals?: number;
    tackles?: number;
    sacks?: number;
    interceptionsDEF?: number;
    touchdownsDEF?: number;
  };
  price: number; // auction/salary value
  owned: boolean;
  ownerId?: string;
}

export interface FantasyTeam {
  id: string;
  name: string;
  owner: string;
  players: FantasyPlayer[];
  totalPoints: number;
  projectedTotal: number;
  wins: number;
  losses: number;
  ties: number;
  leagueId: string;
}

export interface FantasyLeague {
  id: string;
  name: string;
  teams: FantasyTeam[];
  maxTeams: number;
  draftStatus: 'pending' | 'in_progress' | 'completed';
  currentWeek: number;
}

export const POSITIONS: { id: FantasyPlayer['position']; label: string; max: number }[] = [
  { id: 'QB', label: 'Quarterback', max: 3 },
  { id: 'RB', label: 'Running Back', max: 5 },
  { id: 'WR', label: 'Wide Receiver', max: 5 },
  { id: 'TE', label: 'Tight End', max: 3 },
  { id: 'K', label: 'Kicker', max: 2 },
  { id: 'DEF', label: 'Defense', max: 2 },
];

export const FANTASY_PLAYERS: FantasyPlayer[] = [
  // Quarterbacks
  { id: 'fp-qb-1', name: 'Patrick Mahomes', team: 'KC', position: 'QB', byeWeek: 10, projectedPoints: 380, fantasyPoints: 265, stats: { passingYards: 4250, passingTDs: 35, interceptions: 11, rushingYards: 320, rushingTDs: 2 }, price: 42, owned: false },
  { id: 'fp-qb-2', name: 'Josh Allen', team: 'BUF', position: 'QB', byeWeek: 13, projectedPoints: 365, fantasyPoints: 258, stats: { passingYards: 4100, passingTDs: 32, interceptions: 14, rushingYards: 480, rushingTDs: 7 }, price: 39, owned: false },
  { id: 'fp-qb-3', name: 'Jalen Hurts', team: 'PHI', position: 'QB', byeWeek: 10, projectedPoints: 355, fantasyPoints: 252, stats: { passingYards: 3800, passingTDs: 28, interceptions: 10, rushingYards: 650, rushingTDs: 10 }, price: 37, owned: false },
  { id: 'fp-qb-4', name: 'Lamar Jackson', team: 'BAL', position: 'QB', byeWeek: 13, projectedPoints: 345, fantasyPoints: 240, stats: { passingYards: 3650, passingTDs: 26, interceptions: 12, rushingYards: 820, rushingTDs: 5 }, price: 35, owned: false },
  { id: 'fp-qb-5', name: 'Joe Burrow', team: 'CIN', position: 'QB', byeWeek: 7, projectedPoints: 340, fantasyPoints: 235, stats: { passingYards: 4350, passingTDs: 33, interceptions: 13, rushingYards: 180, rushingTDs: 1 }, price: 33, owned: false },
  { id: 'fp-qb-6', name: 'Dak Prescott', team: 'DAL', position: 'QB', byeWeek: 7, projectedPoints: 320, fantasyPoints: 220, stats: { passingYards: 4050, passingTDs: 30, interceptions: 15, rushingYards: 220, rushingTDs: 2 }, price: 28, owned: false },
  { id: 'fp-qb-7', name: 'C.J. Stroud', team: 'HOU', position: 'QB', byeWeek: 7, projectedPoints: 310, fantasyPoints: 215, stats: { passingYards: 4100, passingTDs: 28, interceptions: 9, rushingYards: 160, rushingTDs: 1 }, price: 26, owned: false },
  { id: 'fp-qb-8', name: 'Justin Herbert', team: 'LAC', position: 'QB', byeWeek: 5, projectedPoints: 305, fantasyPoints: 210, stats: { passingYards: 3900, passingTDs: 27, interceptions: 12, rushingYards: 200, rushingTDs: 1 }, price: 24, owned: false },
  { id: 'fp-qb-9', name: 'Anthony Richardson', team: 'IND', position: 'QB', byeWeek: 11, projectedPoints: 295, fantasyPoints: 195, stats: { passingYards: 2800, passingTDs: 20, interceptions: 11, rushingYards: 550, rushingTDs: 6 }, price: 22, owned: false },
  { id: 'fp-qb-10', name: 'Brock Purdy', team: 'SF', position: 'QB', byeWeek: 9, projectedPoints: 290, fantasyPoints: 205, stats: { passingYards: 3850, passingTDs: 29, interceptions: 10, rushingYards: 140, rushingTDs: 1 }, price: 20, owned: false },

  // Running Backs
  { id: 'fp-rb-1', name: 'Christian McCaffrey', team: 'SF', position: 'RB', byeWeek: 9, projectedPoints: 310, fantasyPoints: 230, stats: { rushingYards: 1450, rushingTDs: 14, receptions: 62, receivingYards: 520, receivingTDs: 4 }, price: 45, owned: false },
  { id: 'fp-rb-2', name: 'Saquon Barkley', team: 'PHI', position: 'RB', byeWeek: 10, projectedPoints: 295, fantasyPoints: 215, stats: { rushingYards: 1320, rushingTDs: 11, receptions: 55, receivingYards: 420, receivingTDs: 3 }, price: 42, owned: false },
  { id: 'fp-rb-3', name: 'Bijan Robinson', team: 'ATL', position: 'RB', byeWeek: 11, projectedPoints: 285, fantasyPoints: 208, stats: { rushingYards: 1280, rushingTDs: 10, receptions: 58, receivingYards: 450, receivingTDs: 3 }, price: 40, owned: false },
  { id: 'fp-rb-4', name: 'Derrick Henry', team: 'BAL', position: 'RB', byeWeek: 13, projectedPoints: 280, fantasyPoints: 202, stats: { rushingYards: 1520, rushingTDs: 15, receptions: 22, receivingYards: 180, receivingTDs: 1 }, price: 38, owned: false },
  { id: 'fp-rb-5', name: 'Jonathan Taylor', team: 'IND', position: 'RB', byeWeek: 11, projectedPoints: 270, fantasyPoints: 195, stats: { rushingYards: 1350, rushingTDs: 12, receptions: 35, receivingYards: 280, receivingTDs: 2 }, price: 36, owned: false },
  { id: 'fp-rb-6', name: 'Travis Etienne', team: 'JAX', position: 'RB', byeWeek: 9, projectedPoints: 260, fantasyPoints: 188, stats: { rushingYards: 1180, rushingTDs: 9, receptions: 48, receivingYards: 380, receivingTDs: 2 }, price: 33, owned: false },
  { id: 'fp-rb-7', name: 'Josh Jacobs', team: 'GB', position: 'RB', byeWeek: 6, projectedPoints: 250, fantasyPoints: 180, stats: { rushingYards: 1250, rushingTDs: 10, receptions: 40, receivingYards: 310, receivingTDs: 1 }, price: 30, owned: false },
  { id: 'fp-rb-8', name: 'Isiah Pacheco', team: 'KC', position: 'RB', byeWeek: 10, projectedPoints: 240, fantasyPoints: 172, stats: { rushingYards: 980, rushingTDs: 8, receptions: 45, receivingYards: 360, receivingTDs: 2 }, price: 28, owned: false },

  // Wide Receivers
  { id: 'fp-wr-1', name: 'Tyreek Hill', team: 'MIA', position: 'WR', byeWeek: 10, projectedPoints: 290, fantasyPoints: 215, stats: { receptions: 105, receivingYards: 1550, receivingTDs: 12, rushingYards: 80, rushingTDs: 1 }, price: 40, owned: false },
  { id: 'fp-wr-2', name: 'Justin Jefferson', team: 'MIN', position: 'WR', byeWeek: 7, projectedPoints: 285, fantasyPoints: 210, stats: { receptions: 110, receivingYards: 1480, receivingTDs: 11, rushingYards: 40, rushingTDs: 0 }, price: 39, owned: false },
  { id: 'fp-wr-3', name: 'Ja\'Marr Chase', team: 'CIN', position: 'WR', byeWeek: 7, projectedPoints: 280, fantasyPoints: 208, stats: { receptions: 102, receivingYards: 1420, receivingTDs: 13, rushingYards: 20, rushingTDs: 0 }, price: 38, owned: false },
  { id: 'fp-wr-4', name: 'CeeDee Lamb', team: 'DAL', position: 'WR', byeWeek: 7, projectedPoints: 275, fantasyPoints: 205, stats: { receptions: 108, receivingYards: 1390, receivingTDs: 10, rushingYards: 60, rushingTDs: 1 }, price: 36, owned: false },
  { id: 'fp-wr-5', name: 'Amon-Ra St. Brown', team: 'DET', position: 'WR', byeWeek: 9, projectedPoints: 265, fantasyPoints: 198, stats: { receptions: 100, receivingYards: 1310, receivingTDs: 9, rushingYards: 30, rushingTDs: 0 }, price: 34, owned: false },
  { id: 'fp-wr-6', name: 'A.J. Brown', team: 'PHI', position: 'WR', byeWeek: 10, projectedPoints: 260, fantasyPoints: 192, stats: { receptions: 88, receivingYards: 1360, receivingTDs: 10, rushingYards: 10, rushingTDs: 0 }, price: 33, owned: false },
  { id: 'fp-wr-7', name: 'Puka Nacua', team: 'LAR', position: 'WR', byeWeek: 9, projectedPoints: 250, fantasyPoints: 185, stats: { receptions: 95, receivingYards: 1200, receivingTDs: 8, rushingYards: 50, rushingTDs: 0 }, price: 30, owned: false },
  { id: 'fp-wr-8', name: 'Garrett Wilson', team: 'NYJ', position: 'WR', byeWeek: 7, projectedPoints: 245, fantasyPoints: 180, stats: { receptions: 92, receivingYards: 1180, receivingTDs: 8, rushingYards: 15, rushingTDs: 0 }, price: 28, owned: false },

  // Tight Ends
  { id: 'fp-te-1', name: 'Travis Kelce', team: 'KC', position: 'TE', byeWeek: 10, projectedPoints: 225, fantasyPoints: 165, stats: { receptions: 82, receivingYards: 980, receivingTDs: 8 }, price: 32, owned: false },
  { id: 'fp-te-2', name: 'Sam LaPorta', team: 'DET', position: 'TE', byeWeek: 9, projectedPoints: 218, fantasyPoints: 158, stats: { receptions: 78, receivingYards: 920, receivingTDs: 7 }, price: 30, owned: false },
  { id: 'fp-te-3', name: 'Mark Andrews', team: 'BAL', position: 'TE', byeWeek: 13, projectedPoints: 210, fantasyPoints: 152, stats: { receptions: 72, receivingYards: 880, receivingTDs: 8 }, price: 28, owned: false },
  { id: 'fp-te-4', name: 'George Kittle', team: 'SF', position: 'TE', byeWeek: 9, projectedPoints: 205, fantasyPoints: 148, stats: { receptions: 65, receivingYards: 850, receivingTDs: 7 }, price: 26, owned: false },
  { id: 'fp-te-5', name: 'Trey McBride', team: 'ARI', position: 'TE', byeWeek: 14, projectedPoints: 198, fantasyPoints: 142, stats: { receptions: 82, receivingYards: 820, receivingTDs: 5 }, price: 24, owned: false },

  // Kickers
  { id: 'fp-k-1', name: 'Justin Tucker', team: 'BAL', position: 'K', byeWeek: 13, projectedPoints: 155, fantasyPoints: 115, stats: { fieldGoals: 32 }, price: 12, owned: false },
  { id: 'fp-k-2', name: 'Harrison Butker', team: 'KC', position: 'K', byeWeek: 10, projectedPoints: 150, fantasyPoints: 112, stats: { fieldGoals: 30 }, price: 11, owned: false },
  { id: 'fp-k-3', name: 'Brandon Aubrey', team: 'DAL', position: 'K', byeWeek: 7, projectedPoints: 152, fantasyPoints: 118, stats: { fieldGoals: 33 }, price: 11, owned: false },
  { id: 'fp-k-4', name: 'Jake Elliott', team: 'PHI', position: 'K', byeWeek: 10, projectedPoints: 145, fantasyPoints: 108, stats: { fieldGoals: 28 }, price: 9, owned: false },

  // Defenses
  { id: 'fp-def-1', name: 'San Francisco 49ers', team: 'SF', position: 'DEF', byeWeek: 9, projectedPoints: 165, fantasyPoints: 128, stats: { tackles: 1050, sacks: 48, interceptionsDEF: 18, touchdownsDEF: 3 }, price: 16, owned: false },
  { id: 'fp-def-2', name: 'Dallas Cowboys', team: 'DAL', position: 'DEF', byeWeek: 7, projectedPoints: 160, fantasyPoints: 125, stats: { tackles: 1080, sacks: 46, interceptionsDEF: 16, touchdownsDEF: 2 }, price: 15, owned: false },
  { id: 'fp-def-3', name: 'Kansas City Chiefs', team: 'KC', position: 'DEF', byeWeek: 10, projectedPoints: 155, fantasyPoints: 120, stats: { tackles: 1020, sacks: 42, interceptionsDEF: 15, touchdownsDEF: 2 }, price: 14, owned: false },
  { id: 'fp-def-4', name: 'Baltimore Ravens', team: 'BAL', position: 'DEF', byeWeek: 13, projectedPoints: 152, fantasyPoints: 118, stats: { tackles: 1060, sacks: 44, interceptionsDEF: 14, touchdownsDEF: 1 }, price: 13, owned: false },
];

// Pre-built league with default teams
const DEFAULT_FANTASY_TEAM_NAMES = [
  'Gridiron Gods',
  'Touchdown Tyrants',
  'End Zone Empire',
  'Fantasy Phenoms',
  'Waiver Wire Wonders',
  'Monday Night Heroes',
  'Bye Week Warriors',
  'Victory Lap Legends',
  'Hail Mary Hustle',
  'Dynasty Drivers',
];

export const createDefaultLeague = (): FantasyLeague => {
  return {
    id: 'league-1',
    name: 'ScoreVerse Super League',
    teams: DEFAULT_FANTASY_TEAM_NAMES.slice(0, 6).map((name, i) => ({
      id: `team-${i}`,
      name,
      owner: i === 0 ? 'You' : `Player ${i}`,
      players: [],
      totalPoints: Math.floor(Math.random() * 200) + 80,
      projectedTotal: Math.floor(Math.random() * 180) + 100,
      wins: Math.floor(Math.random() * 6),
      losses: Math.floor(Math.random() * 6),
      ties: Math.floor(Math.random() * 2),
      leagueId: 'league-1',
    })),
    maxTeams: 10,
    draftStatus: 'completed',
    currentWeek: 6,
  };
};

export const POSITION_LABELS: Record<FantasyPlayer['position'], string> = {
  QB: 'QB', RB: 'RB', WR: 'WR', TE: 'TE', K: 'K', DEF: 'DEF',
};

export const POSITION_COLORS: Record<FantasyPlayer['position'], string> = {
  QB: 'from-blue-500 to-blue-600',
  RB: 'from-emerald-500 to-emerald-600',
  WR: 'from-amber-500 to-amber-600',
  TE: 'from-purple-500 to-purple-600',
  K: 'from-red-500 to-red-600',
  DEF: 'from-slate-500 to-slate-600',
};