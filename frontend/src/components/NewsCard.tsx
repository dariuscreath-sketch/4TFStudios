import React from 'react';
import { ExternalLink, Calendar, MessageSquare } from 'lucide-react';
import type { NewsArticle } from '../mockData';

interface NewsCardProps {
  article: NewsArticle;
  onClick: () => void;
  isPremium: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onClick, isPremium }) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="bg-slate-900/60 hover:bg-slate-900 border border-neutral-800 hover:border-neutral-700/60 rounded-xl overflow-hidden mb-4 transition-all duration-200 cursor-pointer shadow-lg flex flex-col active:scale-[0.99]"
    >
      <div className="relative h-48 w-full bg-neutral-900 overflow-hidden shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-neutral-700 text-xs font-semibold px-2 py-0.5 rounded text-neutral-300 capitalize">
          {article.sport}
        </span>
        <span className="absolute bottom-3 right-3 bg-neutral-950/85 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded text-neutral-400">
          {article.source}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-[10px] text-neutral-400 mb-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1 bg-purple-950/20 text-purple-400 border border-purple-500/10 px-1.5 py-0.5 rounded text-[9px] font-semibold">
            ✨ AI Aggregated
          </span>
        </div>

        <h3 className="font-bold text-white text-base leading-snug mb-2 hover:text-emerald-400 transition-colors">
          {article.title}
        </h3>

        <p className="text-xs text-neutral-400 line-clamp-3 mb-4 leading-relaxed">
          {article.summary}
        </p>

        {article.affiliateLink && (
          <div
            onClick={(e) => {
              e.stopPropagation(); // Stop trigger card click
              window.open(article.affiliateLink!.url, '_blank');
            }}
            className={`mt-auto flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition-all ${
              isPremium
                ? 'bg-amber-950/20 border-amber-500/20 text-amber-400 hover:bg-amber-950/40 hover:border-amber-500/40'
                : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-500/40'
            }`}
          >
            <span className="truncate pr-2">{article.affiliateLink.text}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};
