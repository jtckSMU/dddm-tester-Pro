import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronRight, 
  Star, 
  SlidersHorizontal, 
  Search, 
  Download,
  Bell,
  BarChart2,
  TrendingUp,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { MarketItem, MarketCategory, TableViewMode } from '../types';

interface MarketTableProps {
  items: MarketItem[];
  category: MarketCategory;
  onSelectItem: (item: MarketItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onViewAllCategory: () => void;
  onOpenAlertModal?: (item: MarketItem) => void;
  isDarkMode?: boolean;
}

type SortField = 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'rating' | 'peRatio';

export const MarketTable: React.FC<MarketTableProps> = ({
  items,
  category,
  onSelectItem,
  favorites,
  onToggleFavorite,
  onViewAllCategory,
  onOpenAlertModal,
  isDarkMode = false,
}) => {
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterQuery, setFilterQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gainers' | 'losers'>('all');
  const [viewMode, setViewMode] = useState<TableViewMode>('table');

  const renderRowSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length === 0) return null;
    const width = 88;
    const height = 28;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const pathData = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - 3 - ((val - min) / range) * (height - 6);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#089981' : '#F23645';

    return (
      <svg 
        className="w-[88px] h-[28px] overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredItems = items
    .filter((item) => {
      if (filterType === 'gainers' && item.change <= 0) return false;
      if (filterType === 'losers' && item.change >= 0) return false;
      if (!filterQuery) return true;
      const q = filterQuery.toLowerCase();
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        (item.sector && item.sector.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (sortField === 'rating') {
        valA = a.technicalRating;
        valB = b.technicalRating;
      }
      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

  const handleExportCSV = () => {
    const headers = ['Symbol', 'Name', 'Price', 'Change', 'ChangePercent', 'Volume', 'High24h', 'Low24h', 'Rating'];
    const rows = filteredItems.map(i => [
      i.symbol,
      `"${i.name}"`,
      i.price,
      i.change,
      i.changePercent,
      `"${i.volume}"`,
      i.high24h,
      i.low24h,
      i.technicalRating
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `marketview_${category}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full py-6">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Table Controls Bar */}
        <div className={`p-3 rounded-2xl border mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isDarkMode 
            ? 'bg-[#151922] border-[#262c3a]' 
            : 'bg-white border-[#E0E3EB] shadow-2xs'
        }`}>
          
          {/* Left search & filters */}
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#8e94a8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={`Search ${category} by symbol or name...`}
                className={`w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border focus:outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-[#1c222e] border-[#2d3545] text-white placeholder:text-[#6a7285] focus:border-[#2962ff]' 
                    : 'bg-[#f7f9ff] border-[#E0E3EB] text-[#181c21] placeholder:text-[#6A6D78] focus:border-[#2962ff]'
                }`}
              />
            </div>

            {/* Gainers / Losers Selector */}
            <div className={`flex p-0.5 rounded-xl border text-xs shrink-0 ${
              isDarkMode ? 'bg-[#1c222e] border-[#2d3545]' : 'bg-[#f7f9ff] border-[#E0E3EB]'
            }`}>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                  filterType === 'all' 
                    ? 'bg-[#2962ff] text-white shadow-xs' 
                    : isDarkMode ? 'text-[#8e94a8] hover:text-white' : 'text-[#434656] hover:text-[#181c21]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('gainers')}
                className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                  filterType === 'gainers' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : isDarkMode ? 'text-[#8e94a8] hover:text-white' : 'text-[#434656] hover:text-[#181c21]'
                }`}
              >
                Gainers
              </button>
              <button
                onClick={() => setFilterType('losers')}
                className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                  filterType === 'losers' 
                    ? 'bg-rose-600 text-white shadow-xs' 
                    : isDarkMode ? 'text-[#8e94a8] hover:text-white' : 'text-[#434656] hover:text-[#181c21]'
                }`}
              >
                Losers
              </button>
            </div>
          </div>

          {/* Right Toolbar: View mode, CSV Export */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className={`flex p-0.5 rounded-xl border text-xs ${
              isDarkMode ? 'bg-[#1c222e] border-[#2d3545]' : 'bg-[#f7f9ff] border-[#E0E3EB]'
            }`}>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-[#2962ff] text-white' : 'text-[#8e94a8]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'compact' ? 'bg-[#2962ff] text-white' : 'text-[#8e94a8]'
                }`}
                title="Dense Compact View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#2962ff] text-white' : 'text-[#8e94a8]'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className={`px-3 py-1.5 border rounded-xl text-xs flex items-center gap-1.5 transition-colors font-medium ${
                isDarkMode 
                  ? 'bg-[#1c222e] border-[#2d3545] text-white/90 hover:border-[#2962ff]' 
                  : 'bg-[#f7f9ff] border-[#E0E3EB] text-[#434656] hover:text-[#2962ff] hover:bg-white'
              }`}
              title="Download table data in CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#2962ff]" />
              <span className="text-[11px] hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* 1. GRID CARDS VIEW MODE */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredItems.map((item) => {
              const isPositive = item.change >= 0;
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    isDarkMode 
                      ? 'bg-[#151922] border-[#262c3a] hover:border-[#2962ff]' 
                      : 'bg-white border-[#E0E3EB] hover:border-[#2962ff] shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                        style={{ backgroundColor: item.badgeBgColor || '#2962ff' }}
                      >
                        {item.badgeText || item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-sm truncate max-w-[140px]">{item.name}</div>
                        <div className="text-[11px] font-mono text-[#8e94a8]">{item.symbol}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => onToggleFavorite(item.id, e)}
                      className="text-[#8e94a8] hover:text-amber-500 p-1"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-2 pt-2 border-t border-black/5 dark:border-white/5">
                    <div>
                      <div className="font-mono font-bold text-base">{item.priceFormatted}</div>
                      <div className={`text-xs font-semibold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}>
                        {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <div className="w-24">
                      {renderRowSparkline(item.sparkline, isPositive)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. TABLE LIST / COMPACT VIEW MODE */}
        {(viewMode === 'table' || viewMode === 'compact') && (
          <div className={`rounded-2xl border overflow-hidden ${
            isDarkMode 
              ? 'bg-[#151922] border-[#262c3a] shadow-xl' 
              : 'bg-white border-[#E0E3EB] shadow-sm'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                    isDarkMode 
                      ? 'bg-[#11151c] border-[#262c3a] text-[#8e94a8]' 
                      : 'bg-[#f7f9ff] border-[#E0E3EB] text-[#6A6D78]'
                  }`}>
                    <th className="py-3 px-3 w-10 text-center">
                      <span className="sr-only">Favorite</span>
                    </th>
                    <th 
                      onClick={() => handleSort('name')}
                      className="py-3 px-4 cursor-pointer hover:text-[#2962ff] transition-colors select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Symbol / Asset</span>
                        {sortField === 'name' && (
                          <span className="text-[10px] text-[#2962ff]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('price')}
                      className="py-3 px-4 text-right cursor-pointer hover:text-[#2962ff] transition-colors select-none"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Last Price</span>
                        {sortField === 'price' && (
                          <span className="text-[10px] text-[#2962ff]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('change')}
                      className="py-3 px-4 text-right cursor-pointer hover:text-[#2962ff] transition-colors select-none"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Change</span>
                        {sortField === 'change' && (
                          <span className="text-[10px] text-[#2962ff]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('changePercent')}
                      className="py-3 px-4 text-right cursor-pointer hover:text-[#2962ff] transition-colors select-none"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Chg %</span>
                        {sortField === 'changePercent' && (
                          <span className="text-[10px] text-[#2962ff]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center hidden md:table-cell">
                      24h Range Bar
                    </th>
                    <th className="py-3 px-4 text-center hidden lg:table-cell">
                      Trend (24h)
                    </th>
                    <th 
                      onClick={() => handleSort('volume')}
                      className="py-3 px-4 text-right cursor-pointer hover:text-[#2962ff] transition-colors select-none hidden xl:table-cell"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Volume</span>
                        {sortField === 'volume' && (
                          <span className="text-[10px] text-[#2962ff]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center hidden sm:table-cell">
                      Rating
                    </th>
                    <th className="py-3 px-3 w-14 text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className={`divide-y text-sm tabular-nums ${
                  isDarkMode ? 'divide-[#222735]' : 'divide-[#E0E3EB]'
                }`}>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-[#8e94a8] text-xs">
                        No instruments matching current filter. Try resetting search query.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const isPositive = item.change >= 0;
                      const isFav = favorites.includes(item.id);
                      const rowPadding = viewMode === 'compact' ? 'py-2' : 'py-3.5';

                      // 24h range
                      const range24 = item.high24h - item.low24h || 1;
                      const pos24 = Math.min(100, Math.max(0, ((item.price - item.low24h) / range24) * 100));

                      return (
                        <tr
                          key={item.id}
                          onClick={() => onSelectItem(item)}
                          className={`cursor-pointer transition-colors group ${
                            isDarkMode 
                              ? 'hover:bg-[#1c222e]' 
                              : 'hover:bg-[#f8faff]'
                          } ${
                            item.tickDirection === 'up' ? 'flash-up' : item.tickDirection === 'down' ? 'flash-down' : ''
                          }`}
                        >
                          {/* Favorite Star */}
                          <td className={`${rowPadding} px-3 text-center`} onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => onToggleFavorite(item.id, e)}
                              className="text-[#8e94a8] hover:text-amber-500 transition-colors p-1"
                              title={isFav ? "Remove from watchlist" : "Add to watchlist"}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                            </button>
                          </td>

                          {/* Symbol & Name */}
                          <td className={`${rowPadding} px-4`}>
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm"
                                style={{ backgroundColor: item.badgeBgColor || '#2962ff' }}
                              >
                                {item.badgeText || item.symbol.slice(0, 2)}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className={`font-bold text-sm group-hover:text-[#2962ff] transition-colors truncate ${
                                  isDarkMode ? 'text-white' : 'text-[#181c21]'
                                }`}>
                                  {item.name}
                                </div>
                                <div className="text-[11px] font-mono text-[#8e94a8] flex items-center gap-1.5">
                                  <span className="font-semibold">{item.symbol}</span>
                                  {item.exchange && <span>• {item.exchange}</span>}
                                  {item.sector && <span className="hidden xl:inline">• {item.sector}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Last Price */}
                          <td className={`${rowPadding} px-4 text-right font-bold text-sm font-mono ${
                            isDarkMode ? 'text-white' : 'text-[#181c21]'
                          }`}>
                            {item.priceFormatted}
                          </td>

                          {/* Change */}
                          <td className={`${rowPadding} px-4 text-right font-medium text-xs font-mono ${
                            isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}>
                            {isPositive ? '+' : ''}{item.change.toFixed(2)}
                          </td>

                          {/* Change Percent Chip */}
                          <td className={`${rowPadding} px-4 text-right`}>
                            <span className={`inline-block font-semibold text-xs px-2 py-0.5 rounded-md font-mono ${
                              isPositive 
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            }`}>
                              {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                            </span>
                          </td>

                          {/* 24h Range Bar */}
                          <td className={`${rowPadding} px-4 text-center hidden md:table-cell`}>
                            <div className="w-28 mx-auto flex flex-col gap-1 text-[10px] font-mono text-[#8e94a8]">
                              <div className="flex justify-between text-[9px]">
                                <span>{item.low24h.toFixed(1)}</span>
                                <span>{item.high24h.toFixed(1)}</span>
                              </div>
                              <div className={`w-full h-1 rounded-full overflow-hidden relative ${
                                isDarkMode ? 'bg-[#262c3a]' : 'bg-[#e5e8ef]'
                              }`}>
                                <div 
                                  className="h-full bg-[#2962ff] rounded-full"
                                  style={{ width: `${pos24}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Sparkline */}
                          <td className={`${rowPadding} px-4 text-center hidden lg:table-cell`}>
                            <div className="inline-block opacity-90 group-hover:opacity-100">
                              {renderRowSparkline(item.sparkline, isPositive)}
                            </div>
                          </td>

                          {/* Volume */}
                          <td className={`${rowPadding} px-4 text-right text-xs text-[#8e94a8] font-mono hidden xl:table-cell`}>
                            {item.volume}
                          </td>

                          {/* Rating */}
                          <td className={`${rowPadding} px-4 text-center hidden sm:table-cell`}>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.technicalRating === 'Strong Buy' 
                                ? 'bg-emerald-500/15 text-emerald-500' 
                                : item.technicalRating === 'Buy' 
                                  ? 'bg-emerald-500/10 text-emerald-500' 
                                  : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {item.technicalRating}
                            </span>
                          </td>

                          {/* Launch Superchart Action */}
                          <td className={`${rowPadding} px-3 text-center`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectItem(item);
                              }}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDarkMode 
                                  ? 'text-[#8e94a8] hover:text-[#2962ff] hover:bg-[#232936]' 
                                  : 'text-[#6A6D78] hover:text-[#2962ff] hover:bg-[#ebeef5]'
                              }`}
                              title="Open in Superchart"
                            >
                              <BarChart2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              isDarkMode 
                ? 'bg-[#11151c] border-[#262c3a] text-[#8e94a8]' 
                : 'bg-[#f7f9ff] border-[#E0E3EB] text-[#6A6D78]'
            }`}>
              <div className="flex items-center gap-2">
                <span>Displaying <strong>{filteredItems.length}</strong> securities</span>
                <span>•</span>
                <span className="text-[11px] text-emerald-500 font-semibold">● Real-time WebSocket ticks enabled</span>
              </div>

              <button
                onClick={onViewAllCategory}
                className="font-bold text-[#2962ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all global {category} screeners</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
