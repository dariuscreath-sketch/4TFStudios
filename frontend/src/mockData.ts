export interface Team {
  id: string;
  name: string;
  logo: string;
  score?: number;
}

export interface Match {
  id: string;
  sport: string;
  league: string;
  status: 'live' | 'scheduled' | 'completed';
  time: string;
  homeTeam: Team;
  awayTeam: Team;
  venue: string;
  hasAiSummary: boolean;
  hasPrediction: boolean;
  aiSummary?: {
    title: string;
    summary: string;
    keyStats: { label: string; home: string; away: string }[];
    aiAnalysis: string;
  };
  prediction?: {
    homeWinProbability: number;
    awayWinProbability: number;
    predictionText: string;
    isPremium: boolean;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  sport: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  affiliateLink?: {
    text: string;
    url: string;
  };
}

export interface CommunityChannel {
  id: string;
  name: string;
  description: string;
  sport: string;
  memberCount: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  user: {
    name: string;
    isPremium: boolean;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export interface Poll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  userVotedIndex?: number;
}

export const initialSports = [
  { id: 'all', name: 'All Sports' },
  { id: 'soccer', name: 'Soccer' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'football', name: 'Football' },
  { id: 'baseball', name: 'Baseball' },
  { id: 'hockey', name: 'Hockey' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'golf', name: 'Golf' },
  { id: 'f1', name: 'F1' },
  { id: 'ufc', name: 'UFC' },
  { id: 'cricket', name: 'Cricket' },
  { id: 'boxing', name: 'Boxing' },
  { id: 'college-fb', name: 'College FB' },
  { id: 'college-bb', name: 'College BB' },
];

export const initialMatches: Match[] = [
  {
    id: 'game-101',
    sport: 'basketball',
    league: 'NBA',
    status: 'live',
    time: 'Q4 08:32',
    homeTeam: {
      id: 'team-bos',
      name: 'Boston Celtics',
      logo: '🟢',
      score: 104,
    },
    awayTeam: {
      id: 'team-gsw',
      name: 'Golden State Warriors',
      logo: '🟡',
      score: 98,
    },
    venue: 'TD Garden',
    hasAiSummary: true,
    hasPrediction: true,
    aiSummary: {
      title: 'Celtics Edge Out Warriors in Thrilling Q4 Showcase',
      summary: 'The Boston Celtics secured a narrow victory over the Golden State Warriors in an intense battle at the TD Garden. Jayson Tatum led the Celtics with 34 points, including a crucial stepback three-pointer with 12 seconds remaining. Stephen Curry\'s desperate heave at the buzzer clanged off the back rim, sealing the GSW defeat.',
      keyStats: [
        { label: 'FG %', home: '48.2%', away: '45.1%' },
        { label: '3PT %', home: '38.5%', away: '41.2%' },
        { label: 'Rebounds', home: '45', away: '38' },
        { label: 'Turnovers', home: '12', away: '15' },
      ],
      aiAnalysis: 'Boston exploited Golden State\'s interior defense successfully. The Celtics\' transitional defense limited transition points to just 8, a season-low for GSW. Curry was constantly doubled, creating open looks for other shooters.',
    },
    prediction: {
      homeWinProbability: 64,
      awayWinProbability: 36,
      predictionText: 'Boston Celtics are highly projected to win. Boston has won 85% of home games when favored by 3+ points. Golden State is playing on the second night of a back-to-back, which historically lowers their shooting accuracy by 2.8%.',
      isPremium: false,
    },
  },
  {
    id: 'game-102',
    sport: 'soccer',
    league: 'Champions League',
    status: 'live',
    time: '72\'',
    homeTeam: {
      id: 'team-rma',
      name: 'Real Madrid',
      logo: '⚪',
      score: 2,
    },
    awayTeam: {
      id: 'team-mci',
      name: 'Manchester City',
      logo: '🩵',
      score: 2,
    },
    venue: 'Santiago Bernabéu',
    hasAiSummary: true,
    hasPrediction: true,
    aiSummary: {
      title: 'Real Madrid and Manchester City Exchange Blows in UCL Thriller',
      summary: 'A fast-paced encounter at the Bernabéu sees Real Madrid and Manchester City level at 2-2. Phil Foden opened the scoring with a brilliant curler before Vinicius Jr. scored twice in three minutes to turn the game around. Kevin De Bruyne equalized early in the second half with a trademark rocket from outside the box.',
      keyStats: [
        { label: 'Possession', home: '42%', away: '58%' },
        { label: 'Shots', home: '14', away: '18' },
        { label: 'Pass %', home: '84%', away: '91%' },
        { label: 'Fouls', home: '9', away: '7' },
      ],
      aiAnalysis: 'Manchester City controlled possession in the midfield, but Real Madrid remains lethal on rapid counterattacks. Vinicius Jr is consistently winning 1v1 matchups against City\'s high-line defensive backline.',
    },
    prediction: {
      homeWinProbability: 51,
      awayWinProbability: 49,
      predictionText: 'PREMIUM ANALYTICS: This match is on a knife edge. AI simulations predict a 28% chance of a draw. Real Madrid is favored heavily if it goes to extra time due to home ground advantage, while Man City is favored to score next based on high xG (2.4 vs 1.1).',
      isPremium: true,
    },
  },
  {
    id: 'game-103',
    sport: 'soccer',
    league: 'Premier League',
    status: 'scheduled',
    time: 'Tomorrow, 14:00',
    homeTeam: {
      id: 'team-che',
      name: 'Chelsea',
      logo: '🔵',
    },
    awayTeam: {
      id: 'team-ars',
      name: 'Arsenal',
      logo: '🔴',
    },
    venue: 'Stamford Bridge',
    hasAiSummary: false,
    hasPrediction: true,
    prediction: {
      homeWinProbability: 38,
      awayWinProbability: 62,
      predictionText: 'PREMIUM INSIGHT: Arsenal has won their last 4 away London derbies, keeping clean sheets in 3 of them. Chelsea is undergoing tactical readjustments under their new manager. AI models suggest betting Arsenal Over 1.5 Goals with 74% confidence.',
      isPremium: true,
    },
  },
  {
    id: 'game-104',
    sport: 'football',
    league: 'NFL',
    status: 'completed',
    time: 'Final',
    homeTeam: {
      id: 'team-kc',
      name: 'Kansas City Chiefs',
      logo: '❤️',
      score: 27,
    },
    awayTeam: {
      id: 'team-sf',
      name: 'San Francisco 49ers',
      logo: '🤎',
      score: 24,
    },
    venue: 'Arrowhead Stadium',
    hasAiSummary: true,
    hasPrediction: false,
    aiSummary: {
      title: 'Mahomes Orchestrates Late Drive to Seal Victory',
      summary: 'Patrick Mahomes threw for 312 yards and 2 touchdowns, leading the Chiefs on an 82-yard game-winning drive in the final two minutes. Harrison Butker kicked the game-winning 41-yard field goal with 3 seconds remaining. Brock Purdy threw for 245 yards but was intercepted once in the third quarter.',
      keyStats: [
        { label: 'Total Yards', home: '412', away: '380' },
        { label: 'Rushing', home: '98', away: '142' },
        { label: 'Passing', home: '314', away: '238' },
        { label: 'Turnovers', home: '0', away: '1' },
      ],
      aiAnalysis: 'Chiefs defense came up big in critical third-downs, holding the 49ers to just 3-11 on conversions. Mahomes was pressured on 40% of dropbacks but completed 8 of 10 passes under pressure.',
    },
  },
  {
    id: 'game-105',
    sport: 'baseball',
    league: 'MLB',
    status: 'scheduled',
    time: 'Tonight, 19:10',
    homeTeam: {
      id: 'team-bos-bb',
      name: 'Boston Red Sox',
      logo: '🧦',
    },
    awayTeam: {
      id: 'team-nyy',
      name: 'New York Yankees',
      logo: '🗽',
    },
    venue: 'Fenway Park',
    hasAiSummary: false,
    hasPrediction: true,
    prediction: {
      homeWinProbability: 45,
      awayWinProbability: 55,
      predictionText: 'Yankees starting pitcher is in peak form, boasting a 1.82 ERA in night games. Boston has struggled with left-handed pitching this season (hitting only .224). Safe prediction is NY Yankees on the Moneyline.',
      isPremium: false,
    },
  },
  // FIFA World Cup
  {
    id: 'game-201',
    sport: 'soccer',
    league: 'FIFA World Cup',
    status: 'completed',
    time: 'Final',
    homeTeam: { id: 'team-arg', name: 'Argentina', logo: '🇦🇷', score: 3 },
    awayTeam: { id: 'team-fra', name: 'France', logo: '🇫🇷', score: 1 },
    venue: 'Lusail Stadium',
    hasAiSummary: true,
    hasPrediction: false,
    aiSummary: {
      title: 'Argentina Crowned World Champions in Dramatic Final',
      summary: 'Argentina defeated France 3-1 in a thrilling World Cup final. Lionel Messi scored twice and provided an assist, cementing his legacy as the greatest of all time. France struggled to break through Argentina\'s organized defense.',
      keyStats: [
        { label: 'Possession', home: '47%', away: '53%' },
        { label: 'Shots', home: '12', away: '15' },
        { label: 'Shots on Target', home: '6', away: '4' },
        { label: 'Fouls', home: '14', away: '10' },
      ],
      aiAnalysis: 'Argentina\'s defensive discipline was the cornerstone of their victory. By neutralizing France\'s counter-attacking threat through smart tactical fouls, they controlled the tempo of the match.',
    },
  },
  // La Liga
  {
    id: 'game-202',
    sport: 'soccer',
    league: 'La Liga',
    status: 'live',
    time: '65\'',
    homeTeam: { id: 'team-fcb', name: 'FC Barcelona', logo: '🔵🔴', score: 2 },
    awayTeam: { id: 'team-atm', name: 'Atletico Madrid', logo: '🔴⚪', score: 0 },
    venue: 'Camp Nou',
    hasAiSummary: false,
    hasPrediction: true,
    prediction: {
      homeWinProbability: 72,
      awayWinProbability: 28,
      predictionText: 'Barcelona dominates possession at Camp Nou. Atletico\'s compact defense has held well but Barcelona\'s wing play is creating overloads. Premium simulation suggests 2 more goals in second half.',
      isPremium: true,
    },
  },
  // Serie A
  {
    id: 'game-203',
    sport: 'soccer',
    league: 'Serie A',
    status: 'live',
    time: '80\'',
    homeTeam: { id: 'team-int', name: 'Inter Milan', logo: '🔵⚫', score: 1 },
    awayTeam: { id: 'team-acm', name: 'AC Milan', logo: '🔴⚫', score: 1 },
    venue: 'San Siro',
    hasAiSummary: false,
    hasPrediction: true,
    prediction: {
      homeWinProbability: 35,
      awayWinProbability: 40,
      predictionText: 'Derby della Madonnina is finely poised. Both teams have hit the woodwork. Late substitute impact expected from both benches.',
      isPremium: false,
    },
  },
  // Bundesliga
  {
    id: 'game-204',
    sport: 'soccer',
    league: 'Bundesliga',
    status: 'scheduled',
    time: 'Tomorrow, 18:30',
    homeTeam: { id: 'team-bay', name: 'Bayern Munich', logo: '🔴' },
    awayTeam: { id: 'team-dor', name: 'Borussia Dortmund', logo: '🟡⚫' },
    venue: 'Allianz Arena',
    hasAiSummary: false,
    hasPrediction: true,
    prediction: {
      homeWinProbability: 68,
      awayWinProbability: 32,
      predictionText: 'Bayern\'s home form is impeccable. Der Klassiker promises goals — over 2.5 goals has hit in 8 of last 10 meetings.',
      isPremium: false,
    },
  },
  // NHL
  {
    id: 'game-205',
    sport: 'hockey',
    league: 'NHL',
    status: 'completed',
    time: 'Final',
    homeTeam: { id: 'team-edm', name: 'Edmonton Oilers', logo: '🟠', score: 4 },
    awayTeam: { id: 'team-tor', name: 'Maple Leafs', logo: '🔵', score: 2 },
    venue: 'Rogers Place',
    hasAiSummary: true,
    hasPrediction: false,
    aiSummary: {
      title: 'McDavid Leads Oilers to Victory with 3-Point Night',
      summary: 'Connor McDavid recorded a goal and two assists as the Edmonton Oilers defeated the Toronto Maple Leafs 4-2. Leon Draisaitl added a goal and an assist. The Oilers power play went 2-for-3.',
      keyStats: [
        { label: 'Shots', home: '34', away: '28' },
        { label: 'Faceoff %', home: '56%', away: '44%' },
        { label: 'Hits', home: '22', away: '18' },
        { label: 'PP %', home: '67%', away: '25%' },
      ],
      aiAnalysis: 'Edmonton\'s special teams were the difference. Their aggressive forecheck forced Toronto into turnovers in the neutral zone, generating high-danger chances.',
    },
  },
  // NCAA Football
  {
    id: 'game-206',
    sport: 'college-fb',
    league: 'NCAA Football',
    status: 'completed',
    time: 'Final',
    homeTeam: { id: 'team-mich', name: 'Michigan Wolverines', logo: '💛💙', score: 31 },
    awayTeam: { id: 'team-ohio', name: 'Ohio State Buckeyes', logo: '🟤', score: 24 },
    venue: 'Michigan Stadium',
    hasAiSummary: true,
    hasPrediction: false,
    aiSummary: {
      title: 'Wolverines Upset Buckeyes in Big House Thriller',
      summary: 'Michigan rode a dominant ground game to upset Ohio State 31-24 in front of 110,000 fans. Blake Corum rushed for 145 yards and 2 touchdowns. Ohio State\'s passing attack was held in check by Michigan\'s secondary.',
      keyStats: [
        { label: 'Rush Yards', home: '245', away: '89' },
        { label: 'Pass Yards', home: '167', away: '312' },
        { label: '3rd Down %', home: '62%', away: '38%' },
        { label: 'Time of Poss', home: '36:42', away: '23:18' },
      ],
      aiAnalysis: 'Michigan controlled the clock with their running game, keeping Ohio State\'s explosive offense on the sideline. The defensive line generated consistent pressure without blitzing.',
    },
  },
  // NCAA Basketball
  {
    id: 'game-207',
    sport: 'college-bb',
    league: 'NCAA Basketball',
    status: 'completed',
    time: 'Final',
    homeTeam: { id: 'team-unc', name: 'UNC Tar Heels', logo: '🔵', score: 82 },
    awayTeam: { id: 'team-duke', name: 'Duke Blue Devils', logo: '🔵', score: 79 },
    venue: 'Dean Dome',
    hasAiSummary: true,
    hasPrediction: false,
    aiSummary: {
      title: 'Tar Heels Survive Duke Rivalry Classic',
      summary: 'North Carolina edged out Duke 82-79 in a heated ACC rivalry matchup. RJ Davis poured in 28 points on 10-of-16 shooting. Duke\'s freshman sensation had 22 but missed a potential game-tying three at the buzzer.',
      keyStats: [
        { label: 'FG %', home: '49%', away: '44%' },
        { label: '3PT %', home: '38%', away: '42%' },
        { label: 'Rebounds', home: '38', away: '32' },
        { label: 'Assists', home: '18', away: '14' },
      ],
      aiAnalysis: 'UNC\'s veteran experience showed in crunch time. Their methodical half-court offense created high-percentage looks while Duke settled for contested jump shots.',
    },
  },
  // FIFA Women's World Cup
  {
    id: 'game-208',
    sport: 'soccer',
    league: 'Womens World Cup',
    status: 'scheduled',
    time: 'Jun 19, 21:00',
    homeTeam: { id: 'team-eng', name: 'England', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    awayTeam: { id: 'team-bra', name: 'Brazil', logo: '🇧🇷' },
    venue: 'Wembley Stadium',
    hasAiSummary: false,
    hasPrediction: true,
    prediction: {
      homeWinProbability: 55,
      awayWinProbability: 45,
      predictionText: 'England\'s home advantage at Wembley is significant. Brazil\'s technical ability on the ball could cause problems. Expect an open, entertaining match.',
      isPremium: false,
    },
  },
  // Ligue 1
  {
    id: 'game-209',
    sport: 'soccer',
    league: 'Ligue 1',
    status: 'completed',
    time: 'Final',
    homeTeam: { id: 'team-psg', name: 'PSG', logo: '🔵🔴', score: 3 },
    awayTeam: { id: 'team-ol', name: 'Olympique Lyonnais', logo: '🔵🔴', score: 0 },
    venue: 'Parc des Princes',
    hasAiSummary: true,
    hasPrediction: false,
    aiSummary: {
      title: 'Mbappe Stars as PSG Cruise Past Lyon',
      summary: 'Kylian Mbappe scored twice and assisted another as PSG dominated Lyon 3-0 at the Parc des Princes. PSG\'s pressing game forced Lyon into numerous defensive errors.',
      keyStats: [
        { label: 'Possession', home: '62%', away: '38%' },
        { label: 'Shots', home: '18', away: '6' },
        { label: 'Pass %', home: '89%', away: '76%' },
        { label: 'Tackles', home: '15', away: '22' },
      ],
      aiAnalysis: 'PSG\'s front three was unplayable. Lyon\'s defensive shape collapsed after the first goal, leaving massive spaces for Mbappe to exploit in transition.',
    },
  },
  // MLS
  {
    id: 'game-210',
    sport: 'soccer',
    league: 'MLS',
    status: 'live',
    time: '75\'',
    homeTeam: { id: 'team-lafc', name: 'LAFC', logo: '🖤', score: 2 },
    awayTeam: { id: 'team-nyr', name: 'NY Red Bulls', logo: '🔴', score: 1 },
    venue: 'BMO Stadium',
    hasAiSummary: false,
    hasPrediction: true,
    prediction: {
      homeWinProbability: 78,
      awayWinProbability: 22,
      predictionText: 'LAFC dominating possession. Red Bulls need to push forward but risk conceding on the counter. Premium data suggests LAFC to score again before full time.',
      isPremium: true,
    },
  },
];

export const initialNews: NewsArticle[] = [
  {
    id: 'news-201',
    title: 'Kylian Mbappé Completes Historic Real Madrid Transfer',
    summary: 'Kylian Mbappé has officially joined Real Madrid on a free transfer, signing a five-year deal. The French superstar joins an already star-studded lineup featuring Vinicius Jr. and Jude Bellingham, creating one of the most formidable attack lines in football history. Shop official merchandise to support.',
    sport: 'soccer',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop',
    publishedAt: '2026-06-17T12:00:00Z',
    source: 'ScoreVerse AI News',
    affiliateLink: {
      text: 'Shop official Real Madrid jerseys at Fanatics',
      url: 'https://www.fanatics.com/international-clubs/real-madrid/o-42215754+z-926941-2679805908',
    },
  },
  {
    id: 'news-202',
    title: 'How AI Predictions are Revolutionizing Sports Betting and Analysis',
    summary: 'Machine learning algorithms are now analyzing over 10,000 data points per second, including player fatigue, weather, stadium acoustics, and historic metrics to provide real-time betting win probabilities. Users using ScoreVerse Premium have seen a 14% increase in prediction accuracy compared to traditional betting sites.',
    sport: 'basketball',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop',
    publishedAt: '2026-06-17T10:30:00Z',
    source: 'ScoreVerse AI Tech Blog',
  },
  {
    id: 'news-203',
    title: 'NBA Finals MVP Odds: Jayson Tatum Takes Lead After Game 4 Masterclass',
    summary: 'Jayson Tatum scored 34 points and grabbed 11 rebounds to put Boston Celtics one win away from their next NBA Championship. The betting oddmakers have heavily shifted Tatum (-180) ahead of Jaylen Brown (+150) for the prestigious Finals MVP honors. Boston fans can celebrate with the latest gear.',
    sport: 'basketball',
    imageUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&h=400&fit=crop',
    publishedAt: '2026-06-16T22:45:00Z',
    source: 'ScoreVerse AI Analytics',
    affiliateLink: {
      text: 'Shop Boston Celtics Finals Merch (15% Off)',
      url: 'https://store.nba.com/boston-celtics',
    },
  },
  {
    id: 'news-204',
    title: 'Connor McDavid Promises Comeback in Stanley Cup Finals Game 5',
    summary: 'Edmonton Oilers captain Connor McDavid remained confident during his press conference despite being down 3-1 against the Florida Panthers. McDavid emphasized defensive structure and capitalize on power plays as the keys to initiating an historic series comeback.',
    sport: 'hockey',
    imageUrl: 'https://images.unsplash.com/photo-1580748141549-71748d60bdc9?w=600&h=400&fit=crop',
    publishedAt: '2026-06-16T18:15:00Z',
    source: 'ScoreVerse AI News',
  },
];

export const initialChannels: CommunityChannel[] = [
  {
    id: 'chan-nba',
    name: '🏀 NBA Fan Hub',
    description: 'General discussions about the NBA, drafts, and matchups',
    sport: 'basketball',
    memberCount: 1420,
  },
  {
    id: 'chan-ucl',
    name: '⚽ Champions League Banter',
    description: 'Weekly UCL matches, transfers, and tactical debates',
    sport: 'soccer',
    memberCount: 1850,
  },
  {
    id: 'chan-nfl',
    name: '🏈 NFL Redzone Chat',
    description: 'Sunday matchups, fantasy football, and touchdowns',
    sport: 'football',
    memberCount: 920,
  },
  {
    id: 'chan-premium',
    name: '👑 Premium Betting Lounge',
    description: 'Unlocked for Premium tier! High-confidence AI picks and locks.',
    sport: 'all',
    memberCount: 340,
  },
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-501',
    channelId: 'chan-nba',
    user: {
      name: 'SlamDunk99',
      isPremium: true,
      avatar: '🐱',
    },
    text: 'Tatum is definitely the MVP frontrunner this season! His stepback in Q4 was insane.',
    timestamp: '18:05',
  },
  {
    id: 'msg-502',
    channelId: 'chan-nba',
    user: {
      name: 'CurryChef',
      isPremium: false,
      avatar: '🦊',
    },
    text: 'Celtics got lucky. Steph was fouled on that three-pointer attempt with 30s left, but no call!',
    timestamp: '18:07',
  },
  {
    id: 'msg-503',
    channelId: 'chan-ucl',
    user: {
      name: 'Madridista_Vini',
      isPremium: true,
      avatar: '🦁',
    },
    text: 'Santiago Bernabéu was electric tonight! Vinicius Jr. is simply unstoppable in the Champions League.',
    timestamp: '19:42',
  },
  {
    id: 'msg-504',
    channelId: 'chan-ucl',
    user: {
      name: 'SkyBluePep',
      isPremium: false,
      avatar: '🐼',
    },
    text: 'City controls the tie. Bernabéu is tough, but we will finish them at the Etihad easily.',
    timestamp: '19:45',
  },
  {
    id: 'msg-505',
    channelId: 'chan-premium',
    user: {
      name: 'AI_InsightBot',
      isPremium: true,
      avatar: '🤖',
    },
    text: '🔒 PREMIUM ALERT: Arsenal Win & Over 1.5 Goals vs Chelsea tomorrow is highly simulated. Arsenal is in stellar defensive shape.',
    timestamp: '20:00',
  },
];

export const initialPolls: Poll[] = [
  {
    id: 'poll-1',
    question: 'Who will win the NBA Finals Championship?',
    options: [
      { text: 'Boston Celtics', votes: 1420 },
      { text: 'Golden State Warriors', votes: 850 },
    ],
    totalVotes: 2270,
  },
  {
    id: 'poll-2',
    question: 'Who should win the 2026 Ballon d\'Or?',
    options: [
      { text: 'Vinicius Jr.', votes: 940 },
      { text: 'Jude Bellingham', votes: 720 },
      { text: 'Kylian Mbappé', votes: 530 },
      { text: 'Phil Foden', votes: 310 },
    ],
    totalVotes: 2500,
  },
];
