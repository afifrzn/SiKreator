import { StatData, AIRecommendation, PostPerformance, CalendarEvent, ScheduledPost } from './types';

export const STATS: StatData[] = [
  {
    label: 'Total Jangkauan',
    value: '1.2jt',
    trend: '+12%',
    trendType: 'up',
    chartData: [40, 60, 30, 80, 100],
    color: 'primary'
  },
  {
    label: 'Tingkat Interaksi',
    value: '4.8%',
    trend: '+5.2%',
    trendType: 'up',
    chartData: [20, 50, 90, 70, 85],
    color: 'tertiary-container'
  }
];

export const RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: '1',
    tag: 'HOOK BARU',
    title: '"Berhenti scrolling! Ini cara saya dapat 10rb followers..."',
    description: 'Ganti pembuka draf Anda dengan ini untuk meningkatkan retensi hingga 18%.',
    actionLabel: 'Terapkan ke Draf',
    type: 'hook'
  },
  {
    id: '2',
    tag: 'TREN',
    title: 'Tambahkan audio tren: "Sunset Vibes (Remix)"',
    description: 'Sedang tren di bidang Anda. Gunakan untuk reel BTS Anda berikutnya.',
    actionLabel: 'Potensi Viral',
    type: 'trending',
    potential: 'Potensi Viral'
  }
];

export const RECENT_POSTS: PostPerformance[] = [
  {
    id: '1',
    title: 'Morning Routine Reel',
    postedAt: 'Diposting 2 hari lalu',
    views: '24.5rb',
    badge: 'DI ATAS RATA-RATA',
    badgeType: 'above',
    imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Gear Guide 2024',
    postedAt: 'Diposting 5 hari lalu',
    views: '82.1rb',
    badge: 'PERFORMA TERBAIK',
    badgeType: 'top',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
  }
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    day: 13,
    type: 'Reels',
    title: 'Tutorial AI',
    time: '18:00 WIB',
    color: 'primary'
  },
  {
    id: '2',
    day: 15,
    type: 'Carousel',
    title: 'Mindset',
    time: '20:15 WIB',
    color: 'tertiary'
  },
  {
    id: '3',
    day: 16,
    type: 'Stories',
    title: 'Q&A',
    time: '09:00 WIB',
    color: 'secondary'
  }
];

export const SCHEDULED_LIST: ScheduledPost[] = [
  {
    id: '1',
    title: 'Carousel: Mindset Kreator 2024',
    status: 'READY',
    time: 'Hari ini, 20:15',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    title: 'Stories: Q&A Tech Setup',
    status: 'PROCESS',
    time: 'Besok, 09:00',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    title: 'Reels: Coding Lifestyle',
    status: 'READY',
    time: '17 Mei, 18:30',
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '4',
    title: 'Konten Tanpa Judul',
    status: 'DRAFT',
    time: 'Belum diatur'
  }
];
