import React, { useState, useEffect, useCallback } from 'react';
import { 
  MarketCategory, 
  NavigationTab, 
  MarketItem,
  PriceAlert
} from './types';
import { initialMarketData } from './data/marketData';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { HeroSection } from './components/HeroSection';
import { FeaturedCards } from './components/FeaturedCards';
import { MarketTable } from './components/MarketTable';
import { SuperchartModal } from './components/SuperchartModal';
import { ProductsView } from './components/ProductsView';
import { CommunityView } from './components/CommunityView';
import { BrokersView } from './components/BrokersView';
import { MoreView } from './components/MoreView';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // MarketView Theme state (default Light Theme)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('marketview_theme');
    // Ensure light theme is active as requested
    if (saved === 'dark') {
      localStorage.setItem('marketview_theme', 'light');
      return false;
    }
    return saved === 'dark';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('marketview_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Sync dark class on html root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Navigation & Category states
  const [activeTab, setActiveTab] = useState<NavigationTab>('markets');
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('indices');
  const [selectedRegion, setSelectedRegion] = useState<string>('US');

  // Market Data state
  const [marketItems, setMarketItems] = useState<MarketItem[]>(initialMarketData);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);

  // User Watchlist & Interaction state
  const [favorites, setFavorites] = useState<string[]>(['spx', 'ndx', 'btc']);
  const [selectedItemForChart, setSelectedItemForChart] = useState<MarketItem | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Keyboard Shortcuts (1-6 for tabs, ⌘K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === '1') setSelectedCategory('indices');
      else if (e.key === '2') setSelectedCategory('stocks');
      else if (e.key === '3') setSelectedCategory('crypto');
      else if (e.key === '4') setSelectedCategory('futures');
      else if (e.key === '5') setSelectedCategory('forex');
      else if (e.key === '6') setSelectedCategory('bonds');
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated Live Market Ticker Engine
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setMarketItems((prevItems) => {
        const countToUpdate = Math.floor(Math.random() * 2) + 1;
        const newItems = [...prevItems];

        for (let i = 0; i < countToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * newItems.length);
          const target = newItems[randomIndex];
          if (!target) continue;

          // Subtle delta
          const pctDelta = (Math.random() - 0.49) * 0.003;
          const newPrice = Math.max(0.01, target.price * (1 + pctDelta));
          const newChange = target.change + (newPrice - target.price);
          const newChangePercent = target.prevClose 
            ? ((newPrice - target.prevClose) / target.prevClose) * 100 
            : target.changePercent;

          // Formatted price string
          let formatted = newPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: target.category === 'forex' ? 4 : target.price < 1 ? 3 : 2
          });
          if (target.category === 'stocks' || target.category === 'crypto' || target.symbol === 'GC1!' || target.symbol === 'CL1!') {
            formatted = `$${formatted}`;
          } else if (target.category === 'bonds') {
            formatted = `${newPrice.toFixed(3)}%`;
          }

          const newSparkline = [...target.sparkline.slice(1), target.sparkline[target.sparkline.length - 1] + (pctDelta > 0 ? 1 : -1)];

          newItems[randomIndex] = {
            ...target,
            price: newPrice,
            priceFormatted: formatted,
            change: newChange,
            changePercent: newChangePercent,
            high24h: Math.max(target.high24h, newPrice),
            low24h: Math.min(target.low24h, newPrice),
            sparkline: newSparkline,
            lastUpdated: Date.now(),
            tickDirection: pctDelta >= 0 ? 'up' : 'down'
          };
        }

        return newItems;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  // Keep modal item in sync with live data
  useEffect(() => {
    if (selectedItemForChart) {
      const updated = marketItems.find((i) => i.id === selectedItemForChart.id);
      if (updated) setSelectedItemForChart(updated);
    }
  }, [marketItems]);

  // Favorite toggle handlers
  const handleToggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
  };

  // Filter items by current selected category and region
  const categoryItems = marketItems.filter((item) => {
    if (item.category !== selectedCategory) return false;
    if (selectedRegion !== 'All' && item.region && item.region !== selectedRegion) {
      return item.region === selectedRegion;
    }
    return true;
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors selection:bg-[#2962ff] selection:text-white ${
      isDarkMode ? 'dark bg-[#0b0e14] text-[#f0f3fa]' : 'bg-[#f7f9ff] text-[#181c21]'
    }`}>
      
      {/* Top Streaming Institutional Ticker Tape */}
      <TickerTape
        items={marketItems}
        onSelectItem={(item) => setSelectedItemForChart(item)}
        isDarkMode={isDarkMode}
      />

      {/* 1. Header with Dark Mode & Alerts */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={handleOpenAuth}
        watchlistCount={favorites.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        isLiveUpdating={isLiveUpdating}
        toggleLiveUpdating={() => setIsLiveUpdating(!isLiveUpdating)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* 2. Main Body Content */}
      <main className="w-full pt-20 flex-1 flex flex-col">
        
        {activeTab === 'markets' && (
          <div className="flex flex-col w-full animate-in fade-in duration-150">
            {/* Hero Section with Title, Region Flag, Sentiment, Category Pills */}
            <HeroSection
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              isDarkMode={isDarkMode}
            />

            {/* Featured Top 3 Cards Section with Interactive Scrubbers */}
            <section className={`w-full py-5 ${isDarkMode ? 'bg-[#0b0e14]' : 'bg-[#f7f9ff]'}`}>
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
                <FeaturedCards
                  items={categoryItems.length >= 3 ? categoryItems : marketItems.filter(i => i.category === selectedCategory)}
                  onSelectItem={(item) => setSelectedItemForChart(item)}
                  isDarkMode={isDarkMode}
                />
              </div>
            </section>

            {/* Market Data Table Section with Range Bars, CSV, Density & Views */}
            <MarketTable
              items={categoryItems.length > 0 ? categoryItems : marketItems.filter(i => i.category === selectedCategory)}
              category={selectedCategory}
              onSelectItem={(item) => setSelectedItemForChart(item)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onViewAllCategory={() => {
                setSelectedRegion('All');
              }}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {activeTab === 'products' && (
          <ProductsView
            items={marketItems}
            onSelectItem={(item) => setSelectedItemForChart(item)}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeTab === 'brokers' && (
          <BrokersView />
        )}

        {activeTab === 'more' && (
          <MoreView />
        )}

      </main>

      {/* 3. Footer */}
      <Footer
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('markets');
        }}
        isDarkMode={isDarkMode}
      />

      {/* 4. Superchart Technical Analysis Modal */}
      <SuperchartModal
        item={selectedItemForChart}
        onClose={() => setSelectedItemForChart(null)}
        isFavorite={selectedItemForChart ? favorites.includes(selectedItemForChart.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isDarkMode={isDarkMode}
      />

      {/* 5. Symbol Search Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={marketItems}
        onSelectItem={(item) => setSelectedItemForChart(item)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        isDarkMode={isDarkMode}
      />

      {/* 6. Watchlist Side Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        items={marketItems}
        favorites={favorites}
        onSelectItem={(item) => setSelectedItemForChart(item)}
        onRemoveFavorite={(id) => handleToggleFavorite(id)}
        isDarkMode={isDarkMode}
      />

      {/* 7. Authentication Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signin' })}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
