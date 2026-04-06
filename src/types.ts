export interface StatData {
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  chartData: number[];
  color: string;
}

export interface AIRecommendation {
  id: string;
  tag: string;
  title: string;
  description: string;
  actionLabel: string;
  type: 'hook' | 'trending' | 'insight';
  potential?: string;
}

export interface PostPerformance {
  id: string;
  title: string;
  postedAt: string;
  views: string;
  badge: string;
  badgeType: 'above' | 'top';
  imageUrl: string;
}

export interface CalendarEvent {
  id: string;
  day: number;
  type: 'Reels' | 'Carousel' | 'Stories';
  title: string;
  time: string;
  color: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  status: 'READY' | 'PROCESS' | 'DRAFT';
  time: string;
  imageUrl?: string;
}
