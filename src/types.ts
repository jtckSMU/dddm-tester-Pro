export type MarketCategory = 'indices' | 'stocks' | 'crypto' | 'futures' | 'forex' | 'bonds';

export type NavigationTab = 'markets' | 'products' | 'community' | 'brokers' | 'more';

export type ProductSubTab = 'supercharts' | 'screeners' | 'heatmaps';

export type ChartTimeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL';

export type ChartType = 'candlestick' | 'area' | 'line' | 'hollow_candlestick';

export type TableViewMode = 'table' | 'grid' | 'compact';

export interface PricePoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHist?: number;
  bbUpper?: number;
  bbLower?: number;
  bbMiddle?: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  region?: string;
  exchange?: string;
  badgeText: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  price: number;
  priceFormatted: string;
  change: number;
  changePercent: number;
  volume: string;
  avgVolume?: string;
  high24h: number;
  low24h: number;
  high52w?: number;
  low52w?: number;
  prevClose: number;
  openPrice: number;
  marketCap?: string;
  peRatio?: number;
  dividendYield?: string;
  beta?: number;
  sparkline: number[];
  history: Record<ChartTimeframe, PricePoint[]>;
  technicalRating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  description: string;
  sector?: string;
  isFavorite?: boolean;
  lastUpdated?: number;
  tickDirection?: 'up' | 'down';
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  triggered?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  url?: string;
  snippet: string;
}

export interface TradingIdea {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  symbol: string;
  direction: 'Long' | 'Short' | 'Neutral';
  timeframe: string;
  likes: number;
  comments: number;
  publishedAt: string;
  description: string;
}

export interface BrokerInfo {
  id: string;
  name: string;
  logoText: string;
  rating: number;
  reviewsCount: number;
  minDeposit: string;
  leverage: string;
  regulation: string;
  instruments: string[];
  features: string[];
  popular?: boolean;
}
