import React from 'react';
import { PostPerformance } from '../types';
import { TrendingUp, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export const PerformanceCard = ({ post }: { post: PostPerformance }) => {
  const isTop = post.badgeType === 'top';

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group border border-outline-variant/10">
      <div className="h-48 relative overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-on-surface flex items-center gap-1">
          {isTop ? (
            <Star size={14} className="text-tertiary-container fill-tertiary-container" />
          ) : (
            <TrendingUp size={14} className="text-primary fill-primary" />
          )}
          {post.badge}
        </div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-on-surface-variant font-bold mb-1">{post.postedAt}</p>
          <p className="text-sm font-black">{post.title}</p>
        </div>
        <div className="text-right">
          <p className="text-primary font-black">{post.views}</p>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase">Views</p>
        </div>
      </div>
    </div>
  );
};
