import React, { useState, useEffect } from 'react';
import { TopBar } from '../components/TopBar';
import { StatCard } from '../components/StatCard';
import { AIRecommendationCard } from '../components/AIRecommendationCard';
import { PerformanceCard } from '../components/PerformanceCard';
import { STATS, RECOMMENDATIONS, RECENT_POSTS } from '../constants';
import { Bolt, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom'; 
import { cn } from '../lib/utils';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Sinkronisasi status login
  useEffect(() => {
    const savedUser = localStorage.getItem('user_name');
    if (savedUser) {
      setIsLoggedIn(true);
      setUserName(savedUser);
    }
  }, []);

  const handleLogout = () => {
    // 1. Bersihkan Storage
    localStorage.clear(); 
    
    // 2. Reset State
    setIsLoggedIn(false);
    setUserName('');
    
    // 3. Opsi: Force Refresh (Paling Aman untuk memastikan semua komponen reset)
    // window.location.reload(); 
    
    // 4. Redirect ke Login
    navigate('/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 bg-background"
    >
      <TopBar 
        title={isLoggedIn ? `Halo, ${userName}! 👋` : "Halo, Mau Ngonten Apa?"} 
        subtitle={isLoggedIn ? "Audiens Anda siap untuk konten baru." : "Login untuk akses penuh."} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <div className="px-6 pt-4 lg:pt-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={cn(
            "lg:col-span-8 rounded-[2rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[340px] shadow-xl transition-all duration-500",
            isLoggedIn ? "bg-gradient-to-br from-primary to-primary-dim" : "bg-slate-400 grayscale shadow-none"
          )}>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
                <Bolt size={18} className="fill-white" />
                <span className="text-xs font-bold uppercase tracking-widest">Live Insight</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                {isLoggedIn ? "19:00 — Waktu Terbaik Posting" : "Pantau Waktu Terbaik Anda"}
              </h2>
            </div>
            
            <div className="relative z-10 flex gap-4 mt-8">
              {isLoggedIn ? (
                <button className="bg-white text-primary px-8 py-3.5 rounded-full font-bold shadow-lg active:scale-95 transition-transform">
                  Jadwalkan Postingan
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-slate-800 px-8 py-3.5 rounded-full font-black flex items-center gap-2 shadow-xl active:scale-95 transition-transform"
                >
                  <Lock size={18} /> Login Sekarang
                </button>
              )}
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 blur-[80px] rounded-full"></div>
          </div>

          {/* Stats Section */}
          <div className={cn("lg:col-span-4 flex flex-col gap-4 transition-all duration-500", !isLoggedIn && "opacity-40 grayscale pointer-events-none")}>
            {STATS.map((stat, i) => <StatCard key={i} data={stat} />)}
          </div>
        </section>

        {/* AI Recommendations */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-extrabold flex items-center gap-2"><Sparkles className="text-primary" size={20} /> Rekomendasi AI</h3>
            <div className={cn("space-y-4 transition-all duration-500", !isLoggedIn && "blur-[6px] opacity-40 pointer-events-none")}>
              {RECOMMENDATIONS.map((rec) => <AIRecommendationCard key={rec.id} recommendation={rec} />)}
            </div>
          </div>

          {/* Performance Section */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-extrabold">Performa Terkini</h3>
            <AnimatePresence mode="wait">
              {!isLoggedIn ? (
                <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] h-80 flex flex-col items-center justify-center text-center p-8">
                  <Lock className="text-slate-300 mb-4" size={48} />
                  <h4 className="font-bold text-lg text-slate-600">Data Insight Terkunci</h4>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs">Hubungkan akun untuk melihat analisis performa konten Anda secara mendalam.</p>
                </motion.div>
              ) : (
                <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {RECENT_POSTS.map((post) => <PerformanceCard key={post.id} post={post} />)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </motion.div>
  );
};