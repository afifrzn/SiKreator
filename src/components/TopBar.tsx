import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export const TopBar = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-background/70 backdrop-blur-md sticky top-0 z-50 lg:static lg:bg-transparent lg:backdrop-blur-none">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-extrabold text-on-surface lg:hidden">SiKreator</h1>
        <div className="hidden lg:block">
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="text-on-surface-variant font-medium text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-surface-container-highest px-4 py-2 rounded-full gap-2 group transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20">
          <Search className="text-outline" size={18} />
          <input 
            type="text" 
            placeholder="Cari wawasan..." 
            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-48 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background"></span>
          </button>
          <button className="p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
            <Settings size={20} />
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 ml-2">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
