import React from 'react';
import { TopBar } from '../components/TopBar';
import { StatCard } from '../components/StatCard';
import { AIRecommendationCard } from '../components/AIRecommendationCard';
import { PerformanceCard } from '../components/PerformanceCard';
import { STATS, RECOMMENDATIONS, RECENT_POSTS } from '../constants';
import { Bolt, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 lg:pb-8"
    >
      <TopBar 
        title="Halo, Adib! 👋" 
        subtitle="Audiens digital Anda siap untuk konten baru." 
      />
      
      <div className="px-6 pt-4 lg:pt-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-gradient-to-br from-primary to-primary-dim rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-xl shadow-primary/20">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
                <Bolt size={18} className="fill-white" />
                <span className="text-xs font-bold uppercase tracking-widest">Detak Audiens Aktif</span>
              </div>
              <h2 className="text-5xl font-black mb-4 leading-tight">19:00 — <br/>Waktu Terbaik Posting Hari Ini</h2>
              <p className="text-primary-container max-w-md font-medium text-lg">
                Follower Anda di <span className="text-white">Jakarta & Singapura</span> menunjukkan interaksi 42% lebih tinggi saat ini dibanding kemarin.
              </p>
            </div>
            <div className="relative z-10 flex gap-4 mt-8">
              <button className="bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-primary-container transition-colors active:scale-95">
                Jadwalkan Postingan
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold border border-white/20 hover:bg-white/20 transition-colors active:scale-95">
                Lihat Heatmap
              </button>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-tertiary-container opacity-20 blur-[80px] rounded-full"></div>
            <div className="absolute right-10 top-10 w-40 h-40 border-4 border-white/5 rounded-full"></div>
            <div className="absolute right-20 top-20 w-60 h-60 border-2 border-white/5 rounded-full"></div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={i} data={stat} />
            ))}
          </div>
        </section>

        {/* AI & Performance Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <Sparkles className="text-tertiary-container fill-tertiary-container" size={20} />
                Rekomendasi AI
              </h3>
              <button className="text-primary text-sm font-bold hover:underline">Segarkan</button>
            </div>
            <div className="space-y-4">
              {RECOMMENDATIONS.map((rec) => (
                <AIRecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold">Performa Terkini</h3>
              <button className="text-primary text-sm font-bold hover:underline">Lihat Galeri</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RECENT_POSTS.map((post) => (
                <PerformanceCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
