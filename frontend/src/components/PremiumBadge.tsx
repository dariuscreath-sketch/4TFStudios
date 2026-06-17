import React from 'react';
import { Crown } from 'lucide-react';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    md: 'text-xs px-2.5 py-1 gap-1',
    lg: 'text-sm px-3 py-1.5 gap-1.5',
  };

  return (
    <span className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black shadow-md shadow-amber-500/20 ${sizeClasses[size]}`}>
      <Crown className={size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      Gold
    </span>
  );
};
