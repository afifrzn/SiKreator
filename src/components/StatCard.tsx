import React from 'react';
import { StatData } from '../types';
import { cn } from '../lib/utils';

export const StatCard = ({ data }: { data: StatData }) => {
  const isPrimary = data.color === 'primary';

  return (
    <div className={cn(
      "flex-1 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between border-b-4",
      isPrimary ? "border-primary" : "border-tertiary-container"
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-on-surface-variant text-sm font-semibold mb-1">{data.label}</p>
          <p className="text-3xl font-black text-on-surface">{data.value}</p>
        </div>
        <span className={cn(
          "px-2 py-1 rounded text-xs font-bold",
          isPrimary ? "text-primary-dim bg-primary-container/20" : "text-tertiary bg-tertiary-container/20"
        )}>
          {data.trend}
        </span>
      </div>
      
      <div className="h-12 w-full flex items-end gap-1 mt-4">
        {data.chartData.map((height, i) => (
          <div 
            key={i}
            className={cn(
              "flex-1 rounded-t transition-all duration-500",
              isPrimary ? "bg-primary" : "bg-tertiary-container",
              i < data.chartData.length - 1 ? "opacity-30" : "opacity-100"
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
};
