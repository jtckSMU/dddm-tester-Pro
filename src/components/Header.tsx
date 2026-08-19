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
  Activity
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
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      className={`fixed top-0 w-full z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E0E3EB] shadow-xs' 
          : 'bg-white/95 backdrop-blur-md border-b border-[#E0E3EB]'
      }`}
    >
      <div className="h-16 max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 md:gap-6">
        
        {/* Left: Brand + Search + Nav */}
        <div className="flex items-center gap-6 lg:gap-8 flex-1">
          
          {/* Logo */}
          <button 
            id="brand-logo-btn"
            onClick={() => setActiveTab('markets')}
            className="flex items-center gap-2.5 pr-4 border-r border-[#E0E3EB] focus:outline-none group text-left"
          >
            <div className="w-8 h-8 bg-[#2962ff] rounded-sm flex items-center justify-center text-white shadow-xs group-hover:bg-[#0049db] transition-colors">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-[18px] text-[#181c21] tracking-tight group-hover:text-[#0049db] transition-colors">
              MarketView
            </span>
          </button>

          {/* Search Bar */}
          <div 
            id="header-search-trigger"
            onClick={onOpenSearch}
            className="hidden xl:flex flex-1 max-w-md items-center bg-[#f1f4fb] px-4 py-2 rounded-lg group focus-within:ring-2 focus-within:ring-[#2962ff]/20 hover:bg-[#ebeef5] transition-all cursor-pointer border border-transparent hover:border-[#c3c5d8]"
          >
            <Search className="w-4 h-4 text-[#434656] mr-2 shrink-0 group-hover:text-[#181c21] transition-colors" />
            <span className="text-xs text-[#6A6D78] select-none flex-1 truncate">
              Search markets, news and symbols...
            </span>
            <kbd className="hidden 2xl:inline-block text-[10px] font-mono bg-white text-[#6A6D78] px-1.5 py-0.5 rounded border border-[#E0E3EB] shadow-2xs">
              ⌘K
            </kbd>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-[14px] transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#0049db] font-semibold'
                      : 'text-[#434656] hover:text-[#181c21] font-normal'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-[#0049db] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Feed Status Pill */}
          <button
            id="live-feed-toggle-btn"
            onClick={toggleLiveUpdating}
            title={isLiveUpdating ? "Live market ticks: Active" : "Live market ticks: Paused"}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isLiveUpdating 
                ? 'bg-emerald-50 text-[#089981] border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveUpdating ? 'bg-[#089981] animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[11px] font-semibold">{isLiveUpdating ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Watchlist Quick Button */}
          <button
            id="header-watchlist-btn"
            onClick={onOpenWatchlist}
            className="relative p-2 text-[#434656] hover:text-[#181c21] hover:bg-[#f1f4fb] rounded-lg transition-colors"
            title="Your Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Search button on smaller screens */}
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            className="xl:hidden p-2 text-[#434656] hover:text-[#181c21] hover:bg-[#f1f4fb] rounded-lg transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Sign In Button */}
          <button
            id="header-signin-btn"
            onClick={() => onOpenAuth('signin')}
            className="hidden md:flex text-[14px] font-medium text-[#434656] hover:text-[#181c21] px-3 py-2 transition-colors rounded-lg hover:bg-[#f1f4fb]"
          >
            Sign in
          </button>

          {/* Get Started Button */}
          <button
            id="header-getstarted-btn"
            onClick={() => onOpenAuth('signup')}
            className="bg-[#2962ff] text-white text-[14px] font-semibold px-4 py-2 rounded-lg hover:bg-[#0049db] active:scale-[0.98] transition-all shadow-xs"
          >
            Get started
          </button>

          {/* Profile Icon */}
          <button
            id="header-profile-btn"
            onClick={() => onOpenAuth('signin')}
            className="w-8 h-8 rounded-full bg-[#0049db] flex items-center justify-center text-white ml-1 hover:ring-2 hover:ring-[#2962ff]/30 transition-all focus:outline-none"
            title="User Profile"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#434656] hover:text-[#181c21] hover:bg-[#f1f4fb] rounded-lg transition-colors ml-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E0E3EB] px-4 py-4 space-y-2 shadow-lg">
          <div 
            onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
            className="flex items-center bg-[#f1f4fb] px-3 py-2.5 rounded-lg mb-3"
          >
            <Search className="w-4 h-4 text-[#434656] mr-2" />
            <span className="text-xs text-[#6A6D78]">Search markets, news, symbols...</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? 'bg-[#0049db]/10 text-[#0049db] font-semibold' 
                    : 'text-[#434656] hover:bg-[#f1f4fb]'
                }`}
              >
                <span>{item.label}</span>
                {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-[#0049db]" />}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E0E3EB] flex items-center justify-between">
            <button
              onClick={() => { onOpenAuth('signin'); setMobileMenuOpen(false); }}
              className="text-sm font-medium text-[#434656] py-2 px-3"
            >
              Sign in
            </button>
            <button
              onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
              className="bg-[#2962ff] text-white text-sm font-semibold px-4 py-2 rounded-lg"
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
