import React from 'react';
import { AIRecommendation } from '../types';
import { cn } from '../lib/utils';
import { TrendingUp } from 'lucide-react';

export const AIRecommendationCard = ({ recommendation }: { recommendation: AIRecommendation }) => {
  if (recommendation.type === 'trending') {
    return (
      <div className="bg-surface-container-high p-5 rounded-xl relative group transition-all">
        <p className="text-on-surface font-semibold text-sm mb-3">{recommendation.title}</p>
        <p className="text-on-surface-variant text-xs mb-4">{recommendation.description}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-primary"></div>
          </div>
          <span className="text-[10px] font-bold text-primary">{recommendation.potential}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tertiary-container/10 p-5 rounded-xl border border-tertiary-container/10 relative group hover:bg-tertiary-container/20 transition-colors">
      <div className="absolute -top-3 -left-2 bg-tertiary-container text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
        {recommendation.tag}
      </div>
      <p className="text-on-surface font-semibold text-sm mb-3">{recommendation.title}</p>
      <p className="text-on-surface-variant text-xs mb-4">
        {recommendation.description.split('18%')[0]}
        <span className="text-tertiary font-bold">18%</span>
        {recommendation.description.split('18%')[1]}
      </p>
      <button className="w-full py-2 bg-white rounded-lg text-tertiary text-xs font-bold shadow-sm group-hover:bg-tertiary group-hover:text-white transition-all">
        {recommendation.actionLabel}
      </button>
    </div>
  );
};
