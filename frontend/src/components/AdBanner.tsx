import React from 'react';

interface AdBannerProps {
  size?: 'small' | 'medium' | 'large';
  sport?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ size = 'medium', sport }) => {
  const ads = [
    { text: '🏈 Get 50% Off First Month — DraftKings Sportsbook', link: 'https://www.draftkings.com' },
    { text: '👟 Nike Pegasus Running Shoes — Shop Now', link: 'https://www.nike.com' },
    { text: '🍺 Budweiser — Official Beer of ScoreVerse', link: 'https://www.budweiser.com' },
    { text: '📺 YouTube TV — Watch Every Game Live', link: 'https://tv.youtube.com' },
    { text: '⚡ Gatorade — Fuel Your Game Day', link: 'https://www.gatorade.com' },
    { text: '🎮 FanDuel — Daily Fantasy Sports', link: 'https://www.fanduel.com' },
  ];

  const ad = ads[Math.floor(Math.random() * ads.length)];
  
  const sizeClasses = {
    small: 'h-12 text-xs',
    medium: 'h-16 text-sm',
    large: 'h-24 text-base',
  };

  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full ${sizeClasses[size]} bg-gradient-to-r from-neutral-900 to-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all group`}
    >
      <div className="flex items-center justify-center h-full px-4 gap-3">
        <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 shrink-0">
          AD
        </span>
        <span className="text-neutral-300 group-hover:text-white transition-colors font-medium truncate">
          {ad.text}
        </span>
        <span className="text-[10px] text-emerald-500 font-bold shrink-0 group-hover:text-emerald-400 transition-colors">
          Learn More →
        </span>
      </div>
    </a>
  );
};
