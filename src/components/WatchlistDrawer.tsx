import React from 'react';
import { X, Trash2, ArrowUpRight, TrendingUp, Star } from 'lucide-react';
import { MarketItem } from '../types';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  favorites: string[];
  onSelectItem: (item: MarketItem) => void;
  onRemoveFavorite: (id: string) => void;
  isDarkMode?: boolean;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  favorites,
  onSelectItem,
  onRemoveFavorite,
  isDarkMode = false,
}) => {
  if (!isOpen) return null;

  const favoriteItems = items.filter((item) => favorites.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="watchlist-drawer-panel"
          className={`w-screen max-w-md shadow-2xl border-l flex flex-col transition-colors ${
            isDarkMode 
              ? 'bg-[#151922] border-[#293245] text-white' 
              : 'bg-white border-[#E0E3EB] text-[#181c21]'
          }`}
        >
          {/* Header */}
          <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isDarkMode ? 'bg-[#11151c] border-[#293245]' : 'bg-[#f7f9ff] border-[#E0E3EB]'
          }`}>
            <div className="flex items-center gap-2.5">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <div>
                <h3 className="font-bold text-base">Watchlist & Portfolio</h3>
                <p className="text-xs text-[#8e94a8]">
                  {favoriteItems.length} active symbols tracked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8e94a8] hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/5 p-2">
            {favoriteItems.length === 0 ? (
              <div className="py-16 text-center px-4 text-[#8e94a8]">
                <Star className="w-12 h-12 text-[#8e94a8]/30 mx-auto mb-3" />
                <p className="font-semibold text-sm">No favorites added yet</p>
                <p className="text-xs mt-1">
                  Click the star icon next to any symbol in the market table to monitor it here.
                </p>
              </div>
            ) : (
              favoriteItems.map((item) => {
                const isPositive = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isDarkMode ? 'hover:bg-[#1f2533]' : 'hover:bg-[#f8faff]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: item.badgeBgColor || '#2962ff' }}
                      >
                        {item.badgeText || item.symbol.slice(0, 2)}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-sm truncate">{item.symbol}</div>
                        <div className="text-xs text-[#8e94a8] truncate">{item.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm">{item.priceFormatted}</div>
                        <div className={`text-xs font-semibold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}>
                          {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(item.id);
                        }}
                        className="p-1.5 text-[#8e94a8] hover:text-rose-500 rounded-lg transition-colors"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer quick action */}
          <div className={`p-4 border-t text-xs flex justify-between items-center ${
            isDarkMode ? 'bg-[#11151c] border-[#293245] text-[#8e94a8]' : 'bg-[#f7f9ff] border-[#E0E3EB] text-[#6A6D78]'
          }`}>
            <span>Quick hotkey: <strong>⌘K</strong></span>
            <span className="text-emerald-500 font-semibold">Live Feed Synced</span>
          </div>

        </div>
      </div>
    </div>
  );
};
