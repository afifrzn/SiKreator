import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Sparkles, TrendingUp, Info, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export const HeatmapPage = () => {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Data Dummy untuk Heatmap (0 - 100)
  // Di aplikasi asli, data ini diambil dari backend (jumlah likes/engagement per jam)
  const [heatmapData] = useState(() => 
    Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)))
  );

  // Fungsi untuk menentukan warna berdasarkan value
  const getColor = (value: number) => {
    if (value > 80) return 'bg-primary text-white'; // Peak
    if (value > 60) return 'bg-primary/60';
    if (value > 40) return 'bg-primary/40';
    if (value > 20) return 'bg-primary/20';
    return 'bg-gray-100'; // Low
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-12 bg-background"
    >
      {/* Header */}
      <header className="flex justify-between items-center w-full px-8 py-6 bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black font-headline tracking-tight">Heatmap Engagement</h1>
            <p className="text-xs text-gray-400">Analisis waktu terbaik audiensmu aktif.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
            <Sparkles size={16} />
            <span className="text-xs font-bold">AI Optimized</span>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Top Insights Card */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 bg-primary rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
            <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-10 rotate-12" />
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-2">Waktu Terbaik: Selasa, 20:00</h3>
              <p className="opacity-80 max-w-md text-sm leading-relaxed">
                Berdasarkan data 30 hari terakhir, postingan di jam ini mendapatkan engagement 45% lebih tinggi dibanding rata-rata.
              </p>
              <button className="mt-6 px-6 py-3 bg-white text-primary font-bold rounded-xl text-sm shadow-lg hover:scale-105 transition-all">
                Jadwalkan di Jam Ini
              </button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Info size={24} />
              <h4 className="font-bold uppercase text-[10px] tracking-widest">Cara Membaca</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span className="text-xs font-medium text-gray-600">Sangat Tinggi (Peak)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-primary/20"></div>
                <span className="text-xs font-medium text-gray-400">Rendah (Quiet)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Jam */}
            <div className="grid grid-cols-[100px_repeat(24,1fr)] gap-1 mb-4">
              <div></div>
              {hours.map(hour => (
                <div key={hour} className="text-[9px] font-bold text-gray-400 text-center">
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
            </div>

            {/* Baris Hari */}
            <div className="space-y-1">
              {days.map((day, dayIdx) => (
                <div key={day} className="grid grid-cols-[100px_repeat(24,1fr)] gap-1 items-center">
                  <div className="text-xs font-bold text-gray-600">{day}</div>
                  {heatmapData[dayIdx].map((val, hourIdx) => (
                    <motion.div
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      key={hourIdx}
                      className={cn(
                        "aspect-square rounded-sm cursor-pointer transition-colors relative group",
                        getColor(val)
                      )}
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {day}, {hourIdx}:00 — {val}% Engagement
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend & Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><Clock size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Avg. Session</p>
              <h5 className="text-lg font-bold">12 Menit</h5>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-green-500"><TrendingUp size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Retention Rate</p>
              <h5 className="text-lg font-bold">68%</h5>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-500"><CalendarIcon size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">Best Day</p>
              <h5 className="text-lg font-bold">Selasa</h5>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};