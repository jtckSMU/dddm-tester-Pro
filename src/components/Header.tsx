import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  User, 
  Menu, 
  X, 
  SlidersHorizontal,
  Bookmark,
  Bell,
  Activity,
  Moon,
  Sun,
  Clock
} from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
  isLiveUpdating: boolean;
  toggleLiveUpdating: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenAuth,
  watchlistCount,
  onOpenWatchlist,
  isLiveUpdating,
  toggleLiveUpdating,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'products', label: 'Products' },
    { id: 'community', label: 'Community' },
    { id: 'markets', label: 'Markets' },
    { id: 'brokers', label: 'Brokers' },
    { id: 'more', label: 'More' },
  ];

  return (
    <header 
      id="main-header"
      className={`fixed top-8 w-full z-40 transition-all duration-200 ${
        isDarkMode 
          ? 'bg-[#11151c]/95 backdrop-blur-md border-b border-[#232936] text-white shadow-md' 
          : 'bg-white/95 backdrop-blur-md border-b border-[#E0E3EB] text-[#181c21] shadow-2xs'
      }`}
    >
      <div className="h-14 max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 md:gap-6">
        
        {/* Left: Brand + Search + Nav */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1">
          
          {/* Logo */}
          <button 
            id="brand-logo-btn"
            onClick={() => setActiveTab('markets')}
            className="flex items-center gap-2 pr-3 border-r border-[#E0E3EB]/20 focus:outline-none group text-left cursor-pointer"
          >
            <div className="w-7 h-7 bg-[#2962ff] rounded-md flex items-center justify-center text-white shadow-sm group-hover:bg-[#0049db] transition-colors">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className={`font-bold text-[17px] tracking-tight transition-colors ${
              isDarkMode ? 'text-white' : 'text-[#181c21]'
            }`}>
              Market<span className="text-[#2962ff]">View</span>
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#2962ff]/10 text-[#2962ff] px-1.5 py-0.5 rounded border border-[#2962ff]/20">
              PRO
            </span>
          </button>

          {/* Search Bar */}
          <div 
            id="header-search-trigger"
            onClick={onOpenSearch}
            className={`hidden xl:flex flex-1 max-w-sm items-center px-3 py-1.5 rounded-xl group transition-all cursor-pointer border ${
              isDarkMode 
                ? 'bg-[#191f2b] border-[#293245] hover:border-[#3b4761]' 
                : 'bg-[#f1f4fb] border-transparent hover:border-[#c3c5d8]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#8e94a8] mr-2 shrink-0 group-hover:text-[#2962ff] transition-colors" />
            <span className="text-xs text-[#8e94a8] select-none flex-1 truncate">
              Search symbols, futures, macro...
            </span>
            <kbd className={`hidden 2xl:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded border shadow-2xs ${
              isDarkMode ? 'bg-[#232936] text-[#8e94a8] border-[#364057]' : 'bg-white text-[#6A6D78] border-[#E0E3EB]'
            }`}>
              ⌘K
            </kbd>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-[13px] transition-colors relative py-1 cursor-pointer font-medium ${
                    isActive
                      ? 'text-[#2962ff] font-bold'
                      : isDarkMode 
                        ? 'text-[#8e94a8] hover:text-white' 
                        : 'text-[#434656] hover:text-[#181c21]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#2962ff] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Live Feed Status Pill */}
          <button
            id="live-feed-toggle-btn"
            onClick={toggleLiveUpdating}
            title={isLiveUpdating ? "Live market ticks: Active" : "Live market ticks: Paused"}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              isLiveUpdating 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLiveUpdating ? 'bg-[#089981] animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider">{isLiveUpdating ? 'FEED LIVE' : 'FEED PAUSED'}</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          {onToggleDarkMode && (
            <button
              id="theme-toggle-btn"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                isDarkMode 
                  ? 'bg-[#191f2b] border-[#293245] text-amber-400 hover:bg-[#232a3a]' 
                  : 'bg-[#f1f4fb] border-[#E0E3EB] text-[#434656] hover:text-[#181c21] hover:bg-[#e4e7f2]'
              }`}
              title={isDarkMode ? "Switch to daylight mode" : "Switch to Bloomberg dark mode"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Watchlist Quick Button */}
          <button
            id="header-watchlist-btn"
            onClick={onOpenWatchlist}
            className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
              isDarkMode 
                ? 'bg-[#191f2b] border-[#293245] text-white hover:border-[#2962ff]' 
                : 'bg-[#f1f4fb] border-[#E0E3EB] text-[#434656] hover:text-[#181c21] hover:bg-white'
            }`}
            title="Your Watchlist"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2962ff] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer relative ${
                isDarkMode 
                  ? 'bg-[#191f2b] border-[#293245] text-white hover:border-[#2962ff]' 
                  : 'bg-[#f1f4fb] border-[#E0E3EB] text-[#434656] hover:text-[#181c21]'
              }`}
              title="Market alerts and notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#089981] rounded-full"></span>
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border p-3 z-50 text-left animate-in fade-in zoom-in-95 duration-150 ${
                  isDarkMode 
                    ? 'bg-[#151922] border-[#293245] text-white' 
                    : 'bg-white border-[#E0E3EB] text-[#181c21]'
                }`}>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10">
                    <span className="font-bold text-xs uppercase tracking-wider">Trading Alerts</span>
                    <span className="text-[10px] text-[#089981] font-mono">Live</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="font-bold text-emerald-500">S&P 500 (SPX) ATH Alert</div>
                      <p className="text-[11px] opacity-80">Index crossed above 5,660 resistance target.</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="font-bold text-blue-400">Fed Interest Rate Decision</div>
                      <p className="text-[11px] opacity-80">FOMC announcement scheduled for 2:00 PM EST.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Search button on mobile */}
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="xl:hidden p-2 rounded-xl text-[#8e94a8] hover:text-white"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Sign In */}
          <button
            id="header-signin-btn"
            onClick={() => onOpenAuth('signin')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#0049db] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#8e94a8] hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 py-4 space-y-3 ${
          isDarkMode ? 'bg-[#11151c] border-[#232936]' : 'bg-white border-[#E0E3EB]'
        }`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 font-semibold text-sm"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenAuth('signin');
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 py-2 bg-[#2962ff] text-white font-bold rounded-xl text-center"
          >
            Sign In / Register
          </button>
        </div>
      )}
    </header>
  );
};
