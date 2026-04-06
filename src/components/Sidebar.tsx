import React from 'react';
import { LayoutDashboard, Sparkles, Calendar, BarChart3, Plus, HelpCircle, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Sparkles, label: 'Asisten AI', path: '/ai' },
  { icon: Calendar, label: 'Jadwal Post', path: '/calendar' },
  { icon: BarChart3, label: 'Wawasan', path: '/insights' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-surface-container-low p-4 space-y-2 font-headline font-medium border-r-0">
      <div className="flex items-center gap-3 px-2 py-6 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="text-white fill-white" size={20} />
        </div>
        <div>
          <p className="text-2xl font-black text-on-surface leading-none">SiKreator</p>
          <p className="text-[10px] uppercase tracking-widest text-primary font-bold opacity-80">Digital Concierge</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1",
                isActive 
                  ? "bg-surface-container-lowest text-primary shadow-sm" 
                  : "text-on-surface opacity-70 hover:opacity-100 hover:bg-surface-container-high"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-outline-variant/10 space-y-1">
        <Link 
          to="/upload"
          className="w-full py-3 mb-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Plus size={20} />
          Postingan Baru
        </Link>
        
        <Link to="/help" className="flex items-center gap-3 px-4 py-2 text-on-surface opacity-70 hover:opacity-100 hover:bg-surface-container-high rounded-xl transition-all">
          <HelpCircle size={20} />
          <span>Bantuan</span>
        </Link>
        
        <button className="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error/5 rounded-xl transition-all">
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
