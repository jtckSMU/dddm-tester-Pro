import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Activity, TrendingUp, Maximize2 } from 'lucide-react';
import { MarketItem } from '../types';

interface FeaturedCardsProps {
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
}

export const FeaturedCards: React.FC<FeaturedCardsProps> = ({ items, onSelectItem }) => {
  const topItems = items.slice(0, 3);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  // SVG Sparkline path renderer with gradient area
  const renderSparkline = (points: number[], isPositive: boolean, cardId: string) => {
    if (!points || points.length === 0) return null;
    const width = 120;
    const height = 48;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - 4 - ((val - min) / range) * (height - 8);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;
    const strokeColor = isPositive ? '#089981' : '#F23645';
    const gradientId = `card-grad-${cardId}`;

    return (
      <svg 
        className="w-full h-full stroke-linecap-round stroke-linejoin-round overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path
          d={areaData}
          fill={`url(#${gradientId})`}
        />

        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
        />
      </svg>
    );
  };

  return (
    <div id="featured-market-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {topItems.map((item, idx) => {
        const isPositive = item.change >= 0;
        const badgeColor = item.badgeBgColor || (idx === 0 ? '#F23645' : '#0049db');
        const badgeText = item.badgeText || item.symbol.slice(0, 3);

        // 52-week position
        const low52 = item.low52w || item.low24h * 0.85;
        const high52 = item.high52w || item.high24h * 1.15;
        const pos52Percent = Math.min(100, Math.max(5, ((item.price - low52) / (high52 - low52 || 1)) * 100));

        return (
          <div
            key={item.id}
            id={`featured-card-${item.symbol.toLowerCase()}`}
            onClick={() => onSelectItem(item)}
            onMouseEnter={() => setHoveredCardIndex(idx)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            className="bg-white rounded-xl p-6 flex flex-col justify-between gap-4 group hover:bg-[#f1f4fb] hover:border-[#b6c4ff] transition-all duration-200 cursor-pointer border border-[#E0E3EB] shadow-xs relative overflow-hidden"
          >
            {/* Top Indicator bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white shadow-2xs shrink-0 select-none"
                  style={{ backgroundColor: badgeColor }}
                >
                  {badgeText}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[18px] text-[#181c21] group-hover:text-[#0049db] transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6A6D78]">
                    <span className="font-mono font-medium">{item.symbol}</span>
                    {item.exchange && (
                      <>
                        <span>•</span>
                        <span className="text-[10px] uppercase font-mono tracking-tight">{item.exchange}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Consensus Tag */}
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                item.technicalRating === 'Strong Buy' ? 'bg-emerald-50 text-[#089981]' :
                item.technicalRating === 'Buy' ? 'bg-emerald-50 text-[#089981]' :
                item.technicalRating === 'Sell' ? 'bg-red-50 text-[#F23645]' :
                'bg-gray-100 text-[#434656]'
              }`}>
                {item.technicalRating}
              </span>
            </div>

            {/* Price & Sparkline Row */}
            <div className="flex justify-between items-end mt-2 pt-2 border-t border-transparent group-hover:border-[#E0E3EB]/50 transition-colors">
              <div className="flex flex-col">
                <span className="tabular-nums text-[24px] font-semibold text-[#181c21] tracking-tight">
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

              {/* Sparkline Graphic */}
              <div className="w-28 h-12 relative opacity-80 group-hover:opacity-100 transition-opacity">
                {renderSparkline(item.sparkline, isPositive, item.id)}
              </div>
            </div>

            {/* 52-Week Range Micro Bar */}
            <div className="pt-2 border-t border-[#E0E3EB]/60 flex items-center justify-between text-[10px] text-[#6A6D78] font-mono">
              <span>52W L: {low52.toFixed(1)}</span>
              <div className="flex-1 mx-2 h-1 bg-[#e5e8ef] rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-[#0049db] rounded-full"
                  style={{ width: `${pos52Percent}%` }}
                />
              </div>
              <span>52W H: {high52.toFixed(1)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
