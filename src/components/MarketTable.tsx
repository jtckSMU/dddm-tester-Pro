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
  LayoutGrid
} from 'lucide-react';
import { MarketItem, MarketCategory } from '../types';

interface MarketTableProps {
  items: MarketItem[];
  category: MarketCategory;
  onSelectItem: (item: MarketItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onViewAllCategory: () => void;
  onOpenAlertModal?: (item: MarketItem) => void;
}

type SortField = 'name' | 'price' | 'change' | 'changePercent' | 'volume' | 'rating';

export const MarketTable: React.FC<MarketTableProps> = ({
  items,
  category,
  onSelectItem,
  favorites,
  onToggleFavorite,
  onViewAllCategory,
  onOpenAlertModal,
}) => {
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterQuery, setFilterQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'gainers' | 'losers'>('all');
  const [density, setDensity] = useState<'compact' | 'normal'>('normal');

  // SVG Sparkline path renderer for table rows
  const renderRowSparkline = (points: number[], isPositive: boolean, id: string) => {
    if (!points || points.length === 0) return null;
    const width = 84;
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
        className="w-[84px] h-[28px] overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Sort & Filter
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

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Symbol', 'Name', 'Price', 'Change', 'ChangePercent', 'Volume', 'Rating'];
    const rows = filteredItems.map(i => [
      i.symbol,
      `"${i.name}"`,
      i.price,
      i.change,
      i.changePercent,
      `"${i.volume}"`,
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
    <section className="w-full py-6 bg-[#f7f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Table Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          
          {/* Left search & filters */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#6A6D78] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={`Filter ${category} instruments...`}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E0E3EB] rounded-lg text-[#181c21] placeholder:text-[#6A6D78] focus:outline-none focus:border-[#0049db]"
              />
            </div>

            {/* Gainers / Losers Pills */}
            <div className="flex bg-white p-0.5 rounded-lg border border-[#E0E3EB] text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded font-medium text-[11px] transition-colors ${
                  filterType === 'all' ? 'bg-[#0049db] text-white' : 'text-[#434656] hover:bg-[#f1f4fb]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('gainers')}
                className={`px-2.5 py-1 rounded font-medium text-[11px] transition-colors ${
                  filterType === 'gainers' ? 'bg-[#089981] text-white' : 'text-[#434656] hover:bg-[#f1f4fb]'
                }`}
              >
                Gainers
              </button>
              <button
                onClick={() => setFilterType('losers')}
                className={`px-2.5 py-1 rounded font-medium text-[11px] transition-colors ${
                  filterType === 'losers' ? 'bg-[#F23645] text-white' : 'text-[#434656] hover:bg-[#f1f4fb]'
                }`}
              >
                Losers
              </button>
            </div>
          </div>

          {/* Right Toolbar (Density & CSV Export) */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setDensity(density === 'normal' ? 'compact' : 'normal')}
              className="p-1.5 bg-white border border-[#E0E3EB] text-[#434656] hover:text-[#0049db] rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              title="Toggle Row Density"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden md:inline capitalize">{density}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="p-1.5 bg-white border border-[#E0E3EB] text-[#434656] hover:text-[#0049db] rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden md:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E0E3EB] bg-[#f7f9ff]">
                  <th className="py-3 px-4 w-10 text-center">
                    <span className="sr-only">Favorite</span>
                  </th>
                  <th 
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 text-xs font-semibold text-[#6A6D78] cursor-pointer hover:text-[#181c21] transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Symbol & Name</span>
                      {sortField === 'name' && (
                        <span className="text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('price')}
                    className="py-3 px-4 text-xs font-semibold text-[#6A6D78] text-right cursor-pointer hover:text-[#181c21] transition-colors select-none"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Last Price</span>
                      {sortField === 'price' && (
                        <span className="text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('change')}
                    className="py-3 px-4 text-xs font-semibold text-[#6A6D78] text-right cursor-pointer hover:text-[#181c21] transition-colors select-none"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Chg</span>
                      {sortField === 'change' && (
                        <span className="text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('changePercent')}
                    className="py-3 px-4 text-xs font-semibold text-[#6A6D78] text-right cursor-pointer hover:text-[#181c21] transition-colors select-none"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Chg %</span>
                      {sortField === 'changePercent' && (
                        <span className="text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#6A6D78] text-center hidden md:table-cell">
                    Trend (24h)
                  </th>
                  <th 
                    onClick={() => handleSort('volume')}
                    className="py-3 px-4 text-xs font-semibold text-[#6A6D78] text-right cursor-pointer hover:text-[#181c21] transition-colors select-none hidden lg:table-cell"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Volume</span>
                      {sortField === 'volume' && (
                        <span className="text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-[#6A6D78] text-center hidden sm:table-cell">
                    Consensus
                  </th>
                  <th className="py-3 px-3 w-12 text-center">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E0E3EB] text-sm tabular-nums">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#6A6D78] text-xs">
                      No instruments found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isPositive = item.change >= 0;
                    const isFav = favorites.includes(item.id);
                    const rowPadding = density === 'compact' ? 'py-2' : 'py-3.5';

                    return (
                      <tr
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className="hover:bg-[#f1f4fb] cursor-pointer transition-colors group"
                      >
                        {/* Favorite Button */}
                        <td className={`${rowPadding} px-3 text-center`} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => onToggleFavorite(item.id, e)}
                            className="text-[#c3c5d8] hover:text-amber-500 transition-colors p-1"
                            title={isFav ? "Remove from Watchlist" : "Add to Watchlist"}
                          >
                            <Star 
                              className={`w-3.5 h-3.5 ${
                                isFav ? 'fill-amber-400 text-amber-500' : ''
                              }`} 
                            />
                          </button>
                        </td>

                        {/* Name & Badge */}
                        <td className={`${rowPadding} px-4`}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 select-none shadow-2xs"
                              style={{ backgroundColor: item.badgeBgColor || '#e5e8ef', color: item.badgeTextColor || '#181c21' }}
                            >
                              {item.badgeText || item.symbol.slice(0, 2)}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="font-semibold text-sm text-[#181c21] group-hover:text-[#0049db] transition-colors truncate">
                                {item.name}
                              </div>
                              <div className="text-[11px] font-mono text-[#6A6D78] flex items-center gap-1.5">
                                <span className="font-semibold">{item.symbol}</span>
                                {item.exchange && <span>• {item.exchange}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Last Price */}
                        <td className={`${rowPadding} px-4 text-right font-semibold text-[#181c21] text-sm`}>
                          {item.priceFormatted}
                        </td>

                        {/* Change */}
                        <td className={`${rowPadding} px-4 text-right font-medium text-xs ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}>
                          {isPositive ? '+' : ''}{item.change.toFixed(2)}
                        </td>

                        {/* Change Percent */}
                        <td className={`${rowPadding} px-4 text-right`}>
                          <span className={`inline-block font-semibold text-xs px-2 py-0.5 rounded-md ${
                            isPositive ? 'bg-emerald-50 text-[#089981]' : 'bg-rose-50 text-[#F23645]'
                          }`}>
                            {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                          </span>
                        </td>

                        {/* 24h Trend Sparkline */}
                        <td className={`${rowPadding} px-4 text-center hidden md:table-cell`}>
                          <div className="inline-block opacity-85 group-hover:opacity-100 transition-opacity">
                            {renderRowSparkline(item.sparkline, isPositive, item.id)}
                          </div>
                        </td>

                        {/* Volume */}
                        <td className={`${rowPadding} px-4 text-right text-xs text-[#6A6D78] font-mono hidden lg:table-cell`}>
                          {item.volume}
                        </td>

                        {/* Rating */}
                        <td className={`${rowPadding} px-4 text-center hidden sm:table-cell`}>
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            item.technicalRating === 'Strong Buy' ? 'bg-emerald-100 text-[#089981]' :
                            item.technicalRating === 'Buy' ? 'bg-emerald-50 text-[#089981]' :
                            item.technicalRating === 'Sell' ? 'bg-red-50 text-[#F23645]' :
                            'bg-gray-100 text-[#434656]'
                          }`}>
                            {item.technicalRating}
                          </span>
                        </td>

                        {/* Quick Action Button */}
                        <td className={`${rowPadding} px-3 text-center`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectItem(item);
                            }}
                            className="p-1 text-[#6A6D78] hover:text-[#0049db] hover:bg-[#ebeef5] rounded transition-colors"
                            title="Open Technical Chart"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
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
          <div className="p-3.5 bg-[#f7f9ff] border-t border-[#E0E3EB] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#6A6D78]">
            <div className="flex items-center gap-2">
              <span>Showing {filteredItems.length} active instruments</span>
              <span>•</span>
              <span className="text-[11px]">Real-time tick updates</span>
            </div>

            <button
              onClick={onViewAllCategory}
              className="font-semibold text-[#0049db] hover:underline flex items-center gap-1"
            >
              <span>Explore all {category} worldwide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
