import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CalendarPage = () => {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentUser = localStorage.getItem('user_name');

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/posts');
      // ✅ FIX 1: Tidak perlu filter manual di frontend,
      // server sudah filter berdasarkan session user
      const allData = Array.isArray(response.data) ? response.data : [];
      setScheduledPosts(allData);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Fungsi pembantu untuk menyamakan format tanggal (YYYY-MM-DD)
  const normalizeDate = (dateInput: any) => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const daysArray = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay; i > 0; i--) {
      daysArray.push({ date: new Date(year, month - 1, prevMonthLastDay - i + 1), isCurrentMonth: false });
    }
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      daysArray.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remaining = 42 - daysArray.length;
    for (let i = 1; i <= remaining; i++) {
      daysArray.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return daysArray;
  };

  const calendarDays = getDaysInMonth();
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // ✅ FIX 2: Upcoming List hanya tampilkan post yang scheduled_time-nya di masa depan
  const now = new Date();
  const upcomingPosts = scheduledPosts
    .filter(p => p.scheduled_time && new Date(p.scheduled_time) >= now)
    .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 lg:pb-8 bg-background"
    >
      <header className="flex justify-between items-center w-full px-8 py-4 bg-background/70 backdrop-blur-xl sticky top-0 z-50 border-b border-outline-variant/5">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-lg font-bold text-primary">Jadwal {currentUser}</h1>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={fetchPosts}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-primary font-bold rounded-full shadow-sm border hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Sync..." : "Refresh Data"}</span>
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface flex items-center gap-4">
              {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
              <div className="flex gap-2 ml-4">
                <button onClick={prevMonth} className="p-2 bg-white border rounded-xl hover:bg-gray-50 transition-all active:scale-95"><ChevronLeft size={20} /></button>
                <button onClick={nextMonth} className="p-2 bg-white border rounded-xl hover:bg-gray-50 transition-all active:scale-95"><ChevronRight size={20} /></button>
              </div>
            </h2>
            <p className="text-sm text-gray-500 font-medium">Total {scheduledPosts.length} konten ditemukan di sistem.</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/10">
              <div className="grid grid-cols-7 gap-3">
                {days.map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{day}</div>
                ))}
                {calendarDays.map((item, idx) => {
                  const currentCalendarDate = normalizeDate(item.date);

                  const postsInThisDay = scheduledPosts.filter(p =>
                    p.scheduled_time && normalizeDate(p.scheduled_time) === currentCalendarDate
                  );

                  const isToday = normalizeDate(new Date()) === currentCalendarDate;

                  return (
                    <div key={idx} className={cn(
                      "min-h-[140px] rounded-2xl p-2 border transition-all flex flex-col gap-1",
                      !item.isCurrentMonth && "opacity-20 grayscale",
                      isToday ? "bg-primary/5 border-primary ring-1 ring-primary/20" : "bg-gray-50/30 border-gray-100"
                    )}>
                      <div className={cn("text-xs font-bold px-1", isToday ? "text-primary" : "text-gray-400")}>
                        {item.date.getDate()}
                      </div>

                      <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
                        {postsInThisDay.map((post, pIdx) => (
                          <div key={pIdx} className="bg-white rounded-xl p-1 shadow-sm border border-primary/10 group cursor-pointer hover:border-primary transition-colors">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={`${API_BASE_URL}${post.Media?.file_url || post.Medium?.file_url}`}
                                className="w-full h-full object-cover"
                                alt="Preview"
                                onError={(e) => { e.currentTarget.src = "https://placehold.co/200x120?text=No+Image"; }}
                              />
                            </div>
                            <p className="text-[8px] font-bold truncate mt-1 text-gray-700 px-1 uppercase tracking-tighter">
                              {post.caption || 'Untitled'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 h-full">
              <h3 className="text-lg font-bold mb-6">Upcoming List</h3>
              <div className="space-y-4">
                {/* ✅ FIX 2: Pakai upcomingPosts, bukan scheduledPosts */}
                {upcomingPosts.length > 0 ? (
                  upcomingPosts.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                        <img
                          src={`${API_BASE_URL}${item.Media?.file_url || item.Medium?.file_url}`}
                          className="w-full h-full object-cover"
                          alt="Thumbnail"
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/56x56?text=?"; }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-gray-800 truncate">{item.caption || "No Caption"}</h4>
                        <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">
                          {new Date(item.scheduled_time).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-400 py-10 italic font-medium">Belum ada konten.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
