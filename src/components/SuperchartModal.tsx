import React, { useState, useMemo } from 'react';
import { 
  X, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Maximize2, 
  Minimize2, 
  TrendingUp, 
  Activity, 
  Sliders, 
  Calendar,
  Layers,
  Bell,
  Eye,
  Share2,
  LineChart,
  BarChart2,
  CheckCircle,
  FileText,
  Volume2,
  ArrowRight
} from 'lucide-react';
import { 
  MarketItem, 
  ChartTimeframe, 
  ChartType, 
  PricePoint,
  NewsArticle
} from '../types';
import { mockNewsArticles } from '../data/marketData';

interface SuperchartModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onSetAlert?: (item: MarketItem) => void;
}

type ModalTab = 'chart' | 'orderbook' | 'financials' | 'news' | 'trade';

export const SuperchartModal: React.FC<SuperchartModalProps> = ({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSetAlert,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('chart');
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Indicator toggles
  const [showEma20, setShowEma20] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRsi, setShowRsi] = useState(true);
  const [showMacd, setShowMacd] = useState(false);

  // Hover crosshair state
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);

  // Simulated Trading State
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderQty, setOrderQty] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(0);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Sync limit price when item changes
  React.useEffect(() => {
    if (item) setLimitPrice(item.price);
  }, [item]);

  if (!item) return null;

  const history = item.history[timeframe] || [];
  const activeDataPoint = hoveredPoint || history[history.length - 1] || {
    time: 'Now',
    price: item.price,
    open: item.openPrice,
    high: item.high24h,
    low: item.low24h,
    close: item.price,
    volume: 120000,
    rsi: 54.2,
    macd: 1.25,
    macdSignal: 0.95,
    macdHist: 0.30
  };

  const isPositive = item.change >= 0;
  const articles: NewsArticle[] = mockNewsArticles[item.symbol] || [
    {
      id: 'gen-1',
      title: `${item.name} (${item.symbol}) Volume Expands Following Global Market Trends`,
      source: 'MarketView Intelligence',
      timeAgo: '18m ago',
      sentiment: isPositive ? 'bullish' : 'neutral',
      snippet: `Institutional desks noted steady positioning across ${item.symbol} as key resistance and support boundaries remain in play.`
    },
    {
      id: 'gen-2',
      title: `Macro Rates and Inflation Expectations Reshape Asset Allocations`,
      source: 'Global FX & Equities Report',
      timeAgo: '1h ago',
      sentiment: 'neutral',
      snippet: 'Traders continue to monitor central bank liquidity operations and yield curves heading into month-end rebalancing.'
    }
  ];

  // SVG Chart Geometry calculations
  const svgWidth = 800;
  const svgHeight = 360;
  const paddingBottom = 40;
  const chartHeight = 240;
  const volumeHeight = 60;
  const rsiHeight = showRsi ? 80 : 0;
  const macdHeight = showMacd ? 80 : 0;
  const totalSvgHeight = chartHeight + volumeHeight + rsiHeight + macdHeight + paddingBottom;

  const minPrice = Math.min(...history.map((p) => p.low));
  const maxPrice = Math.max(...history.map((p) => p.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVol = Math.max(...history.map((p) => p.volume || 1000));

  const getY = (val: number) => {
    return chartHeight - 20 - ((val - minPrice) / priceRange) * (chartHeight - 40);
  };

  const getX = (index: number) => {
    return 40 + (index / (history.length - 1 || 1)) * (svgWidth - 90);
  };

  // Generate Area & Line paths
  const linePath = history
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)},${getY(p.close).toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${getX(history.length - 1)},${chartHeight} L ${getX(0)},${chartHeight} Z`;

  // Calculate EMA-20
  const ema20Path = history
    .map((p, i) => {
      const emaVal = p.bbMiddle || p.close;
      return `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)},${getY(emaVal).toFixed(1)}`;
    })
    .join(' ');

  // Handle Order Submit
  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const execPrice = orderType === 'market' ? item.price : limitPrice;
    setOrderSuccess(
      `Successfully placed ${orderSide.toUpperCase()} order for ${orderQty} ${item.symbol} @ $${execPrice.toFixed(2)}!`
    );
    setTimeout(() => setOrderSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        id="superchart-modal-dialog"
        className={`relative bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] z-10 flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-6xl max-h-[92vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 bg-[#f7f9ff] border-b border-[#E0E3EB] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-2xs shrink-0"
              style={{ backgroundColor: item.badgeBgColor || '#0049db' }}
            >
              {item.badgeText || item.symbol.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-[#181c21] tracking-tight">{item.name}</h2>
                <span className="font-mono text-xs text-[#0049db] font-bold bg-[#dce1ff] px-2 py-0.5 rounded">
                  {item.symbol}
                </span>
                {item.exchange && (
                  <span className="text-[11px] font-mono text-[#6A6D78] hidden sm:inline">
                    {item.exchange}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-base tabular-nums text-[#181c21]">
                  {item.priceFormatted}
                </span>
                <span className={`font-semibold tabular-nums flex items-center gap-0.5 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}>
                  {isPositive ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                  {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Subtabs (Chart, Depth, Financials, News, Trade) */}
          <div className="flex bg-white p-1 rounded-xl border border-[#E0E3EB] text-xs">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'chart' ? 'bg-[#0049db] text-white shadow-2xs' : 'text-[#434656] hover:bg-[#f1f4fb]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Superchart</span>
            </button>
            <button
              onClick={() => setActiveTab('orderbook')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'orderbook' ? 'bg-[#0049db] text-white shadow-2xs' : 'text-[#434656] hover:bg-[#f1f4fb]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Depth / L2</span>
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'financials' ? 'bg-[#0049db] text-white shadow-2xs' : 'text-[#434656] hover:bg-[#f1f4fb]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Fundamentals</span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'news' ? 'bg-[#0049db] text-white shadow-2xs' : 'text-[#434656] hover:bg-[#f1f4fb]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>News</span>
            </button>
            <button
              onClick={() => setActiveTab('trade')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'trade' ? 'bg-[#089981] text-white shadow-2xs' : 'text-[#089981] bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trade</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => onToggleFavorite(item.id, e)}
              className="p-2 text-[#6A6D78] hover:text-amber-500 rounded-lg hover:bg-[#ebeef5] transition-colors"
              title="Toggle Favorite"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-[#6A6D78] hover:text-[#181c21] rounded-lg hover:bg-[#ebeef5] transition-colors hidden sm:block"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#6A6D78] hover:text-[#181c21] rounded-lg hover:bg-[#ebeef5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          
          {/* TAB 1: SUPERCHART */}
          {activeTab === 'chart' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              
              {/* Toolbar: Timeframes, Chart Type, Indicator Checkboxes */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E0E3EB]">
                
                {/* Timeframes */}
                <div className="flex bg-[#f7f9ff] p-1 rounded-lg border border-[#E0E3EB] text-xs">
                  {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 rounded font-semibold text-xs transition-colors ${
                        timeframe === tf 
                          ? 'bg-[#0049db] text-white shadow-2xs' 
                          : 'text-[#434656] hover:bg-[#ebeef5]'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Chart Type Style */}
                <div className="flex items-center gap-1.5 bg-[#f7f9ff] p-1 rounded-lg border border-[#E0E3EB] text-xs">
                  <button
                    onClick={() => setChartType('candlestick')}
                    className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
                      chartType === 'candlestick' ? 'bg-[#0049db] text-white' : 'text-[#434656] hover:bg-[#ebeef5]'
                    }`}
                  >
                    Candles
                  </button>
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
                      chartType === 'area' ? 'bg-[#0049db] text-white' : 'text-[#434656] hover:bg-[#ebeef5]'
                    }`}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-2.5 py-1 rounded font-medium text-xs transition-colors ${
                      chartType === 'line' ? 'bg-[#0049db] text-white' : 'text-[#434656] hover:bg-[#ebeef5]'
                    }`}
                  >
                    Line
                  </button>
                </div>

                {/* Indicator Checkboxes */}
                <div className="flex items-center gap-3 text-xs text-[#434656]">
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0049db]">
                    <input
                      type="checkbox"
                      checked={showEma20}
                      onChange={(e) => setShowEma20(e.target.checked)}
                      className="rounded text-[#0049db]"
                    />
                    <span className="font-semibold text-amber-600">EMA 20</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0049db]">
                    <input
                      type="checkbox"
                      checked={showRsi}
                      onChange={(e) => setShowRsi(e.target.checked)}
                      className="rounded text-[#0049db]"
                    />
                    <span className="font-semibold text-purple-600">RSI (14)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0049db]">
                    <input
                      type="checkbox"
                      checked={showMacd}
                      onChange={(e) => setShowMacd(e.target.checked)}
                      className="rounded text-[#0049db]"
                    />
                    <span className="font-semibold text-cyan-600">MACD</span>
                  </label>
                </div>

              </div>

              {/* OHLCV Crosshair Data Header */}
              <div className="bg-[#f7f9ff] p-2.5 rounded-xl border border-[#E0E3EB] flex flex-wrap items-center justify-between text-xs font-mono tabular-nums">
                <div className="flex flex-wrap items-center gap-4 text-[#434656]">
                  <span><strong className="text-[#181c21]">T:</strong> {activeDataPoint.time}</span>
                  <span><strong className="text-[#181c21]">O:</strong> {activeDataPoint.open.toFixed(2)}</span>
                  <span><strong className="text-[#181c21]">H:</strong> {activeDataPoint.high.toFixed(2)}</span>
                  <span><strong className="text-[#181c21]">L:</strong> {activeDataPoint.low.toFixed(2)}</span>
                  <span><strong className="text-[#181c21]">C:</strong> {activeDataPoint.close.toFixed(2)}</span>
                  <span><strong className="text-[#181c21]">Vol:</strong> {(activeDataPoint.volume / 1000).toFixed(0)}K</span>
                </div>
                {showRsi && activeDataPoint.rsi && (
                  <div className="text-purple-600 font-semibold">
                    RSI: {activeDataPoint.rsi} {activeDataPoint.rsi > 70 ? '(Overbought)' : activeDataPoint.rsi < 30 ? '(Oversold)' : '(Neutral)'}
                  </div>
                )}
              </div>

              {/* SVG Chart Main Canvas */}
              <div className="relative bg-[#ffffff] rounded-xl border border-[#E0E3EB] p-2 overflow-hidden select-none">
                <svg
                  viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`}
                  className="w-full h-auto max-h-[480px] overflow-visible"
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Grid Lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
                    const y = chartHeight * ratio;
                    const priceLabel = maxPrice - ratio * priceRange;
                    return (
                      <g key={idx}>
                        <line
                          x1="40"
                          y1={y}
                          x2={svgWidth - 50}
                          y2={y}
                          stroke="#f1f4fb"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={svgWidth - 45}
                          y={y + 3}
                          fontSize="10"
                          fill="#6A6D78"
                          fontFamily="monospace"
                        >
                          {priceLabel.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Volume Separator */}
                  <line
                    x1="40"
                    y1={chartHeight}
                    x2={svgWidth - 50}
                    y2={chartHeight}
                    stroke="#E0E3EB"
                    strokeWidth="1"
                  />
                  <text x="45" y={chartHeight + 12} fontSize="9" fill="#6A6D78" fontFamily="monospace">
                    VOL PROFILE
                  </text>

                  {/* Volume Bars */}
                  {history.map((p, idx) => {
                    const x = getX(idx);
                    const isUp = p.close >= p.open;
                    const vH = ((p.volume || 1000) / maxVol) * volumeHeight;
                    const y = chartHeight + volumeHeight - vH;

                    return (
                      <rect
                        key={`vol-${idx}`}
                        x={x - 3}
                        y={y}
                        width="6"
                        height={vH}
                        fill={isUp ? '#089981' : '#F23645'}
                        opacity="0.3"
                      />
                    );
                  })}

                  {/* Area Mode */}
                  {chartType === 'area' && (
                    <>
                      <defs>
                        <linearGradient id="superchart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0049db" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0049db" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill="url(#superchart-grad)" />
                      <path d={linePath} fill="none" stroke="#0049db" strokeWidth="2.5" />
                    </>
                  )}

                  {/* Line Mode */}
                  {chartType === 'line' && (
                    <path d={linePath} fill="none" stroke="#0049db" strokeWidth="2.5" />
                  )}

                  {/* Candlestick Mode */}
                  {chartType === 'candlestick' && (
                    history.map((p, idx) => {
                      const x = getX(idx);
                      const isUp = p.close >= p.open;
                      const candleColor = isUp ? '#089981' : '#F23645';
                      const top = getY(Math.max(p.open, p.close));
                      const bottom = getY(Math.min(p.open, p.close));
                      const candleHeight = Math.max(2, bottom - top);
                      const highY = getY(p.high);
                      const lowY = getY(p.low);

                      return (
                        <g 
                          key={idx} 
                          className="cursor-crosshair"
                          onMouseEnter={() => setHoveredPoint(p)}
                        >
                          {/* Upper & Lower Wick */}
                          <line
                            x1={x}
                            y1={highY}
                            x2={x}
                            y2={lowY}
                            stroke={candleColor}
                            strokeWidth="1.5"
                          />
                          {/* Body */}
                          <rect
                            x={x - 4}
                            y={top}
                            width="8"
                            height={candleHeight}
                            fill={candleColor}
                            rx="1"
                          />
                        </g>
                      );
                    })
                  )}

                  {/* EMA-20 Overlay */}
                  {showEma20 && (
                    <path
                      d={ema20Path}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="1.75"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* RSI Subpanel */}
                  {showRsi && (
                    <g transform={`translate(0, ${chartHeight + volumeHeight + 10})`}>
                      <line x1="40" y1="0" x2={svgWidth - 50} y2="0" stroke="#E0E3EB" strokeWidth="1" />
                      <text x="45" y="12" fontSize="9" fill="#9333ea" fontFamily="monospace" fontWeight="bold">
                        RSI (14)
                      </text>
                      <line x1="40" y1="20" x2={svgWidth - 50} y2="20" stroke="#f1f4fb" strokeDasharray="3 3" />
                      <line x1="40" y1="50" x2={svgWidth - 50} y2="50" stroke="#f1f4fb" strokeDasharray="3 3" />
                      <text x={svgWidth - 45} y="23" fontSize="8" fill="#6A6D78">70</text>
                      <text x={svgWidth - 45} y="53" fontSize="8" fill="#6A6D78">30</text>

                      {/* RSI Line */}
                      <path
                        d={history
                          .map((p, i) => {
                            const rVal = p.rsi || 50;
                            const rY = 65 - (rVal / 100) * 55;
                            return `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)},${rY.toFixed(1)}`;
                          })
                          .join(' ')}
                        fill="none"
                        stroke="#9333ea"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}

                  {/* MACD Subpanel */}
                  {showMacd && (
                    <g transform={`translate(0, ${chartHeight + volumeHeight + rsiHeight + 10})`}>
                      <line x1="40" y1="0" x2={svgWidth - 50} y2="0" stroke="#E0E3EB" strokeWidth="1" />
                      <text x="45" y="12" fontSize="9" fill="#0891b2" fontFamily="monospace" fontWeight="bold">
                        MACD (12, 26, 9)
                      </text>
                      {history.map((p, i) => {
                        const x = getX(i);
                        const h = (p.macdHist || 0) * 8;
                        return (
                          <rect
                            key={`macd-${i}`}
                            x={x - 2}
                            y={35 - (h > 0 ? h : 0)}
                            width="4"
                            height={Math.abs(h)}
                            fill={h >= 0 ? '#089981' : '#F23645'}
                            opacity="0.7"
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* X Axis Time Labels */}
                  {history
                    .filter((_, i) => i % Math.floor(history.length / 5) === 0)
                    .map((p, idx) => (
                      <text
                        key={idx}
                        x={getX(history.indexOf(p))}
                        y={totalSvgHeight - 10}
                        fontSize="10"
                        fill="#6A6D78"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {p.time}
                      </text>
                    ))}
                </svg>
              </div>

            </div>
          )}

          {/* TAB 2: ORDER BOOK & LEVEL 2 DEPTH */}
          {activeTab === 'orderbook' && (
            <div className="space-y-6 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Bids Ladder */}
                <div className="bg-[#f7f9ff] p-5 rounded-2xl border border-[#E0E3EB]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB] mb-3">
                    <span className="font-bold text-sm text-[#089981]">BIDS (BUY ORDERS)</span>
                    <span className="text-xs text-[#6A6D78] font-mono">Size / Total</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs tabular-nums">
                    {[
                      { price: (item.bid || item.price * 0.999).toFixed(2), size: 450, total: 450 },
                      { price: (item.price * 0.998).toFixed(2), size: 820, total: 1270 },
                      { price: (item.price * 0.997).toFixed(2), size: 1450, total: 2720 },
                      { price: (item.price * 0.996).toFixed(2), size: 2100, total: 4820 },
                      { price: (item.price * 0.995).toFixed(2), size: 3400, total: 8220 },
                    ].map((b, i) => (
                      <div key={i} className="flex justify-between items-center relative py-1 px-2 rounded hover:bg-emerald-50">
                        <div 
                          className="absolute inset-y-0 right-0 bg-emerald-200/40 rounded"
                          style={{ width: `${(b.total / 8500) * 100}%` }}
                        />
                        <span className="font-bold text-[#089981] relative z-10">{b.price}</span>
                        <span className="text-[#181c21] relative z-10">{b.size} ({b.total})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asks Ladder */}
                <div className="bg-[#f7f9ff] p-5 rounded-2xl border border-[#E0E3EB]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0E3EB] mb-3">
                    <span className="font-bold text-sm text-[#F23645]">ASKS (SELL ORDERS)</span>
                    <span className="text-xs text-[#6A6D78] font-mono">Size / Total</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs tabular-nums">
                    {[
                      { price: (item.ask || item.price * 1.001).toFixed(2), size: 380, total: 380 },
                      { price: (item.price * 1.002).toFixed(2), size: 760, total: 1140 },
                      { price: (item.price * 1.003).toFixed(2), size: 1620, total: 2760 },
                      { price: (item.price * 1.004).toFixed(2), size: 2450, total: 5210 },
                      { price: (item.price * 1.005).toFixed(2), size: 3100, total: 8310 },
                    ].map((a, i) => (
                      <div key={i} className="flex justify-between items-center relative py-1 px-2 rounded hover:bg-red-50">
                        <div 
                          className="absolute inset-y-0 right-0 bg-red-200/40 rounded"
                          style={{ width: `${(a.total / 8500) * 100}%` }}
                        />
                        <span className="font-bold text-[#F23645] relative z-10">{a.price}</span>
                        <span className="text-[#181c21] relative z-10">{a.size} ({a.total})</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: FUNDAMENTALS & VALUATION */}
          {activeTab === 'financials' && (
            <div className="space-y-6 animate-in fade-in duration-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#f7f9ff] p-4 rounded-xl border border-[#E0E3EB]">
                  <span className="text-xs text-[#6A6D78] block mb-1">Market Capitalization</span>
                  <span className="text-lg font-bold text-[#181c21] font-mono">{item.marketCap || 'N/A'}</span>
                </div>
                <div className="bg-[#f7f9ff] p-4 rounded-xl border border-[#E0E3EB]">
                  <span className="text-xs text-[#6A6D78] block mb-1">P/E Ratio (TTM)</span>
                  <span className="text-lg font-bold text-[#181c21] font-mono">{item.peRatio ? item.peRatio.toFixed(1) : 'N/A'}</span>
                </div>
                <div className="bg-[#f7f9ff] p-4 rounded-xl border border-[#E0E3EB]">
                  <span className="text-xs text-[#6A6D78] block mb-1">52-Week High</span>
                  <span className="text-lg font-bold text-[#181c21] font-mono">${(item.high52w || item.high24h).toFixed(2)}</span>
                </div>
                <div className="bg-[#f7f9ff] p-4 rounded-xl border border-[#E0E3EB]">
                  <span className="text-xs text-[#6A6D78] block mb-1">52-Week Low</span>
                  <span className="text-lg font-bold text-[#181c21] font-mono">${(item.low52w || item.low24h).toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[#f7f9ff] p-5 rounded-2xl border border-[#E0E3EB]">
                <h4 className="font-bold text-sm text-[#181c21] mb-2">Instrument Overview</h4>
                <p className="text-xs text-[#434656] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: NEWS */}
          {activeTab === 'news' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {articles.map((art) => (
                <div key={art.id} className="p-4 rounded-xl border border-[#E0E3EB] hover:bg-[#f7f9ff] transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0049db]">{art.source} • {art.timeAgo}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      art.sentiment === 'bullish' ? 'bg-emerald-100 text-[#089981]' : 'bg-gray-100 text-[#434656]'
                    }`}>
                      {art.sentiment}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#181c21] mb-1">{art.title}</h4>
                  <p className="text-xs text-[#434656] leading-relaxed">{art.snippet}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: SIMULATED TRADE EXECUTION */}
          {activeTab === 'trade' && (
            <div className="max-w-md mx-auto py-4 animate-in fade-in duration-100">
              <form onSubmit={handleExecuteTrade} className="bg-[#f7f9ff] p-6 rounded-2xl border border-[#E0E3EB] shadow-xs space-y-4">
                
                {orderSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#089981] rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{orderSuccess}</span>
                  </div>
                )}

                <div className="flex bg-white p-1 rounded-xl border border-[#E0E3EB]">
                  <button
                    type="button"
                    onClick={() => setOrderSide('buy')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors ${
                      orderSide === 'buy' ? 'bg-[#089981] text-white shadow-2xs' : 'text-[#434656]'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderSide('sell')}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors ${
                      orderSide === 'sell' ? 'bg-[#F23645] text-white shadow-2xs' : 'text-[#434656]'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#181c21] mb-1">Order Type</label>
                    <select
                      value={orderType}
                      onChange={(e: any) => setOrderType(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E0E3EB] rounded-lg font-medium"
                    >
                      <option value="market">Market</option>
                      <option value="limit">Limit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#181c21] mb-1">Quantity (Units)</label>
                    <input
                      type="number"
                      min={1}
                      value={orderQty}
                      onChange={(e) => setOrderQty(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E0E3EB] rounded-lg font-mono"
                    />
                  </div>
                </div>

                {orderType === 'limit' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#181c21] mb-1">Limit Price ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E0E3EB] rounded-lg font-mono"
                    />
                  </div>
                )}

                <div className="p-3 bg-white rounded-xl border border-[#E0E3EB] text-xs font-mono flex justify-between">
                  <span className="text-[#6A6D78]">Est. Total Value:</span>
                  <span className="font-bold text-[#181c21]">
                    ${((orderType === 'market' ? item.price : limitPrice) * orderQty).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-xs transition-colors ${
                    orderSide === 'buy' ? 'bg-[#089981] hover:bg-emerald-700' : 'bg-[#F23645] hover:bg-rose-700'
                  }`}
                >
                  Place {orderSide.toUpperCase()} Order
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
