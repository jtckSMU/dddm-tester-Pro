import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown, Clock, Globe } from 'lucide-react';
import { MarketItem } from '../types';

interface TickerTapeProps {
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ items, onSelectItem }) => {
  // Select key global benchmarks
  const tapeItems = items.slice(0, 10);

  return (
    <div id="pro-ticker-tape" className="w-full bg-[#181c21] text-white text-[11px] font-mono border-b border-[#2d3136] overflow-hidden select-none z-40">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center justify-between h-7">
        
        {/* Left: Market Status Badge */}
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-[#2d3136]">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse" />
          <span className="font-bold tracking-wider text-[#dce1ff] text-[10px]">US MARKET OPEN</span>
          <span className="text-[#a0a4b8] text-[10px] hidden xl:inline">NYSE • NASDAQ</span>
        </div>

        {/* Center: Scrolling / Ticker Strip */}
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-6 px-4">
          {tapeItems.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <button
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="flex items-center gap-1.5 hover:text-[#2962ff] transition-colors whitespace-nowrap focus:outline-none"
              >
                <span className="font-bold text-white/90">{item.symbol}</span>
                <span className="tabular-nums text-[#eef1f8]">{item.priceFormatted}</span>
                <span className={`flex items-center text-[10px] font-semibold tabular-nums ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}>
                  {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Breadth ratio */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 pl-4 border-l border-[#2d3136] text-[10px] text-[#a0a4b8]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            <span className="text-white font-semibold">1,842</span> Adv
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F23645]" />
            <span className="text-white font-semibold">1,024</span> Dec
          </span>
        </div>

      </div>
    </div>
  );
};
