import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TopBar } from '../components/TopBar';
import { CALENDAR_EVENTS } from '../constants'; // Kita tetap pakai konstanta untuk event kalender statis
import { cn } from '../lib/utils';
import { PlusCircle, Sparkles, TrendingUp, Rocket, Clock, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const CalendarPage = () => {
  // --- STATE UNTUK DATABASE ---
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setScheduledPosts(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const calendarDays = [12, 13, 14, 15, 16, 17, 18];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 lg:pb-8"
    >
      <header className="flex justify-between items-center w-full px-8 py-4 bg-background/70 backdrop-blur-xl sticky top-0 z-50 font-headline font-medium">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <Clock size={18} />
            </span>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none" 
              placeholder="Cari konten atau insight..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={fetchPosts}
            className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-lowest text-primary font-bold rounded-full shadow-sm hover:bg-surface-container transition-colors active:scale-95 duration-200"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Sync..." : "Ambil Data Terbaru"}</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Jadwal & Wawasan</h2>
            <p className="text-on-surface-variant mt-2">Kelola ritme kontenmu dan pahami apa yang disukai audiens.</p>
          </div>
          <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold rounded-full shadow-xl shadow-primary/25 hover:brightness-105 transition-all flex items-center gap-2 active:scale-95">
            <PlusCircle size={20} />
            Jadwalkan Baru
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Calendar Section (Balik Lagi!) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold font-headline">Kalender Konten</h3>
                <div className="flex bg-surface-container-low p-1 rounded-lg">
                  <button className="px-4 py-1.5 bg-surface-container-lowest rounded-md text-sm font-bold shadow-sm">Mingguan</button>
                  <button className="px-4 py-1.5 text-sm font-medium opacity-60">Bulanan</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4">
                {days.map(day => (
                  <div key={day} className="text-center text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">{day}</div>
                ))}
                
                {calendarDays.map(dayNum => {
                  const event = CALENDAR_EVENTS.find(e => e.day === dayNum);
                  const isToday = dayNum === 15;
                  
                  return (
                    <div 
                      key={dayNum} 
                      className={cn(
                        "min-h-[140px] rounded-xl p-2 border transition-all",
                        isToday 
                          ? "bg-primary-container/20 border-primary/20 ring-4 ring-primary/5" 
                          : "bg-surface-container-low/30 border-outline-variant/10"
                      )}
                    >
                      <div className={cn("text-xs font-bold mb-2", isToday && "text-primary")}>
                        {dayNum} {isToday && "(Hari Ini)"}
                      </div>
                      {event && (
                        <div className={cn(
                          "border-l-4 p-2 rounded text-[10px] leading-tight",
                          event.color === 'primary' ? "bg-primary/10 border-primary text-primary" :
                          event.color === 'tertiary' ? "bg-tertiary/10 border-tertiary text-tertiary" :
                          "bg-secondary/10 border-secondary text-secondary"
                        )}>
                          <div className="font-bold">{event.type}: {event.title}</div>
                          <div className="opacity-70">{event.time}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Insight AI Section (Balik Lagi!) */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
              <div className="col-span-12 md:col-span-7 bg-tertiary-container/20 rounded-xl p-8 relative overflow-hidden group border border-tertiary-container/10">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-tertiary-container/30 blur-3xl rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-tertiary p-2 rounded-lg text-white">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-xl font-bold font-headline text-tertiary-dim">Penjelasan Insight AI</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-surface-container-lowest/80 backdrop-blur-sm p-4 rounded-xl border-l-4 border-tertiary shadow-sm">
                      <p className="text-sm font-medium leading-relaxed">
                        "Postingan <span className="text-tertiary font-bold">'Tutorial AI'</span> menarik <span className="text-primary font-bold">45% audiens baru</span> karena hook yang kuat di 3 detik pertama. Coba ulangi pola ini untuk konten hari Sabtu!"
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-surface-container-lowest/50 p-3 rounded-lg">
                        <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Tingkat Interaksi</div>
                        <div className="text-xl font-bold text-tertiary tracking-tight">8.4%</div>
                        <div className="text-[10px] text-green-600 font-bold">↑ 1.2% dari rata-rata</div>
                      </div>
                      <div className="flex-1 bg-surface-container-lowest/50 p-3 rounded-lg">
                        <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Total Jangkauan</div>
                        <div className="text-xl font-bold text-tertiary tracking-tight">12.5k</div>
                        <div className="text-[10px] text-green-600 font-bold">↑ Tinggi</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-5 bg-primary-container/10 border border-primary/10 rounded-xl p-8 flex flex-col justify-center text-center">
                <TrendingUp className="text-primary mx-auto mb-4" size={48} />
                <h4 className="text-2xl font-black font-headline text-on-surface mb-2 tracking-tight">Waktunya Posting!</h4>
                <p className="text-sm text-on-surface-variant px-4">Berdasarkan data, audiensmu paling aktif jam <span className="font-bold text-primary">20:00 - 21:30</span>. Jangan sampai terlewat!</p>
              </div>
            </div>
          </div>

          {/* Right Column: Daftar Jadwal (Data Asli dari Database) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low rounded-xl p-6 h-full border border-outline-variant/5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-headline">Daftar Jadwal</h3>
                <span className="px-3 py-1 bg-surface-container-highest text-primary text-[10px] font-bold rounded-full">
                  {scheduledPosts.length} MENDATANG
                </span>
              </div>
              
              <div className="space-y-4">
                {scheduledPosts.map(item => (
                  <div key={item.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 group hover:-translate-y-1 transition-transform cursor-pointer">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-container">
                        {item.media_url ? (
                          <img src={item.media_url} alt={item.caption} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                             <ImageIcon size={24} />
                          </div>
                        )}
                        {item.status === 'processing' && (
                          <div className="absolute inset-0 bg-on-surface/40 flex items-center justify-center backdrop-blur-[2px]">
                            <RefreshCw className="text-white animate-spin" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold line-clamp-1 text-on-surface">
                            {item.caption || "Tanpa Caption"}
                          </h4>
                          <span className={cn(
                            "text-[10px] font-black flex items-center gap-1",
                            item.status === 'posted' ? "text-green-500" :
                            item.status === 'processing' ? "text-tertiary" :
                            "text-on-surface-variant/40"
                          )}>
                            {item.status === 'posted' ? 'BERHASIL' : item.status === 'processing' ? 'PROSES' : 'JADWAL'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant opacity-60">
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> 
                            {item.scheduled_at ? new Date(item.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 text-sm font-bold text-primary border-2 border-primary/10 rounded-xl hover:bg-primary/5 transition-colors">
                Lihat Semua Jadwal
              </button>
            </div>
          </div>
        </div>

        {/* Footer Rocket Section (Balik Lagi!) */}
        <div className="bg-primary p-1 rounded-2xl">
          <div className="bg-surface p-8 rounded-[calc(1.5rem-4px)] flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/5">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-primary">
                <Rocket size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-bold font-headline tracking-tight">Tingkatkan Performa Kontenmu</h4>
                <p className="text-on-surface-variant">Ikuti saran AI kami untuk mendapatkan engagement yang lebih maksimal hari ini.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl border border-outline font-bold hover:bg-surface-container transition-colors">Pelajari Metrik</button>
              <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-105 transition-all">Lihat Rekomendasi</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};