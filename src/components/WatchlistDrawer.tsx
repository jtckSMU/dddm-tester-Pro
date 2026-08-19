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
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  favorites,
  onSelectItem,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  const favoriteItems = items.filter((item) => favorites.includes(item.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          id="watchlist-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E0E3EB] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E0E3EB] flex items-center justify-between bg-[#f7f9ff]">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <div>
                <h3 className="font-bold text-lg text-[#181c21]">My Watchlist</h3>
                <p className="text-xs text-[#6A6D78]">
                  {favoriteItems.length} active symbols tracked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6A6D78] hover:text-[#181c21] hover:bg-[#ebeef5] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E0E3EB] p-3">
            {favoriteItems.length === 0 ? (
              <div className="py-16 text-center px-4">
                <Star className="w-12 h-12 text-[#c3c5d8] mx-auto mb-3 stroke-[1.5]" />
                <h4 className="font-semibold text-base text-[#181c21] mb-1">Your watchlist is empty</h4>
                <p className="text-xs text-[#6A6D78] max-w-xs mx-auto mb-4">
                  Click the star icon next to any index, stock, crypto, or forex pair to pin it here.
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
                    className="p-3.5 rounded-xl hover:bg-[#f1f4fb] cursor-pointer transition-colors group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0"
                        style={{ backgroundColor: item.badgeBgColor || '#0049db' }}
                      >
                        {item.badgeText || item.symbol.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-[#181c21] group-hover:text-[#0049db] transition-colors truncate">
                          {item.name}
                        </div>
                        <div className="text-xs font-mono text-[#6A6D78]">
                          {item.symbol} • {item.category.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-semibold text-sm tabular-nums text-[#181c21]">
                          {item.priceFormatted}
                        </div>
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
                        className="p-1.5 text-[#c3c5d8] hover:text-[#ba1a1a] hover:bg-red-50 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom stats */}
          <div className="p-4 bg-[#f7f9ff] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#6A6D78]">
            <span>Auto-synced with live ticks</span>
            <button
              onClick={onClose}
              className="text-[#0049db] font-semibold hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
