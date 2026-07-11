import React from 'react';
import { Play, Clock } from 'lucide-react';

interface VideoHighlight {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  source: string;
  url: string;
}

interface VideoHighlightsProps {
  videos: VideoHighlight[];
  sport?: string;
}

export const VideoHighlights: React.FC<VideoHighlightsProps> = ({ videos, sport }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
        <Play className="w-3.5 h-3.5 text-red-400" />
        {sport ? `${sport} Highlights` : 'Latest Highlights'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {videos.slice(0, 4).map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-red-500/20 transition-all sport-card"
          >
            <div className="aspect-video bg-neutral-900 relative">
              {video.imageUrl ? (
                <img src={video.imageUrl} alt={video.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-700">
                  <Play className="w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  {video.duration || 'Clip'}
                </span>
              </div>
            </div>
            <div className="p-2">
              <p className="text-[11px] font-medium text-neutral-200 line-clamp-2 group-hover:text-white transition-colors leading-snug">
                {video.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};