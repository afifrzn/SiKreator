import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

// ✅ Ambil base URL dari env — hapus axios import yang ga dipakai
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
      const allData = Array.isArray(response.data) ? response.data : [];
      const myPosts = allData.filter(post =>
        post.author === currentUser || post.user_name === currentUser
      );
      setScheduledPosts(myPosts);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [currentUser]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 h-screen overflow-y-auto no-scrollbar pb-24 lg:pb-8 bg-background"
    >
      <header className="flex justify-between items-center w-full px-8 py-4 bg-background/70 backdrop-blur-xl sticky top-0 z-50 font-headline font-medium border-b border-outline-variant/5">
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
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-on-surface-variant">{currentUser}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container border-2 border-white shadow-sm">
              <img src={`https://ui-avatars.com/api/?name=${currentUser}&background=random`} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface flex items-center gap-4">
              {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
              <div className="flex gap-2 ml-4">
                <button onClick={prevMonth} className="p-2 bg-white border rounded-xl hover:bg-gray-50 transition-all active:scale-90"><ChevronLeft size={20} /></button>
                <button onClick={nextMonth} className="p-2 bg-white border rounded-xl hover:bg-gray-50 transition-all active:scale-90"><ChevronRight size={20} /></button>
              </div>
            </h2>
            <p className="text-on-surface-variant mt-2">Menampilkan {scheduledPosts.length} konten terjadwal milikmu.</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-outline-variant/10">
              <div className="grid grid-cols-7 gap-3">
                {days.map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{day}</div>
                ))}
                {calendarDays.map((item, idx) => {
                  const dateString = item.date.toLocaleDateString('en-CA');
                  const postInDay = scheduledPosts.find(p => {
                    if (!p.scheduled_time) return false;
                    return new Date(p.scheduled_time).toLocaleDateString('en-CA') === dateString;
                  });
                  const isToday = new Date().toLocaleDateString('en-CA') === dateString;

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "min-h-[130px] rounded-2xl p-2 border transition-all flex flex-col",
                        !item.isCurrentMonth && "opacity-20 grayscale",
                        isToday ? "bg-primary/5 border-primary/20 ring-2 ring-primary/5" : "bg-gray-50/30 border-gray-100"
                      )}
                    >
                      <div className={cn("text-xs font-bold mb-2", isToday ? "text-primary" : "text-gray-400")}>
                        {item.date.getDate()}
                      </div>
                      {postInDay && (
                        <div className="flex-1 bg-white rounded-xl p-1 shadow-sm border border-primary/10 overflow-hidden">
                          <div className="relative aspect-video rounded-lg overflow-hidden mb-1 bg-gray-100">
                            <img
                              src={`${API_BASE_URL}${postInDay.Medium?.file_url}`} // ✅ Pakai API_BASE_URL
                              className="w-full h-full object-cover"
                              alt="Preview"
                              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x250?text=No+Image"; }}
                            />
                          </div>
                          <p className="text-[9px] font-bold truncate px-1 text-gray-700">{postInDay.caption || 'Konten'}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 h-full">
              <h3 className="text-lg font-bold mb-6">Upcoming Post</h3>
              <div className="space-y-4">
                {scheduledPosts.length > 0 ? (
                  scheduledPosts.slice(0, 5).map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                        <img
                          src={`${API_BASE_URL}${item.Medium?.file_url}`} // ✅ Pakai API_BASE_URL
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100?text=Error"; }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold truncate">{item.caption || "No Caption"}</h4>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(item.scheduled_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-400 py-10">Belum ada jadwal konten untukmu.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};