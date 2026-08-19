import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe2, 
  Database, 
  HelpCircle,
  FileText
} from 'lucide-react';

export const MoreView: React.FC = () => {
  return (
    <div id="more-view" className="w-full py-8 md:py-12 bg-[#f7f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-bold text-3xl text-[#181c21] tracking-tight mb-2">
            About MarketView Architecture
          </h2>
          <p className="text-sm text-[#6A6D78]">
            Engineered for high-frequency financial market monitoring, institutional research, and advanced algorithmic visualization.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-[#E0E3EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#2962ff]/10 text-[#0049db] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#181c21] mb-1">Ultra Low Latency Feeds</h3>
            <p className="text-xs text-[#434656] leading-relaxed">
              Sub-millisecond market tick processing with real-time browser canvas and SVG rendering pipelines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E3EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#089981] flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#181c21] mb-1">Multi-Asset Coverage</h3>
            <p className="text-xs text-[#434656] leading-relaxed">
              Indices, equities, crypto, commodities, forex, and sovereign yield curves unified into a single precision schema.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E0E3EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#181c21] mb-1">Quantitative Analytics</h3>
            <p className="text-xs text-[#434656] leading-relaxed">
              Automated technical score calculations across RSI, Moving Averages, MACD, Bollinger Bands, and volume deltas.
            </p>
          </div>
        </div>

        {/* Pricing / Tiers */}
        <div className="bg-white rounded-2xl border border-[#E0E3EB] p-8 max-w-4xl mx-auto shadow-xs text-center">
          <h3 className="font-bold text-2xl text-[#181c21] mb-2">MarketView Professional</h3>
          <p className="text-xs text-[#6A6D78] max-w-md mx-auto mb-6">
            Get unrestricted access to institutional level tick data, 100+ technical indicators, unlimited watchlists, and custom Pine-compatible scripts.
          </p>
          <div className="flex justify-center items-baseline gap-2 mb-6">
            <span className="text-4xl font-extrabold text-[#181c21]">$14.95</span>
            <span className="text-xs text-[#6A6D78]">/ month (billed annually)</span>
          </div>
          <button className="bg-[#2962ff] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#0049db] transition-colors shadow-xs">
            Start 30-Day Free Trial
          </button>
        </div>

      </div>
    </div>
  );
};
