import React from 'react';
import { TrendingUp, Globe2, ShieldCheck, Terminal } from 'lucide-react';
import { NavigationTab, MarketCategory } from '../types';

interface FooterProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectCategory?: (category: MarketCategory) => void;
  isDarkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigateTab, 
  onSelectCategory,
  isDarkMode = false 
}) => {
  return (
    <footer 
      id="main-footer" 
      className={`w-full border-t py-12 md:py-16 mt-12 transition-colors ${
        isDarkMode 
          ? 'bg-[#0b0e14] border-[#232936] text-[#8e94a8]' 
          : 'bg-white border-[#E0E3EB] text-[#434656]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 sm:gap-12 mb-12 sm:mb-16">
          
          {/* Brand Info (Spans 2 columns) */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-7 h-7 bg-[#2962ff] rounded-md flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className={`font-bold text-[18px] tracking-tight ${
                isDarkMode ? 'text-white' : 'text-[#181c21]'
              }`}>
                Market<span className="text-[#2962ff]">View</span> Pro
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs opacity-80">
              Institutional tick feeds, technical charting engines, and multi-asset market analytics.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
              <span>SOC2 Certified • 99.99% Feed Uptime</span>
            </div>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              Products
            </span>
            <button 
              onClick={() => onNavigateTab('products')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Supercharts
            </button>
            <button 
              onClick={() => onNavigateTab('products')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Stock Screener
            </button>
            <button 
              onClick={() => onNavigateTab('products')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Market Heatmaps
            </button>
          </div>

          {/* Markets Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              Markets
            </span>
            <button 
              onClick={() => onSelectCategory && onSelectCategory('indices')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Indices & Sectors
            </button>
            <button 
              onClick={() => onSelectCategory && onSelectCategory('stocks')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              US & Global Stocks
            </button>
            <button 
              onClick={() => onSelectCategory && onSelectCategory('crypto')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Crypto Spot & Perps
            </button>
          </div>

          {/* Community Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              Community
            </span>
            <button 
              onClick={() => onNavigateTab('community')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Trading Ideas
            </button>
            <button 
              onClick={() => onNavigateTab('community')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Live Chat & Streams
            </button>
          </div>

          {/* Brokers Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
              Brokers
            </span>
            <button 
              onClick={() => onNavigateTab('brokers')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Top Rated Brokers
            </button>
            <button 
              onClick={() => onNavigateTab('brokers')} 
              className="text-xs sm:text-sm hover:text-[#2962ff] transition-colors text-left"
            >
              Broker Awards 2026
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-75">
          <div>
            © 2026 MarketView Inc. Real-time market quotes powered by BATS & CME.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Disclaimer</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
