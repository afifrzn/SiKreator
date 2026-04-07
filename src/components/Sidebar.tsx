import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sparkles, Calendar, BarChart3, Plus, HelpCircle, LogOut, ShieldCheck, Map } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Sparkles, label: 'Asisten AI', path: '/ai-assistant' },
  { icon: Calendar, label: 'Jadwal Post', path: '/calendar' },
  { icon: BarChart3, label: 'Wawasan', path: '/insights' },
  { icon: Map, label: 'Heatmap', path: '/heatmap' },
  { icon: ShieldCheck, label: 'Akun', path: '/tambah-akun' },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status login untuk mengatur tampilan tombol keluar & akses menu
  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem('user_name');
      setIsLoggedIn(!!user);
    };

    checkLogin();
    // Listen to storage changes (optional, but good for sync)
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [location]); // Re-check setiap pindah halaman

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
    // Memastikan dashboard juga ter-update jika tidak menggunakan state management global
    window.location.reload(); 
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-surface-container-low p-4 space-y-2 font-headline font-medium border-r border-outline-variant/5 shadow-sm">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 py-6 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="text-white fill-white" size={20} />
        </div>
        <div>
          <p className="text-2xl font-black text-on-surface leading-none tracking-tight">SiKreator</p>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold opacity-80 mt-1">Digital Concierge</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-white text-primary shadow-sm font-bold scale-[1.02]" 
                  : "text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high hover:translate-x-1"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-primary" : "text-on-surface/50")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-outline-variant/10 space-y-2">
        <Link 
          to={isLoggedIn ? "/upload" : "/login"}
          className={cn(
            "w-full py-3.5 mb-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95",
            isLoggedIn 
              ? "bg-primary text-white shadow-primary/20 hover:brightness-110" 
              : "bg-slate-200 text-slate-500 cursor-not-allowed opacity-70"
          )}
        >
          <Plus size={20} />
          Postingan Baru
        </Link>
        
        <Link to="/help" className="flex items-center gap-3 px-4 py-2.5 text-on-surface/70 hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-all group">
          <HelpCircle size={20} className="group-hover:text-primary transition-colors" />
          <span>Bantuan</span>
        </Link>
        
        {/* Tombol Logout hanya muncul jika user sudah login */}
        {isLoggedIn && (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>Keluar</span>
          </button>
        )}
      </div>
    </aside>
  );
};