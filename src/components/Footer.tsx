import React from 'react';
import { TrendingUp } from 'lucide-react';
import { NavigationTab, MarketCategory } from '../types';

interface FooterProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectCategory?: (category: MarketCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onSelectCategory }) => {
  return (
    <footer id="main-footer" className="w-full bg-white border-t border-[#E0E3EB] py-12 md:py-16 mt-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 sm:gap-12 mb-12 sm:mb-16">
          
          {/* Brand Info (Spans 2 columns) */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-7 h-7 bg-[#2962ff] rounded flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-[18px] text-[#181c21] tracking-tight">
                MarketView
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6A6D78] leading-relaxed max-w-xs">
              The world's most advanced financial visualization platform for traders and investors.
            </p>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A6D78]">
              Products
            </span>
            <button 
              onClick={() => onNavigateTab('products')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Supercharts
            </button>
            <button 
              onClick={() => onNavigateTab('products')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Screeners
            </button>
            <button 
              onClick={() => onNavigateTab('products')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Heatmaps
            </button>
          </div>

          {/* Community Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A6D78]">
              Community
            </span>
            <button 
              onClick={() => onNavigateTab('community')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Ideas
            </button>
            <button 
              onClick={() => onNavigateTab('community')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Scripts
            </button>
            <button 
              onClick={() => onNavigateTab('community')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Streams
            </button>
          </div>

          {/* Market Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A6D78]">
              Market
            </span>
            <button 
              onClick={() => {
                onNavigateTab('markets');
                if (onSelectCategory) onSelectCategory('indices');
              }} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Indices
            </button>
            <button 
              onClick={() => {
                onNavigateTab('markets');
                if (onSelectCategory) onSelectCategory('crypto');
              }} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Crypto
            </button>
            <button 
              onClick={() => {
                onNavigateTab('markets');
                if (onSelectCategory) onSelectCategory('forex');
              }} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Forex
            </button>
          </div>

          {/* Company Column */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A6D78]">
              Company
            </span>
            <button 
              onClick={() => onNavigateTab('more')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              About
            </button>
            <button 
              onClick={() => onNavigateTab('more')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Features
            </button>
            <button 
              onClick={() => onNavigateTab('more')} 
              className="text-xs sm:text-sm text-[#434656] hover:text-[#0049db] transition-colors text-left"
            >
              Pricing
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-[#E0E3EB] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-[#6A6D78]">
            © 2024 MarketView Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button className="text-xs sm:text-sm text-[#6A6D78] hover:text-[#181c21] transition-colors">
              Terms
            </button>
            <button className="text-xs sm:text-sm text-[#6A6D78] hover:text-[#181c21] transition-colors">
              Privacy
            </button>
            <button className="text-xs sm:text-sm text-[#6A6D78] hover:text-[#181c21] transition-colors">
              Cookies
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
