import React, { useState } from 'react';
import { 
  BarChart2, 
  Grid, 
  SlidersHorizontal, 
  TrendingUp, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Eye
} from 'lucide-react';
import { MarketItem, ProductSubTab } from '../types';

interface ProductsViewProps {
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ items, onSelectItem }) => {
  const [subTab, setSubTab] = useState<ProductSubTab>('heatmaps');
  const [screenerCategory, setScreenerCategory] = useState<string>('all');
  const [minPe, setMinPe] = useState<number>(0);
  const [performanceFilter, setPerformanceFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  // Heatmap sector groups
  const sectorGroups = [
    {
      sector: 'Mega Cap Technology',
      items: items.filter(i => ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'].includes(i.symbol)),
    },
    {
      sector: 'Major Indices',
      items: items.filter(i => i.category === 'indices').slice(0, 4),
    },
    {
      sector: 'Crypto & Web3',
      items: items.filter(i => i.category === 'crypto').slice(0, 4),
    },
    {
      sector: 'Commodities & Futures',
      items: items.filter(i => i.category === 'futures').slice(0, 4),
    },
  ];

  // Screener filtered list
  const screenerItems = items.filter(item => {
    if (screenerCategory !== 'all' && item.category !== screenerCategory) return false;
    if (performanceFilter === 'gainers' && item.change <= 0) return false;
    if (performanceFilter === 'losers' && item.change >= 0) return false;
    if (minPe > 0 && (item.peRatio || 0) < minPe) return false;
    return true;
  });

  return (
    <div id="products-view" className="w-full py-8 md:py-12 bg-[#f7f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Products Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-3xl text-[#181c21] tracking-tight">
              Market Intelligence Products
            </h2>
            <p className="text-sm text-[#6A6D78] mt-1">
              Explore live heatmaps, multi-asset screeners, and precision technical chart engines.
            </p>
          </div>

          {/* Subtab Pills */}
          <div className="flex bg-white p-1 rounded-xl border border-[#E0E3EB] shadow-2xs self-start md:self-auto">
            <button
              onClick={() => setSubTab('heatmaps')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                subTab === 'heatmaps' 
                  ? 'bg-[#0049db] text-white shadow-2xs' 
                  : 'text-[#434656] hover:bg-[#f1f4fb]'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Heatmaps</span>
            </button>

            <button
              onClick={() => setSubTab('screeners')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                subTab === 'screeners' 
                  ? 'bg-[#0049db] text-white shadow-2xs' 
                  : 'text-[#434656] hover:bg-[#f1f4fb]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Stock Screener</span>
            </button>

            <button
              onClick={() => setSubTab('supercharts')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                subTab === 'supercharts' 
                  ? 'bg-[#0049db] text-white shadow-2xs' 
                  : 'text-[#434656] hover:bg-[#f1f4fb]'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Supercharts</span>
            </button>
          </div>
        </div>

        {/* 1. HEATMAPS SUBTAB */}
        {subTab === 'heatmaps' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E0E3EB]">
              <div className="flex items-center gap-2 text-xs text-[#6A6D78]">
                <span className="font-semibold text-[#181c21]">Color Scale:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px]">+3% and above</span>
                <span className="px-2 py-0.5 rounded bg-emerald-400 text-white font-mono text-[10px]">+1% to +3%</span>
                <span className="px-2 py-0.5 rounded bg-gray-300 text-[#181c21] font-mono text-[10px]">0% Neutral</span>
                <span className="px-2 py-0.5 rounded bg-red-400 text-white font-mono text-[10px]">-1% to -3%</span>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px]">-3% and below</span>
              </div>
              <span className="text-xs text-[#6A6D78] hidden sm:inline">Click any tile to open technical analysis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectorGroups.map((group, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E0E3EB] shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-[#181c21]">{group.sector}</h3>
                    <span className="text-xs font-mono text-[#6A6D78]">{group.items.length} instruments</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 min-h-[220px]">
                    {group.items.map((item) => {
                      const chg = item.changePercent;
                      let tileBg = 'bg-gray-200 text-[#181c21]';
                      if (chg >= 3) tileBg = 'bg-[#089981] text-white';
                      else if (chg > 0) tileBg = 'bg-emerald-500 text-white';
                      else if (chg <= -3) tileBg = 'bg-[#F23645] text-white';
                      else if (chg < 0) tileBg = 'bg-rose-500 text-white';

                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectItem(item)}
                          className={`${tileBg} p-4 rounded-xl flex flex-col justify-between cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all duration-200`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-base sm:text-lg tracking-tight font-mono">{item.symbol}</div>
                              <div className="text-xs opacity-90 truncate max-w-[120px]">{item.name}</div>
                            </div>
                            <span className="text-[10px] font-mono opacity-80 uppercase px-1.5 py-0.5 rounded bg-black/15">
                              {item.category}
                            </span>
                          </div>

                          <div className="flex justify-between items-end mt-4 pt-2 border-t border-white/20">
                            <span className="font-semibold text-sm tabular-nums">{item.priceFormatted}</span>
                            <span className="font-bold text-base tabular-nums flex items-center">
                              {chg >= 0 ? '+' : ''}{chg.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SCREENER SUBTAB */}
        {subTab === 'screeners' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-2xl border border-[#E0E3EB] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#0049db]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A6D78]">Asset Type:</span>
                  <select
                    value={screenerCategory}
                    onChange={(e) => setScreenerCategory(e.target.value)}
                    className="text-xs bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg px-2.5 py-1.5 font-medium focus:outline-none"
                  >
                    <option value="all">All Asset Classes</option>
                    <option value="indices">Indices</option>
                    <option value="stocks">Stocks</option>
                    <option value="crypto">Crypto</option>
                    <option value="futures">Futures</option>
                    <option value="forex">Forex</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6A6D78]">Movement:</span>
                  <select
                    value={performanceFilter}
                    onChange={(e: any) => setPerformanceFilter(e.target.value)}
                    className="text-xs bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg px-2.5 py-1.5 font-medium focus:outline-none"
                  >
                    <option value="all">All Movements</option>
                    <option value="gainers">Top Gainers Only</option>
                    <option value="losers">Top Losers Only</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-[#6A6D78] font-mono">
                Found {screenerItems.length} matching securities
              </div>
            </div>

            {/* Screener Results Table */}
            <div className="bg-white rounded-2xl border border-[#E0E3EB] overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f1f4fb] border-b border-[#E0E3EB]">
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78]">Symbol / Security</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] text-right">Price</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] text-right">Change %</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] text-right">Market Cap</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] text-right">P/E Ratio</th>
                    <th className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] text-center">Analyst Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E3EB] text-sm tabular-nums">
                  {screenerItems.map((item) => {
                    const isPositive = item.change >= 0;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => onSelectItem(item)}
                        className="hover:bg-[#f1f4fb] cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <div 
                            className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs text-white shrink-0"
                            style={{ backgroundColor: item.badgeBgColor || '#0049db' }}
                          >
                            {item.badgeText || item.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-[#181c21]">{item.name}</div>
                            <div className="text-xs text-[#6A6D78] font-mono">{item.symbol} • {item.sector || item.category}</div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#181c21]">
                          {item.priceFormatted}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-bold ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}>
                          {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#6A6D78] font-mono">
                          {item.marketCap || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#6A6D78] font-mono">
                          {item.peRatio ? item.peRatio.toFixed(1) : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.technicalRating === 'Strong Buy' ? 'bg-emerald-100 text-[#089981]' :
                            item.technicalRating === 'Buy' ? 'bg-emerald-50 text-[#089981]' :
                            item.technicalRating === 'Sell' ? 'bg-red-50 text-[#F23645]' :
                            'bg-gray-100 text-[#434656]'
                          }`}>
                            {item.technicalRating}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SUPERCHARTS SUBTAB */}
        {subTab === 'supercharts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white p-8 rounded-2xl border border-[#E0E3EB] text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-12 h-12 bg-[#2962ff]/10 text-[#0049db] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-2xl text-[#181c21] mb-2">
                Precision HTML5 & SVG Supercharts
              </h3>
              <p className="text-sm text-[#6A6D78] leading-relaxed mb-6">
                MarketView provides high frame-rate interactive charting with customizable technical indicators, multi-timeframe overlays, volume bars, and candlestick patterns.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => onSelectItem(items[0])}
                  className="bg-[#2962ff] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0049db] transition-colors"
                >
                  Launch S&P 500 Superchart
                </button>
                <button
                  onClick={() => onSelectItem(items[1])}
                  className="bg-[#f1f4fb] text-[#181c21] px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#ebeef5] border border-[#E0E3EB] transition-colors"
                >
                  Launch Nasdaq 100
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
