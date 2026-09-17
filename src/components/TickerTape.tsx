import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, Clock, Globe, Pause, Play } from 'lucide-react';
import { MarketItem } from '../types';

interface TickerTapeProps {
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  isDarkMode?: boolean;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ items, onSelectItem, isDarkMode = false }) => {
  const tapeItems = items.slice(0, 10);
  const [time, setTime] = useState({
    ny: '',
    london: '',
    tokyo: '',
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTime({
        ny: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        london: now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour12: false, hour: '2-digit', minute: '2-digit' }),
        tokyo: now.toLocaleTimeString('en-JP', { timeZone: 'Asia/Tokyo', hour12: false, hour: '2-digit', minute: '2-digit' }),
      });
    };
    updateClocks();
    const timer = setInterval(updateClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      id="pro-ticker-tape" 
      className={`w-full text-[11px] font-mono border-b select-none z-40 transition-colors ${
        isDarkMode 
          ? 'bg-[#0e1117] text-white border-[#232936]' 
          : 'bg-[#f0f3fa] text-[#181c21] border-[#E0E3EB]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between h-8">
        
        {/* Left: Market Status Badge */}
        <div className={`flex items-center gap-2.5 shrink-0 pr-4 border-r ${
          isDarkMode ? 'border-[#2d3136]' : 'border-[#E0E3EB]'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]"></span>
          </span>
          <span className={`font-bold tracking-wider text-[10px] ${
            isDarkMode ? 'text-[#dce1ff]' : 'text-[#089981]'
          }`}>
            MARKET OPEN
          </span>
          <span className={`text-[10px] hidden lg:inline ${
            isDarkMode ? 'text-[#8e94a8]' : 'text-[#6A6D78]'
          }`}>
            NYSE • NASDAQ • CME
          </span>
        </div>

        {/* Center: Live Streaming Ticker Strip */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-5 px-4">
          {tapeItems.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all whitespace-nowrap focus:outline-none ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                } ${
                  item.tickDirection === 'up' ? 'flash-up' : item.tickDirection === 'down' ? 'flash-down' : ''
                }`}
              >
                <span className={`font-bold ${isDarkMode ? 'text-white/95' : 'text-[#181c21]'}`}>{item.symbol}</span>
                <span className={`tabular-nums font-medium ${isDarkMode ? 'text-[#eef1f8]' : 'text-[#434656]'}`}>{item.priceFormatted}</span>
                <span className={`flex items-center text-[10px] font-semibold tabular-nums ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}>
                  {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: World Time Clocks */}
        <div className={`hidden xl:flex items-center gap-4 shrink-0 pl-4 border-l text-[10px] ${
          isDarkMode ? 'border-[#2d3136] text-[#a0a4b8]' : 'border-[#E0E3EB] text-[#6A6D78]'
        }`}>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-[#2962ff]" />
            <span>NYC: <strong className={`font-mono ${isDarkMode ? 'text-white' : 'text-[#181c21]'}`}>{time.ny}</strong></span>
          </div>
          <span>LON: <strong className={`font-mono ${isDarkMode ? 'text-white' : 'text-[#181c21]'}`}>{time.london}</strong></span>
          <span>TYO: <strong className={`font-mono ${isDarkMode ? 'text-white' : 'text-[#181c21]'}`}>{time.tokyo}</strong></span>
        </div>

      </div>
    </div>
  );
};
