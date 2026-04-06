import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { UploadPage } from './pages/UploadPage';
import { LoginPage } from './pages/LoginPage';
import { Home, Sparkles, Calendar, BarChart3, Plus, Upload } from 'lucide-react';
import { cn } from './lib/utils';

const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Beranda', path: '/' },
    { icon: Sparkles, label: 'AI', path: '/ai' },
    { icon: Calendar, label: 'Jadwal', path: '/calendar' },
    { icon: BarChart3, label: 'Wawasan', path: '/insights' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-4 pb-4 lg:hidden bg-background/70 backdrop-blur-xl rounded-t-[24px] shadow-[0_-8px_24px_rgba(50,40,79,0.06)] font-headline text-[10px] font-bold uppercase tracking-widest">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center p-2 transition-all duration-300 ease-out active:scale-90",
              isActive 
                ? "bg-primary text-white rounded-2xl p-3 mb-2 scale-110" 
                : "text-on-surface opacity-50"
            )}
          >
            <item.icon size={isActive ? 20 : 24} />
            <span className="mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="bg-background text-on-surface min-h-screen flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-hidden relative">
        {children}
        <MobileNav />
        
        {/* Floating Action Button (Mobile Only) */}
        <Link 
          to="/upload"
          className="fixed bottom-24 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40 lg:hidden active:scale-95"
        >
          <Plus size={32} />
        </Link>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/upload" element={<UploadPage />} />
          {/* Fallback for other routes */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
