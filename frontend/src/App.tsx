import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, Sparkles, Search, Bell, Send, Lock, 
  ExternalLink, ArrowRight, TrendingUp, X, 
  Flame, Activity, HelpCircle, Check, Filter, CheckCircle
} from 'lucide-react';

// Reusable components
import { PremiumBadge } from './components/PremiumBadge';
import { TabBar } from './components/TabBar';
import { GameCard } from './components/GameCard';
import { NewsCard } from './components/NewsCard';
import { SportFilter } from './components/SportFilter';
import { ChannelCard } from './components/ChannelCard';
import { ChatMessage } from './components/ChatMessage';
import { PollWidget } from './components/PollWidget';
import { AdBanner } from './components/AdBanner';
import { GameCenter } from './components/GameCenter';
import { LeagueStandings } from './components/LeagueStandings';
import { VideoHighlights } from './components/VideoHighlights';
import { ScoreTicker } from './components/ScoreTicker';
import { TopNav } from './components/TopNav';

// Mock data & types
import type { Match, NewsArticle, Poll, CommunityChannel } from './mockData';
import type { ChatMessage as ChatMessageType } from './mockData';
import { 
  initialMatches, initialNews, initialChannels, 
  initialMessages, initialPolls
} from './mockData';

function App() {
  // Navigation & Core States
  const [activeTab, setActiveTab] = useState<'home' | 'scores' | 'news' | 'community' | 'profile'>('home');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // Custom mock interactive states
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [channels, setChannels] = useState<CommunityChannel[]>(initialChannels);
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  
  // Filtering & Search
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // User Profile Preferences (Simulated personalized database)
  const [favSports, setFavoritesSports] = useState<string[]>(['soccer', 'basketball']);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [personalizedMode, setPersonalizedMode] = useState<boolean>(true);

  // Modals & Detail Overlays
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState<boolean>(false);

  // AI dynamic loading simulation
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiLoadingText, setAiLoadingText] = useState<string>('');
  const [aiGeneratedResult, setAiGeneratedResult] = useState<boolean>(false);

  // Community State
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-nba');
  const [chatInput, setChatInput] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Standings & Videos State
  const [standings, setStandings] = useState<any>({});
  const [videos, setVideos] = useState<any[]>([]);
  const [activeStandingLeague, setActiveStandingLeague] = useState<string>('epl');

  // API Integration Functions
  const fetchScores = async (sportFilter: string) => {
    try {
      const url = sportFilter === 'all' ? '/api/scores' : `/api/scores?sport=${sportFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error('Error fetching scores:', err);
    }
  };

  const fetchNews = async (sportFilter: string) => {
    try {
      const url = sportFilter === 'all' ? '/api/news' : `/api/news?sport=${sportFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/community/channels');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setChannels(data);
        }
      }
    } catch (err) {
      console.error('Error fetching channels:', err);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const res = await fetch(`/api/community/channels/${channelId}/messages`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((m: any) => ({
          id: m.id,
          channelId: m.channelId,
          user: {
            name: m.user?.name || m.user_name || 'User',
            isPremium: m.user?.isPremium || false,
            avatar: m.user?.isPremium ? '👑' : '😎'
          },
          text: m.text,
          timestamp: m.timestamp ? new Date(m.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }) : new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
        }));
        setMessages(mapped);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessageToApi = async (channelId: string, text: string) => {
    try {
      const res = await fetch(`/api/community/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        await fetchMessages(channelId);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setIsPremium(data.isPremium);
        if (data.favorites?.sports) {
          setFavoritesSports(data.favorites.sports);
        }
        setNotificationsEnabled(data.notificationsEnabled);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'premium_monthly' })
      });
      if (res.ok) {
        triggerPremiumUpgrade();
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      triggerPremiumUpgrade();
    }
  };

  const fetchStandingsData = async () => {
    try {
      const res = await fetch('/api/standings');
      if (res.ok) {
        const data = await res.json();
        setStandings(data);
      }
    } catch (err) {
      console.error('Error fetching standings:', err);
    }
  };

  const fetchVideosData = async (sport: string) => {
    try {
      const url = sport === 'all' ? '/api/videos' : `/api/videos?sport=${sport}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const handleSelectMatch = async (match: Match) => {
    setSelectedMatch(match);
    
    // Fetch summary
    try {
      const summaryRes = await fetch(`/api/scores/${match.id}/summary`);
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        if (summaryData.summary && summaryData.summary !== 'AI summary not yet generated for this game.') {
          setSelectedMatch(prev => prev && prev.id === match.id ? {
            ...prev,
            hasAiSummary: true,
            aiSummary: {
              title: summaryData.title || `AI Game Recap: ${match.homeTeam.name} vs ${match.awayTeam.name}`,
              summary: summaryData.summary,
              keyStats: summaryData.keyStats && summaryData.keyStats.length > 0 ? summaryData.keyStats : [
                { label: 'xG (Expected Goals)', home: '1.45', away: '1.20' },
                { label: 'Attacking Entries', home: '38', away: '32' }
              ],
              aiAnalysis: summaryData.aiAnalysis || 'The AI model suggests solid defensive transitions for both teams.'
            }
          } : prev);
        }
      }
    } catch (err) {
      console.error('Error fetching match summary:', err);
    }

    // Fetch prediction
    try {
      const predRes = await fetch(`/api/scores/${match.id}/prediction`);
      if (predRes.ok) {
        const predData = await predRes.json();
        setSelectedMatch(prev => prev && prev.id === match.id ? {
          ...prev,
          prediction: {
            homeWinProbability: predData.homeWinProbability,
            awayWinProbability: predData.awayWinProbability,
            predictionText: predData.predictionText,
            isPremium: predData.isPremium
          }
        } : prev);
      }
    } catch (err) {
      console.error('Error fetching match prediction:', err);
    }
  };

  // Fetch initial data on mount
  useEffect(() => {
    fetchUserProfile();
    fetchChannels();
    fetchScores('all');
    fetchNews('all');
    fetchStandingsData();
    fetchVideosData('all');
  }, []);

  // Fetch scores and news on selectedSport change
  useEffect(() => {
    fetchScores(selectedSport);
    fetchNews(selectedSport);
  }, [selectedSport]);

  // Fetch messages on activeChannelId change
  useEffect(() => {
    fetchMessages(activeChannelId);
  }, [activeChannelId]);

  // Poll scores and messages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchScores(selectedSport);
      if (activeTab === 'community') {
        fetchMessages(activeChannelId);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedSport, activeChannelId, activeTab]);

  // Auto-scroll community chats
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeChannelId, activeTab]);

  // Upgrade success simulation
  const triggerPremiumUpgrade = () => {
    setIsPremium(true);
    setShowUpgradeModal(false);
    setShowSuccessOverlay(true);
    // Automatically join the VIP lounge
    setActiveChannelId('chan-premium');
  };

  // Downgrade for testing purposes
  const triggerPremiumDowngrade = () => {
    setIsPremium(false);
    setActiveChannelId('chan-nba');
  };

  // Cast vote on polls
  const handleVote = (pollId: string, optionIndex: number) => {
    setPolls(prevPolls => 
      prevPolls.map(p => {
        if (p.id !== pollId) return p;
        if (p.userVotedIndex !== undefined) return p; // Already voted

        const newOptions = p.options.map((opt, oIdx) => {
          if (oIdx === optionIndex) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });

        return {
          ...p,
          options: newOptions,
          totalVotes: p.totalVotes + 1,
          userVotedIndex: optionIndex
        };
      })
    );
  };

  // Submit community message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const text = chatInput;
    setChatInput('');

    // Optimistic local update
    const tempMsg: ChatMessageType = {
      id: `temp-${Date.now()}`,
      channelId: activeChannelId,
      user: {
        name: 'DemoFan',
        isPremium: isPremium,
        avatar: isPremium ? '👑' : '😎',
      },
      text: text,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      await sendMessageToApi(activeChannelId, text);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Simulate AI generated Summary
  const handleAiGeneration = (matchId: string) => {
    setAiGenerating(true);
    setAiGeneratedResult(false);
    
    const loadingSteps = [
      'Retrieving match telemetry and physical tracking data...',
      'Aggregating coach press conferences and live statistics...',
      'Synthesizing key plays, referee notes, and tactical shifts...',
      'Constructing neutral, highly analytical Game Recap...'
    ];

    let currentStep = 0;
    setAiLoadingText(loadingSteps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < loadingSteps.length) {
        setAiLoadingText(loadingSteps[currentStep]);
      } else {
        clearInterval(interval);
        // Generation finished
        setMatches(prev => prev.map(m => {
          if (m.id === matchId) {
            return {
              ...m,
              hasAiSummary: true,
              aiSummary: {
                title: `AI Game Analysis: ${m.homeTeam.name} vs ${m.awayTeam.name}`,
                summary: `This is a live AI-generated summary. The game between ${m.homeTeam.name} and ${m.awayTeam.name} saw unprecedented tactical positioning. Key spaces were exploited on the flanks, forcing both managers into early substitutions. Final possession and xG indicators heavily reflect the overall match outcomes.`,
                keyStats: [
                  { label: 'xG (Expected Goals)', home: '1.82', away: '1.14' },
                  { label: 'Attacking Third Entries', home: '45', away: '28' },
                  { label: 'Successful Tackles', home: '14', away: '18' },
                  { label: 'Interceptions', home: '11', away: '9' }
                ],
                aiAnalysis: 'The AI model suggests that the defensive block played by the home team was highly effective in sealing transition vectors. Expect tactical carryover into the next fixtures.'
              }
            };
          }
          return m;
        }));
        setAiGenerating(false);
        setAiGeneratedResult(true);
      }
    }, 900);
  };

  // Update favorites list
  const toggleFavSport = (sport: string) => {
    setFavoritesSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  // Search filter matches/news
  const filteredMatches = matches.filter(m => {
    const matchesSearch = searchQuery 
      ? m.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.league.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesSport = selectedSport === 'all' 
      ? true 
      : m.sport === selectedSport;

    return matchesSearch && matchesSport;
  });

  const filteredNews = news.filter(n => {
    const matchesSearch = searchQuery
      ? n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.summary.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesSport = selectedSport === 'all'
      ? true
      : n.sport === selectedSport;

    return matchesSearch && matchesSport;
  });

  // Hot Highlight for Home Tab
  const topLiveMatch = matches.find(m => m.status === 'live');
  const highlightedNews = news[0];

  return (
    <div className="min-h-screen text-gray-100 flex justify-center selection:bg-emerald-500 selection:text-black bg-[#0a0a0f]">
      {/* Mobile-first frame simulating an app on desktop */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative pb-20 overflow-hidden">
        
        {/* Top Header - Glass */}
        <header className="sticky top-0 z-40 glass-strong border-b border-white/5 px-4 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black gradient-text tracking-tight">
              ScoreVerse
            </span>
            {isPremium && <PremiumBadge size="sm" />}
          </div>

          <div className="flex items-center gap-2">
            {!isPremium ? (
              <button 
                onClick={() => setActiveTab('profile')} 
                className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase transition-all duration-200 glow-gold"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-500" />
                Go Gold
              </button>
            ) : (
              <button 
                onClick={() => setActiveTab('profile')}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400"
              >
                <Crown className="w-4 h-4 fill-amber-500" />
              </button>
            )}

            <button className="relative w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors">
              <Bell className="w-4 h-4" />
              {notificationsEnabled && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0a0a0f] animate-ping" />
              )}
            </button>
          </div>
        </header>

        {/* Score Ticker - ESPN style */}
        <ScoreTicker matches={matches} onSelectMatch={handleSelectMatch} />

        {/* Top Nav - ESPN style */}
        <TopNav activeSport={selectedSport} onSelectSport={(s) => setSelectedSport(s)} isPremium={isPremium} />

        {/* Global Search Bar (Only shown on relevant tabs) */}
        {(activeTab === 'scores' || activeTab === 'news') && (
          <div className="px-4 pt-3 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/60 border border-neutral-800 text-sm pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-emerald-500 text-neutral-200 transition-colors"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Feed Container */}
        <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col no-scrollbar">
          
          {/* ==================== HOME TAB ==================== */}
          {activeTab === 'home' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              {/* Hero Spotlight - Vibrant */}
              <div className="gradient-border overflow-hidden">
                <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950 to-blue-950/40 rounded-2xl p-5 relative shadow-xl">
                {/* Visual elements */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.04] select-none pointer-events-none text-9xl scale-150">📊</div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Predictive Hub
                  </span>
                  <h2 className="text-xl font-black text-white leading-tight mb-1.5">
                    Your Complete Sports<br />AI Assistant.
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-[90%] mb-4">
                    Replacing manual search, analysis, and betting confusion with real-time AI summaries and locks.
                  </p>
                  <button 
                    onClick={() => setActiveTab('scores')}
                    className={`inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl text-black transition-all active:scale-95 ${
                      isPremium 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/20 glow-gold' 
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/20 glow-green'
                    }`}
                  >
                    Explore Predictions
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              </div>

              {/* Personalized Feed Banner */}
              <div className="flex justify-between items-center text-xs text-neutral-400 px-1 border-b border-neutral-900 pb-2">
                <span>Personalized Feed: <strong className="text-white">{favSports.join(', ')}</strong></span>
                <button 
                  onClick={() => {
                    setPersonalizedMode(!personalizedMode);
                  }}
                  className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold transition-all ${
                    personalizedMode 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                  }`}
                >
                  {personalizedMode ? 'Custom active' : 'Showing all'}
                </button>
              </div>

              {/* Live Game Spotlight */}
              {topLiveMatch && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5 px-1">
                    <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                    Blinking Live Matchup
                  </h3>
                  <GameCard 
                    match={topLiveMatch} 
                    onClick={() => handleSelectMatch(topLiveMatch)} 
                    isPremium={isPremium} 
                  />
                </div>
              )}

              {/* AI Prediction Spotlight (Premium promotion or reveal) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5 px-1">
                  <Flame className="w-4 h-4 text-amber-500" />
                  AI Prediction Spotlight
                </h3>
                <div 
                  onClick={() => {
                    const sampleMatch = matches.find(m => m.id === 'game-102') || matches[0];
                    handleSelectMatch(sampleMatch);
                  }}
                  className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 cursor-pointer hover:border-neutral-700/60 transition-all shadow-md group relative overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                      UCL Big Lock
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">Tonight</span>
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors mb-2">
                    Real Madrid vs Manchester City Probability Spotlight
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-3 line-clamp-2">
                    Real Madrid faces off against Pep Guardiola\'s side in an epic battle. See high-confidence winner projections and key score stats.
                  </p>
                  
                  {/* Blurry premium spotlight teaser */}
                  {!isPremium ? (
                    <div className="bg-neutral-900/90 border border-amber-500/10 rounded-lg p-3 text-center flex flex-col items-center">
                      <Lock className="w-4 h-4 text-amber-500 mb-1" />
                      <span className="text-[11px] font-bold text-neutral-200">AI Win Probability & betting line locked</span>
                      <span className="text-[9px] text-amber-400 mt-0.5 uppercase font-bold tracking-wider">Upgrade to Gold to unlock</span>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-amber-950/20 to-neutral-900 border border-amber-500/20 rounded-lg p-3 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        AI Prediction Available!
                      </div>
                      <span className="text-xs font-bold text-neutral-200">Tap Card to Unlock</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fast affiliate actions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 px-1">
                  ⚡ Fan Quick Zone
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setActiveTab('community');
                      setActiveChannelId('chan-ucl');
                    }}
                    className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all text-left flex flex-col justify-between h-24 shadow-md active:scale-98"
                  >
                    <span className="text-lg">💬</span>
                    <span className="text-xs font-bold text-neutral-200 leading-tight">Join Real vs City Live Fan Room</span>
                  </button>
                  <a 
                    href="https://store.realmadrid.com"
                    target="_blank"
                    className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all text-left flex flex-col justify-between h-24 shadow-md active:scale-98"
                  >
                    <span className="text-lg">👕</span>
                    <span className="text-xs font-bold text-neutral-200 leading-tight">Get Real Madrid Mbappe Shirts</span>
                  </a>
                </div>
              </div>

              {/* Ad Banner */}
              {!isPremium && <AdBanner size="medium" />}

              {/* Curated Sports News */}
              <div>
                <div className="flex justify-between items-center mb-2.5 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Latest Curated Flash
                  </h3>
                  <button onClick={() => setActiveTab('news')} className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase">
                    All News
                  </button>
                </div>
                {highlightedNews && (
                  <NewsCard 
                    article={highlightedNews} 
                    onClick={() => setSelectedArticle(highlightedNews)} 
                    isPremium={isPremium} 
                  />
                )}
              </div>
            </div>
          )}


          {/* ==================== SCORES TAB ==================== */}
          {activeTab === 'scores' && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <SportFilter 
                selectedSport={selectedSport} 
                setSelectedSport={setSelectedSport} 
                isPremium={isPremium} 
              />
              
              <div className="flex justify-between items-center text-xs text-neutral-500 py-1.5 px-1">
                <span>Showing {filteredMatches.length} matchups</span>
                {selectedSport !== 'all' && (
                  <button onClick={() => setSelectedSport('all')} className="text-[10px] text-emerald-400 font-bold uppercase">
                    Reset Filter
                  </button>
                )}
              </div>

              {filteredMatches.length > 0 ? (
                filteredMatches.map((match, idx) => (
                  <React.Fragment key={match.id}>
                    <GameCard 
                      match={match} 
                      onClick={() => handleSelectMatch(match)} 
                      isPremium={isPremium} 
                    />
                    {idx > 0 && idx % 3 === 0 && (
                      <div className="my-1">
                        <AdBanner size="small" sport={match.sport} />
                      </div>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-16 text-neutral-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
                  <p className="font-semibold text-sm">No matching matchups found</p>
                  <p className="text-xs mt-1">Try another sport category or search filter</p>
                </div>
              )}

              {/* League Standings */}
              {selectedSport === 'all' && Object.keys(standings).length > 0 && (
                <div className="mt-4">
                  <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
                    {['epl', 'laliga', 'seriea', 'bundesliga', 'ligue1', 'nba', 'nfl', 'mlb', 'nhl'].map(league => (
                      <button key={league} onClick={() => setActiveStandingLeague(league)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 ${
                          activeStandingLeague === league ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10'
                        }`}>{league.toUpperCase()}</button>
                    ))}
                  </div>
                  {standings[activeStandingLeague] && <LeagueStandings league={activeStandingLeague} standings={standings[activeStandingLeague]} />}
                </div>
              )}

              {/* Video Highlights */}
              {videos.length > 0 && (
                <div className="mt-6">
                  <VideoHighlights videos={videos} />
                </div>
              )}
            </div>
          )}

          {/* ==================== NEWS TAB ==================== */}
          {activeTab === 'news' && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <SportFilter 
                selectedSport={selectedSport} 
                setSelectedSport={setSelectedSport} 
                isPremium={isPremium} 
              />

              <div className="flex justify-between items-center text-xs text-neutral-500 py-1.5 px-1">
                <span>Curated sport aggregation ({filteredNews.length})</span>
              </div>

              {filteredNews.length > 0 ? (
                filteredNews.map((article, idx) => (
                  <React.Fragment key={article.id}>
                    <NewsCard 
                      article={article} 
                      onClick={() => setSelectedArticle(article)} 
                      isPremium={isPremium} 
                    />
                    {idx > 0 && idx % 2 === 0 && !isPremium && (
                      <AdBanner size="small" sport={article.sport} />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-16 text-neutral-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-neutral-700" />
                  <p className="font-semibold text-sm">No news articles found</p>
                  <p className="text-xs mt-1">Try another search or sport channel</p>
                </div>
              )}
            </div>
          )}


          {/* ==================== COMMUNITY TAB ==================== */}
          {activeTab === 'community' && (
            <div className="flex flex-col gap-4 animate-fade-in max-h-full">
              {/* Vertical Group list */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5 px-1">
                  Fan Hub Group Channels
                </h3>
                <div className="flex flex-col gap-1">
                  {channels.map(channel => (
                    <ChannelCard 
                      key={channel.id} 
                      channel={channel} 
                      isSelected={activeChannelId === channel.id} 
                      onClick={() => setActiveChannelId(channel.id)} 
                      isPremiumUser={isPremium} 
                    />
                  ))}
                </div>
              </div>

              {/* Selected Channel Chat Area */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-[350px] shadow-lg">
                {/* Channel Header */}
                <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2.5 flex justify-between items-center">
                  <div className="truncate">
                    <h4 className="font-bold text-xs md:text-sm text-white truncate">
                      {channels.find(c => c.id === activeChannelId)?.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 truncate max-w-full">
                      {channels.find(c => c.id === activeChannelId)?.description}
                    </p>
                  </div>
                </div>

                {/* VIP Blocker for Premium Betting channel */}
                {activeChannelId === 'chan-premium' && !isPremium ? (
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-neutral-950/80 backdrop-blur-sm z-10">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-3 shadow-md shadow-amber-500/10">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h5 className="font-extrabold text-sm text-white uppercase tracking-wider mb-1.5">
                      Premium Lock Lounge
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-[85%] mb-4">
                      Join our elite lounge of sports analysts. Standard accounts cannot view or post premium betting tips.
                    </p>
                    <button 
                      onClick={handleSubscribe}
                      className="bg-amber-500 text-black text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all active:scale-95 shadow-md shadow-amber-500/20 inline-flex items-center gap-1.5"
                    >
                      <Crown className="w-4 h-4 fill-black" />
                      Get Gold Access
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                      {messages.filter(m => m.channelId === activeChannelId).length > 0 ? (
                        messages.filter(m => m.channelId === activeChannelId).map(message => (
                          <ChatMessage 
                            key={message.id} 
                            message={message} 
                            isCurrentUser={message.user.name === 'DemoFan'} 
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 text-neutral-600 italic text-xs">
                          No messages in this chat. Start the banter!
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat input box */}
                    <form onSubmit={handleSendMessage} className="bg-neutral-900 border-t border-neutral-800 p-2 flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Say something to fellow fans..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all shrink-0 ${
                          chatInput.trim()
                            ? isPremium
                              ? 'bg-amber-500 text-black hover:bg-amber-400'
                              : 'bg-emerald-500 text-black hover:bg-emerald-400'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Fan Poll widgets */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5 px-1">
                  Trending Community Polls
                </h3>
                {polls.map(poll => (
                  <PollWidget 
                    key={poll.id} 
                    poll={poll} 
                    onVote={(idx) => handleVote(poll.id, idx)} 
                    isPremium={isPremium} 
                  />
                ))}
              </div>
            </div>
          )}


          {/* ==================== PROFILE TAB ==================== */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-4 animate-fade-in pb-4">
              {/* Profile Card */}
              <div className="bg-slate-900/60 border border-neutral-800 rounded-2xl p-5 shadow-lg flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center text-3xl shadow-md shrink-0 ${
                  isPremium ? 'bg-amber-950 border-amber-500' : 'bg-neutral-800 border-neutral-700'
                }`}>
                  {isPremium ? '👑' : '😎'}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-base truncate">DemoFan_99</span>
                    {isPremium && <PremiumBadge size="sm" />}
                  </div>
                  <span className="text-xs text-neutral-400 block mt-0.5 truncate">Joined June 2026</span>
                </div>
              </div>

              {/* Personalized Sports Interests */}
              <div className="bg-slate-900/60 border border-neutral-800 rounded-2xl p-4 shadow-lg">
                <h3 className="font-bold text-xs md:text-sm text-white uppercase tracking-wider mb-3 pb-2 border-b border-neutral-800/80">
                  Sport Interests (Personalization)
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {['soccer', 'basketball', 'football', 'baseball', 'hockey'].map(sport => {
                    const isSelected = favSports.includes(sport);
                    return (
                      <button
                        key={sport}
                        onClick={() => toggleFavSport(sport)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all duration-200 ${
                          isSelected
                            ? isPremium
                              ? 'bg-amber-950/20 border-amber-500 text-amber-400 shadow-md shadow-amber-500/5'
                              : 'bg-emerald-950/20 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5'
                            : 'bg-neutral-900/30 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                        }`}
                      >
                        <span>{sport}</span>
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isPremium
                              ? 'bg-amber-500 border-amber-500 text-black'
                              : 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-neutral-700'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-neutral-500 leading-snug mt-3">
                  Checkboxes personalize your Home recommendations stream in real-time. Try toggling and see App reflect it!
                </p>
              </div>

              {/* Followed Teams mock widget */}
              <div className="bg-slate-900/60 border border-neutral-800 rounded-2xl p-4 shadow-lg">
                <h3 className="font-bold text-xs md:text-sm text-white uppercase tracking-wider mb-2.5 pb-2 border-b border-neutral-800/80">
                  Followed Teams
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {['Real Madrid ⚪', 'Boston Celtics 🟢', 'Chelsea 🔵', 'Arsenal 🔴'].map(t => (
                    <span key={t} className="bg-neutral-800/80 border border-neutral-800 text-neutral-300 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="bg-slate-900/60 border border-neutral-800 rounded-2xl p-4 shadow-lg flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xs md:text-sm text-white uppercase tracking-wider">
                    Push Notifications
                  </h3>
                  <p className="text-[10px] text-neutral-400">Score & AI summary notifications</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${
                    notificationsEnabled 
                      ? isPremium 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500' 
                      : 'bg-neutral-800'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-black shadow-md transition-transform transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Premium Gold Promotion / Premium Control Panel */}
              {!isPremium ? (
                <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/20 border-2 border-amber-500 rounded-2xl p-5 shadow-xl shadow-amber-500/10 text-center relative overflow-hidden">
                  <Crown className="w-10 h-10 text-amber-500 mx-auto mb-3.5 fill-amber-500/15 animate-bounce" />
                  <h3 className="font-black text-base text-white tracking-wide uppercase mb-1">
                    ScoreVerse Gold Account
                  </h3>
                  <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-full uppercase tracking-widest inline-block border border-amber-500/20 mb-3">
                    Premium Pro Tier
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4 max-w-[90%] mx-auto">
                    Unlock advanced high-confidence AI predictions, premium analytics models, betting insights, VIP lounge chat, and 100% ad-free experience.
                  </p>
                  <div className="text-sm font-black text-white mb-4">
                    Only <span className="text-amber-400 font-extrabold text-base">$4.99</span>/mo
                  </div>
                  <button 
                    onClick={handleSubscribe}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black py-3 rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all active:scale-[0.98] shadow-md shadow-amber-500/30"
                  >
                    Upgrade to Gold Account
                  </button>
                </div>
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md text-center">
                  <Crown className="w-8 h-8 text-amber-500 mx-auto mb-2 fill-amber-500" />
                  <h3 className="font-bold text-sm text-white tracking-wide uppercase">
                    You are a Gold Member
                  </h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mb-4">
                    All high-confidence AI predictions, premium analytics, and VIP group forums are unlocked!
                  </p>
                  <button 
                    onClick={() => triggerPremiumDowngrade()}
                    className="text-xs text-red-500 font-semibold border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 transition-all px-4 py-1.5 rounded-xl uppercase"
                  >
                    Downgrade for Testing
                  </button>
                </div>
              )}
            </div>
          )}

        </main>

        {/* Bottom Tab Bar Component */}
        <TabBar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSearchQuery(''); // Reset search when switching tabs
          }} 
          isPremium={isPremium} 
        />


        {/* ==================== MATCH DETAILS MODAL ==================== */}
        {selectedMatch && (
          <div className="absolute inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl flex flex-col animate-fade-in">
            {/* Modal Header - Glass */}
            <div className="glass-strong px-4 py-3 flex justify-between items-center border-b border-white/5">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                {selectedMatch.league} Matchup
              </span>
              <button 
                onClick={() => {
                  setSelectedMatch(null);
                  setAiGeneratedResult(false);
                }} 
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Feed */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
              
              {/* Core Scorecard - Glass */}
              <div className="glass rounded-2xl p-5 text-center gradient-border">
                <div className="text-[10px] text-neutral-500 font-semibold mb-3">{selectedMatch.venue}</div>
                <div className="grid grid-cols-3 items-center">
                  {/* Home */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-4xl drop-shadow-xl">{selectedMatch.homeTeam.logo}</span>
                    <span className="font-bold text-xs text-neutral-200 mt-1">{selectedMatch.homeTeam.name}</span>
                  </div>
                  {/* Score or vs */}
                  <div className="flex flex-col items-center gap-1.5">
                    {selectedMatch.status === 'scheduled' ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        {selectedMatch.time}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-2xl ${selectedMatch.status === 'live' ? 'score-live text-emerald-400' : 'text-white'}`}>{selectedMatch.homeTeam.score}</span>
                        <span className="text-neutral-500 font-bold">-</span>
                        <span className={`font-black text-2xl ${selectedMatch.status === 'live' ? 'score-live text-emerald-400' : 'text-white'}`}>{selectedMatch.awayTeam.score}</span>
                      </div>
                    )}
                    <span className={`text-[9px] uppercase font-bold tracking-wider ${
                      selectedMatch.status === 'live' ? 'text-emerald-400' : 'text-neutral-500'
                    }`}>
                      {selectedMatch.status === 'live' ? '● Live' : selectedMatch.status}
                    </span>
                  </div>
                  {/* Away */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-4xl drop-shadow-xl">{selectedMatch.awayTeam.logo}</span>
                    <span className="font-bold text-xs text-neutral-200 mt-1">{selectedMatch.awayTeam.name}</span>
                  </div>
                </div>
              </div>

              {/* Live Game Center */}
              <GameCenter
                sport={selectedMatch.sport}
                league={selectedMatch.league}
                homeTeam={selectedMatch.homeTeam.name}
                awayTeam={selectedMatch.awayTeam.name}
                homeScore={selectedMatch.homeTeam.score ?? null}
                awayScore={selectedMatch.awayTeam.score ?? null}
                status={selectedMatch.status}
                homeWinProb={selectedMatch.prediction?.homeWinProbability}
                awayWinProb={selectedMatch.prediction?.awayWinProbability}
                isPremium={isPremium}
              />

              {/* AI Win Probability Dial */}
              {selectedMatch.prediction && (
                <div className="bg-slate-900/60 border border-neutral-800 p-4 rounded-2xl shadow-md">
                  <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    AI Win Probability
                  </h4>
                  <div className="flex justify-between text-xs text-neutral-300 font-bold mb-1 px-1">
                    <span>{selectedMatch.homeTeam.name} {selectedMatch.prediction.homeWinProbability}%</span>
                    <span>{selectedMatch.prediction.awayWinProbability}% {selectedMatch.awayTeam.name}</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${isPremium ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${selectedMatch.prediction.homeWinProbability}%` }} 
                    />
                    <div className="h-full bg-neutral-800 flex-grow" />
                  </div>
                </div>
              )}

              {/* AI Summary Section */}
              <div className="bg-slate-900/60 border border-neutral-800 p-4 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI Game Summary recap
                  </h4>
                  {selectedMatch.hasAiSummary && (
                    <span className="text-[10px] text-purple-400 font-bold uppercase bg-purple-950/20 px-2 py-0.5 rounded border border-purple-500/10">
                      Auto-generated
                    </span>
                  )}
                </div>

                {selectedMatch.hasAiSummary ? (
                  <div>
                    <h5 className="font-extrabold text-white text-sm mb-1.5 leading-snug">{selectedMatch.aiSummary?.title}</h5>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-4">{selectedMatch.aiSummary?.summary}</p>
                    
                    <h6 className="font-bold text-[10px] text-neutral-400 uppercase tracking-widest mb-2.5">Key Performance Metrics</h6>
                    <div className="flex flex-col gap-2 mb-4">
                      {selectedMatch.aiSummary?.keyStats.map(stat => (
                        <div key={stat.label} className="grid grid-cols-3 items-center text-xs py-1 border-b border-neutral-800/60">
                          <span className="text-neutral-200 text-left font-semibold">{stat.home}</span>
                          <span className="text-neutral-500 text-center text-[10px] uppercase font-bold">{stat.label}</span>
                          <span className="text-neutral-200 text-right font-semibold">{stat.away}</span>
                        </div>
                      ))}
                    </div>

                    <h6 className="font-bold text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">Strategic AI Analysis</h6>
                    <p className="text-xs text-neutral-400 leading-relaxed italic">{selectedMatch.aiSummary?.aiAnalysis}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 flex flex-col items-center">
                    {aiGenerating ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-3" />
                        <p className="text-xs text-purple-400 font-extrabold uppercase animate-pulse">Generating Summary...</p>
                        <p className="text-[10px] text-neutral-500 mt-1 max-w-[85%] leading-snug">{aiLoadingText}</p>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-neutral-400 mb-3.5 leading-relaxed">
                          AI hasn\'t summarized this match yet. Trigger the generator model.
                        </p>
                        <button
                          onClick={() => handleAiGeneration(selectedMatch.id)}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-4 h-4 fill-white" />
                          Generate AI Summary
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Ad in match modal */}
              {!isPremium && <AdBanner size="small" />}

              {/* Win Projection / Expert Betting predictions (Locked or unlocked) */}
              {selectedMatch.prediction && (
                <div className="bg-slate-900/60 border border-neutral-800 p-4 rounded-2xl shadow-md">
                  <h4 className="font-bold text-xs text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" />
                    AI Betting Projection Lock
                  </h4>

                  {!isPremium && selectedMatch.prediction.isPremium ? (
                    <div className="border border-dashed border-amber-500/30 rounded-xl p-4 bg-amber-500/5 text-center flex flex-col items-center relative overflow-hidden">
                      <Lock className="w-6 h-6 text-amber-500 mb-2 fill-amber-500/10" />
                      <h5 className="font-black text-xs text-white uppercase tracking-wider mb-1">
                        AI Betting Model Pro
                      </h5>
                      <p className="text-[10px] text-neutral-400 leading-relaxed max-w-[90%] mb-3.5">
                        Premium betting recommendations are reserved exclusively for Gold users. Get instantly unlocked!
                      </p>
                      <button
                        onClick={handleSubscribe}
                        className="bg-amber-500 text-black font-extrabold text-[11px] px-4 py-2 rounded-xl transition-all hover:bg-amber-400 shadow-md shadow-amber-500/20 inline-flex items-center gap-1"
                      >
                        <Crown className="w-3.5 h-3.5 fill-black" />
                        Upgrade to Unlock Pro Picks
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-neutral-900 to-amber-950/10 border border-amber-500/20 p-3.5 rounded-xl">
                      <span className="text-[9px] font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded inline-block mb-2">
                        {selectedMatch.prediction.isPremium ? 'PRO AI PICK' : 'STANDARD PICK'}
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed italic">
                        {selectedMatch.prediction.predictionText}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}


        {/* ==================== ARTICLE DETAILS MODAL ==================== */}
        {selectedArticle && (
          <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="bg-neutral-950 px-4 py-3 flex justify-between items-center border-b border-neutral-900">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                ScoreVerse AI Aggregator
              </span>
              <button 
                onClick={() => setSelectedArticle(null)} 
                className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto no-scrollbar pb-8">
              <div className="relative h-56 w-full bg-neutral-900">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <span className="absolute bottom-3 left-4 bg-emerald-500 text-black text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-widest">
                  {selectedArticle.sport}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span>Aggregator: {selectedArticle.source}</span>
                  <span>{new Date(selectedArticle.publishedAt).toLocaleDateString()}</span>
                </div>

                <h2 className="font-extrabold text-white text-lg md:text-xl leading-snug">
                  {selectedArticle.title}
                </h2>

                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                  {selectedArticle.summary}
                </p>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  This article has been aggregated and formatted automatically by ScoreVerse AI models using thousands of local sources, social feeds, and press feeds, ensuring you get the most accurate, zero-manual-bias sports coverage.
                </p>

                {selectedArticle.affiliateLink && (
                  <div className="bg-gradient-to-br from-neutral-900 to-amber-950/20 border border-amber-500/20 rounded-2xl p-4 mt-2">
                    <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                      👕 Official Affiliate Fan Merch
                    </h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                      Celebrate big transfers and titles with authentic team memorabilia and jerseys straight from official gear stores.
                    </p>
                    <button
                      onClick={() => window.open(selectedArticle.affiliateLink!.url, '_blank')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-black transition-all active:scale-[0.98] ${
                        isPremium 
                          ? 'bg-amber-500 hover:bg-amber-400' 
                          : 'bg-emerald-500 hover:bg-emerald-400'
                      }`}
                    >
                      <span>{selectedArticle.affiliateLink.text}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ==================== CELEBRATORY PREMIUM OVERLAY ==================== */}
        {showSuccessOverlay && (
          <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative mb-5">
              {/* Gold pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl scale-125 animate-pulse" />
              <div className="w-20 h-24 rounded-full bg-gradient-to-b from-amber-500 to-yellow-500 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 border border-amber-400/50">
                👑
              </div>
            </div>

            <h2 className="text-xl font-black text-amber-400 tracking-wider uppercase mb-1.5">
              ScoreVerse Gold Unlocked!
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-[85%] mb-6">
              Welcome to the premium tier! Advanced AI match recaps, high-confidence betting models, premium forum lounge, and ad-free experience are now active.
            </p>

            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col gap-2.5 w-full text-left mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>AI Betting Lock recommendations active</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>VIP Betting Lounge active in Community</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>100% Ad-Free interface enabled</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessOverlay(false)}
              className="bg-amber-500 text-black text-xs font-extrabold px-8 py-3 rounded-xl hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 uppercase tracking-wider"
            >
              Continue to Gold Feed
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
