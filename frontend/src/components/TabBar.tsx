import React from 'react';
import { Home, Trophy, Newspaper, Users, User } from 'lucide-react';

interface TabBarProps {
  activeTab: 'home' | 'scores' | 'news' | 'community' | 'profile';
  setActiveTab: (tab: 'home' | 'scores' | 'news' | 'community' | 'profile') => void;
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-neutral-800 shadow-xl max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
                isActive 
                  ? isPremium 
                    ? 'text-amber-500 scale-105' 
                    : 'text-emerald-500 scale-105' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-semibold tracking-wider">{tab.label}</span>
              {isActive && (
                <span className={`w-1 h-1 rounded-full mt-0.5 ${
                  isPremium ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
