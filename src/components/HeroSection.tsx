import React, { useState } from 'react';
import { ChevronDown, Check, Globe2, Sparkles, Activity, TrendingUp, ShieldAlert, BarChart3 } from 'lucide-react';
import { MarketCategory } from '../types';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  isDarkMode?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
  isDarkMode = false,
}) => {
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  const categories: { id: MarketCategory; label: string; count: number; hotkey: string }[] = [
    { id: 'indices', label: 'Indices', count: 8, hotkey: '1' },
    { id: 'stocks', label: 'Stocks', count: 14, hotkey: '2' },
    { id: 'crypto', label: 'Crypto', count: 6, hotkey: '3' },
    { id: 'futures', label: 'Futures', count: 5, hotkey: '4' },
    { id: 'forex', label: 'Forex', count: 7, hotkey: '5' },
    { id: 'bonds', label: 'Bonds', count: 4, hotkey: '6' },
  ];

  const regions = [
    { id: 'All', label: 'Global Markets', flag: '🌐' },
    { id: 'US', label: 'United States', flag: '🇺🇸' },
    { id: 'Europe', label: 'Europe', flag: '🇪🇺' },
    { id: 'Asia-Pacific', label: 'Asia-Pacific', flag: '🇯🇵' },
    { id: 'Americas', label: 'Americas', flag: '🌎' },
  ];

  const currentRegion = regions.find((r) => r.id === selectedRegion) || regions[1];

  return (
    <section 
      id="hero-section" 
      className={`w-full pt-10 md:pt-14 pb-8 border-b transition-colors ${
        isDarkMode 
          ? 'bg-[#0e1117] border-[#232936] text-white' 
          : 'bg-[#f7f9ff] border-[#E0E3EB] text-[#181c21]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
        
        {/* Title with dropdown chevron */}
        <div className="relative inline-block mb-3">
          <button
            id="hero-market-region-toggle"
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
            className={`group flex items-center justify-center gap-2 font-bold text-3xl sm:text-4xl md:text-[44px] tracking-tight transition-colors focus:outline-none ${
              isDarkMode 
                ? 'text-white hover:text-[#5282ff]' 
                : 'text-[#181c21] hover:text-[#0049db]'
            }`}
          >
            <span>Markets, everywhere</span>
            <div className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full border transition-all ${
              isDarkMode 
                ? 'bg-[#1b202c] border-[#2a3142] text-[#8ea4d2] group-hover:border-[#5282ff]' 
                : 'bg-white border-[#E0E3EB] text-[#434656] group-hover:border-[#0049db]'
            }`}>
              <span>{currentRegion.flag}</span>
              <span className="hidden sm:inline">{currentRegion.label}</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isRegionDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </button>

          {/* Region selector dropdown */}
          {isRegionDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsRegionDropdownOpen(false)} 
              />
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl shadow-2xl border p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150 ${
                isDarkMode 
                  ? 'bg-[#171b26] border-[#2a3142] text-white' 
                  : 'bg-white border-[#E0E3EB] text-[#181c21]'
              }`}>
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] flex items-center gap-1.5 border-b border-[#E0E3EB]/20 mb-1">
                  <Globe2 className="w-3.5 h-3.5" />
                  Select Geographic Region
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
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition-colors ${
                        isSelected 
                          ? 'bg-[#2962ff] text-white font-semibold' 
                          : isDarkMode 
                            ? 'hover:bg-[#232936] text-white/90' 
                            : 'hover:bg-[#f1f4fb] text-[#181c21]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{reg.flag}</span>
                        <span>{reg.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Subtitle description */}
        <p className={`text-xs sm:text-sm max-w-xl mx-auto mb-6 ${
          isDarkMode ? 'text-[#8e94a8]' : 'text-[#6A6D78]'
        }`}>
          Real-time institutional tick streaming across equities, indices, commodities, currencies, and fixed income.
        </p>

        {/* Market Breadth & Sentiment Mini-Bar */}
        <div className={`max-w-2xl mx-auto mb-6 p-2 sm:p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-[11px] ${
          isDarkMode 
            ? 'bg-[#151922] border-[#262c3a] text-[#8e94a8]' 
            : 'bg-white border-[#E0E3EB] text-[#434656]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
              Adv: 64%
            </span>
            <span className="text-[#8e94a8]">/</span>
            <span className="font-semibold text-rose-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#F23645]"></span>
              Dec: 31%
            </span>
            <span className="text-[#8e94a8] hidden sm:inline">•</span>
            <span className="hidden sm:inline">Unch: 5%</span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>VIX: <strong className="text-emerald-500">13.82</strong> (-3.15%)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#2962ff]/10 text-[#2962ff]">
              BULLISH BIAS
            </span>
          </div>
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
                className={`group px-4 py-2 rounded-full text-xs sm:text-[14px] transition-all cursor-pointer select-none flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#2962ff] text-white font-semibold shadow-md ring-2 ring-[#2962ff]/30'
                    : isDarkMode 
                      ? 'bg-[#1b202c] text-[#8ea4d2] hover:bg-[#262e40] hover:text-white border border-[#2a3142]' 
                      : 'bg-[#e5e8ef] text-[#434656] font-medium hover:bg-[#dfe2e9] hover:text-[#181c21]'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected 
                    ? 'bg-white/25 text-white' 
                    : isDarkMode ? 'bg-[#2a3142] text-[#8e94a8]' : 'bg-black/10 text-[#434656]'
                }`}>
                  {cat.count}
                </span>
                <kbd className={`hidden md:inline-block text-[9px] font-mono px-1 rounded opacity-60 ${
                  isSelected ? 'bg-white/20' : 'bg-black/10'
                }`}>
                  {cat.hotkey}
                </kbd>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
