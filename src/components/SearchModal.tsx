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
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  favorites,
  onToggleFavorite,
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
        else {
          // Trigger open via parent
        }
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div 
        id="search-dialog"
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E0E3EB] overflow-hidden z-10 flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center gap-3 bg-[#f7f9ff]">
          <Search className="w-5 h-5 text-[#0049db] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets, symbols (SPX, AAPL, BTC), sectors..."
            className="w-full bg-transparent text-sm sm:text-base text-[#181c21] placeholder:text-[#6A6D78] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#6A6D78] hover:text-[#181c21] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-white text-[#6A6D78] px-1.5 py-0.5 rounded border border-[#E0E3EB]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-[#E0E3EB] p-2">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] flex justify-between">
            <span>{query ? `Search Results (${results.length})` : 'Popular & Trending Assets'}</span>
            <span>Price / 24h</span>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#6A6D78]">
              No instruments match "{query}". Try searching for S&P 500, Apple, Bitcoin, or Nasdaq.
            </div>
          ) : (
            results.slice(0, 10).map((item) => {
              const isPositive = item.change >= 0;
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f1f4fb] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={(e) => onToggleFavorite(item.id, e)}
                      className="text-[#c3c5d8] hover:text-amber-500 transition-colors p-1"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>

                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: item.badgeBgColor || '#0049db' }}
                    >
                      {item.badgeText || item.symbol.slice(0, 2)}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#181c21] group-hover:text-[#0049db] transition-colors truncate">
                          {item.name}
                        </span>
                        <span className="font-mono text-xs text-[#6A6D78] font-medium">
                          {item.symbol}
                        </span>
                      </div>
                      <span className="text-xs text-[#6A6D78] truncate">
                        {item.category.toUpperCase()} • {item.sector || 'Financial Instrument'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-semibold text-sm tabular-nums text-[#181c21]">
                      {item.priceFormatted}
                    </div>
                    <div className={`text-xs tabular-nums font-medium ${
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

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#f7f9ff] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#6A6D78]">
          <span>Select an asset to launch real-time Supercharts</span>
          <span>MarketView Precision v2.4</span>
        </div>
      </div>
    </div>
  );
};
