import React, { useState } from 'react';
import { ChevronDown, Check, Globe2, Sparkles } from 'lucide-react';
import { MarketCategory } from '../types';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const categories: { id: MarketCategory; label: string }[] = [
    { id: 'indices', label: 'Indices' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'bonds', label: 'Bonds' },
  ];

  const regions = [
    { id: 'All', label: 'Global Markets' },
    { id: 'US', label: 'United States' },
    { id: 'Europe', label: 'Europe' },
    { id: 'Asia-Pacific', label: 'Asia-Pacific' },
    { id: 'Americas', label: 'Americas' },
  ];

  return (
    <section id="hero-section" className="w-full pt-12 md:pt-16 pb-8 md:pb-12 bg-[#f7f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
        
        {/* Title with dropdown chevron */}
        <div className="relative inline-block mb-6">
          <button
            id="hero-market-region-toggle"
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
            className="group flex items-center justify-center gap-2 font-bold text-3xl sm:text-4xl md:text-[40px] text-[#181c21] tracking-tight hover:text-[#0049db] transition-colors focus:outline-none"
          >
            <span>Markets, everywhere</span>
            <ChevronDown 
              className={`w-8 h-8 sm:w-10 sm:h-10 text-[#181c21] group-hover:text-[#0049db] transition-transform duration-200 ${
                isRegionDropdownOpen ? 'rotate-180 text-[#0049db]' : ''
              }`} 
            />
          </button>

          {/* Region selector dropdown */}
          {isRegionDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsRegionDropdownOpen(false)} 
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-xl shadow-xl border border-[#E0E3EB] p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] flex items-center gap-1.5 border-b border-[#E0E3EB] mb-1">
                  <Globe2 className="w-3.5 h-3.5" />
                  Select Market Region
                </div>
                {regions.map((reg) => {
                  const isSelected = selectedRegion === reg.id;
                  return (
                    <button
                      key={reg.id}
                      onClick={() => {
                        onSelectRegion(reg.id);
                        setIsRegionDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-[#0049db]/10 text-[#0049db] font-semibold' 
                          : 'text-[#181c21] hover:bg-[#f1f4fb]'
                      }`}
                    >
                      <span>{reg.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#0049db]" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Category Navigation Pills */}
        <div 
          id="category-pills-nav"
          className="flex items-center justify-center gap-2 flex-wrap max-w-3xl mx-auto"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-pill-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-[14px] transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#0049db] text-white font-semibold shadow-xs hover:bg-[#003ab3]'
                    : 'bg-[#e5e8ef] text-[#434656] font-medium hover:bg-[#dfe2e9] hover:text-[#181c21]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
