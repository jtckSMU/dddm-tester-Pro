import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, ArrowUpRight, Star } from 'lucide-react';
import { MarketItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isDarkMode?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  favorites,
  onToggleFavorite,
  isDarkMode = false,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.symbol.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.sector && item.sector.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
        isDarkMode 
          ? 'bg-[#151922] border-[#293245] text-white' 
          : 'bg-white border-[#E0E3EB] text-[#181c21]'
      }`}>
        
        {/* Search Input Bar */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          isDarkMode ? 'border-[#293245]' : 'border-[#E0E3EB]'
        }`}>
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a symbol, company, ETF or index (e.g. SPX, AAPL, BTC)..."
            className="w-full text-base bg-transparent border-none focus:outline-none placeholder:text-[#8e94a8]"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#8e94a8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
          {results.length === 0 ? (
            <div className="p-8 text-center text-[#8e94a8] text-sm">
              No securities found matching "{query}".
            </div>
          ) : (
            results.map((item) => {
              const isPositive = item.change >= 0;
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className={`p-3.5 sm:px-5 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isDarkMode ? 'hover:bg-[#1f2533]' : 'hover:bg-[#f8faff]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id, e);
                      }}
                      className="text-[#8e94a8] hover:text-amber-400 p-1"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: item.badgeBgColor || '#2962ff' }}
                    >
                      {item.badgeText || item.symbol.slice(0, 2)}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-sm flex items-center gap-2 truncate">
                        <span>{item.symbol}</span>
                        <span className="text-xs font-normal text-[#8e94a8] truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#8e94a8] uppercase">
                        {item.category} • {item.exchange || 'NASDAQ'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-sm">{item.priceFormatted}</div>
                    <div className={`text-xs font-semibold tabular-nums ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}>
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className={`p-3 text-[11px] font-mono flex items-center justify-between border-t ${
          isDarkMode ? 'bg-[#0f1218] border-[#293245] text-[#8e94a8]' : 'bg-[#f7f9ff] border-[#E0E3EB] text-[#6A6D78]'
        }`}>
          <span>Select an asset to view Superchart</span>
          <kbd className="px-1.5 py-0.5 rounded border border-black/10 dark:border-white/10">ESC to close</kbd>
        </div>

      </div>
    </div>
  );
};
