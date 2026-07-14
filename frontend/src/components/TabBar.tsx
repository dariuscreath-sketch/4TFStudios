import React from 'react';
import { Home, Trophy, Newspaper, Users, User } from 'lucide-react';

interface TabBarProps {
  activeTab: 'home' | 'scores' | 'news' | 'community' | 'profile' | 'fantasy';
  setActiveTab: (tab: 'home' | 'scores' | 'news' | 'community' | 'profile' | 'fantasy') => void;
  isPremium: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab, isPremium }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scores', label: 'Scores', icon: Trophy },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-2 pb-2">
      <div className="glass-strong rounded-2xl shadow-2xl">
        <div className="flex justify-around items-center h-14 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? isPremium 
                      ? 'text-amber-500 scale-105 bg-amber-500/5' 
                      : 'text-emerald-500 scale-105 bg-emerald-500/5' 
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' : ''}`} />
                <span className={`text-[10px] font-semibold tracking-wider ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};