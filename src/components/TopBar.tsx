import React, { useState } from 'react';
import { Search, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopBarProps {
  title: string;
  subtitle?: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const TopBar = ({ title, subtitle, isLoggedIn, onLogout }: TopBarProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-background/70 backdrop-blur-md sticky top-0 z-[100] lg:static lg:bg-transparent lg:backdrop-blur-none border-b border-outline-variant/5 lg:border-none">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-extrabold text-primary lg:hidden">SiKreator</h1>
        <div className="hidden lg:block">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{title}</h1>
          {subtitle && <p className="text-on-surface-variant font-medium text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-surface-container-highest px-4 py-2.5 rounded-full gap-2 group transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 border border-transparent">
          <Search className="text-outline" size={18} />
          <input type="text" placeholder="Cari wawasan..." className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48 outline-none text-on-surface" />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 text-on-surface hover:bg-surface-container-high rounded-full transition-colors relative">
            <Bell size={20} />
            {isLoggedIn && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>}
          </button>

          {/* Profile Section */}
          <div className="relative ml-2">
            <button 
              onClick={() => isLoggedIn && setShowProfileMenu(!showProfileMenu)}
              className={cn(
                "flex items-center gap-2 p-1 rounded-full transition-all z-30 relative",
                isLoggedIn ? "hover:bg-surface-container-high cursor-pointer" : "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 overflow-hidden bg-surface-container">
                <img 
                  src={isLoggedIn 
                    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                    : "https://ui-avatars.com/api/?name=?&background=E0E0E0"
                  } 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {isLoggedIn && <ChevronDown size={16} className={cn("text-outline transition-transform", showProfileMenu && "rotate-180")} />}
            </button>

            {/* Dropdown Menu */}
            {isLoggedIn && showProfileMenu && (
              <>
                {/* Overlay Klik Luar - z-index 40 */}
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                
                {/* Menu Card - z-index 50 */}
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-outline-variant/10 py-2 z-50 animate-in fade-in zoom-in duration-150">
                  <div className="px-4 py-2 border-b border-outline-variant/5 mb-1">
                    <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Akun Saya</p>
                  </div>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface hover:bg-gray-50 transition-colors">
                    <Settings size={16} /> Pengaturan
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                  >
                    <LogOut size={16} /> Keluar Sekarang
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};