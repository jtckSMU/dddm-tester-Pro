import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Activity, TrendingUp, Maximize2, BarChart2 } from 'lucide-react';
import { MarketItem } from '../types';

interface FeaturedCardsProps {
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  isDarkMode?: boolean;
}

export const FeaturedCards: React.FC<FeaturedCardsProps> = ({ 
  items, 
  onSelectItem, 
  isDarkMode = false 
}) => {
  const topItems = items.slice(0, 3);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<{ [cardId: string]: number | null }>({});

  const renderInteractiveSparkline = (item: MarketItem) => {
    const points = item.sparkline || [];
    if (points.length === 0) return null;

    const width = 140;
    const height = 52;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const isPositive = item.change >= 0;
    const strokeColor = isPositive ? '#089981' : '#F23645';
    const gradientId = `grad-${item.id}-${isDarkMode ? 'dark' : 'light'}`;

    const coordinates = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - 4 - ((val - min) / range) * (height - 8);
      return { x, y, val };
    });

    const pathData = coordinates
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
      .join(' ');

    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;
    const hoveredIdx = hoveredPointIndex[item.id] ?? null;

    return (
      <div className="relative w-full h-14 select-none">
        <svg 
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredPointIndex(prev => ({ ...prev, [item.id]: null }))}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={isDarkMode ? 0.35 : 0.2} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <path d={areaData} fill={`url(#${gradientId})`} />
          <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" />

          {/* Interactive Scrubbing Points */}
          {coordinates.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIdx === i ? 4 : 2.5}
              fill={hoveredIdx === i ? strokeColor : 'transparent'}
              stroke={hoveredIdx === i ? '#ffffff' : 'transparent'}
              strokeWidth="1.5"
              className="cursor-crosshair transition-all"
              onMouseEnter={() => setHoveredPointIndex(prev => ({ ...prev, [item.id]: i }))}
            />
          ))}
        </svg>

        {hoveredIdx !== null && (
          <div 
            className="absolute -top-6 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-lg pointer-events-none -translate-x-1/2 bg-black text-white"
            style={{ left: `${(hoveredIdx / (points.length - 1)) * 100}%` }}
          >
            {item.priceFormatted}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="featured-market-cards" className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {topItems.map((item, idx) => {
        const isPositive = item.change >= 0;
        const badgeColor = item.badgeBgColor || (idx === 0 ? '#F23645' : '#2962ff');
        const badgeText = item.badgeText || item.symbol.slice(0, 3);

        // 52-week calculation
        const low52 = item.low52w || item.low24h * 0.85;
        const high52 = item.high52w || item.high24h * 1.15;
        const pos52Percent = Math.min(100, Math.max(5, ((item.price - low52) / (high52 - low52 || 1)) * 100));

        return (
          <div
            key={item.id}
            id={`featured-card-${item.symbol.toLowerCase()}`}
            onClick={() => onSelectItem(item)}
            className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 group transition-all duration-200 cursor-pointer border relative overflow-hidden ${
              isDarkMode 
                ? 'bg-[#151922] border-[#262c3a] hover:border-[#3d475d] hover:bg-[#1a202c] shadow-lg' 
                : 'bg-white border-[#E0E3EB] hover:border-[#b6c4ff] hover:bg-[#f8faff] shadow-sm hover:shadow-md'
            }`}
          >
            {/* Top Row: Symbol & Badges */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-sm shrink-0 select-none"
                  style={{ backgroundColor: badgeColor }}
                >
                  {badgeText}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-[18px] tracking-tight truncate group-hover:text-[#2962ff] transition-colors ${
                      isDarkMode ? 'text-white' : 'text-[#181c21]'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#8e94a8]">
                    <span className="font-mono font-semibold">{item.symbol}</span>
                    <span>•</span>
                    <span className="text-[10px] uppercase font-mono">{item.exchange || 'INDEX'}</span>
                  </div>
                </div>
              </div>

              {/* Technical Rating Badge */}
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  item.technicalRating === 'Strong Buy' 
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' 
                    : item.technicalRating === 'Buy' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {item.technicalRating}
                </span>
                <span className="text-[10px] text-[#8e94a8] mt-1 font-mono">
                  Vol: {item.volume}
                </span>
              </div>
            </div>

            {/* Price & Sparkline Graphic */}
            <div className="flex justify-between items-end pt-2">
              <div className="flex flex-col">
                <span className={`tabular-nums text-[26px] font-bold tracking-tight font-mono ${
                  isDarkMode ? 'text-white' : 'text-[#181c21]'
                }`}>
                  {item.priceFormatted}
                </span>
                <span 
                  className={`tabular-nums text-xs font-semibold flex items-center gap-0.5 mt-0.5 ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {item.change.toFixed(2)} ({isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%)
                  </span>
                </span>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="w-32">
                {renderInteractiveSparkline(item)}
              </div>
            </div>

            {/* Bottom 52-Week Range Bar */}
            <div className={`pt-3 border-t flex flex-col gap-1.5 text-[10px] font-mono ${
              isDarkMode ? 'border-[#262c3a] text-[#8e94a8]' : 'border-[#E0E3EB] text-[#6A6D78]'
            }`}>
              <div className="flex justify-between items-center">
                <span>52W L: ${low52.toFixed(1)}</span>
                <span className="text-[10px] font-semibold text-[#2962ff]">
                  Position: {pos52Percent.toFixed(0)}%
                </span>
                <span>52W H: ${high52.toFixed(1)}</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden relative ${
                isDarkMode ? 'bg-[#232936]' : 'bg-[#e5e8ef]'
              }`}>
                <div 
                  className="h-full bg-gradient-to-r from-[#2962ff] to-[#089981] rounded-full transition-all duration-300"
                  style={{ width: `${pos52Percent}%` }}
                />
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
