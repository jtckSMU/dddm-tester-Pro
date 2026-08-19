import React from 'react';
import { ShieldCheck, Star, ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import { brokerList } from '../data/marketData';

export const BrokersView: React.FC = () => {
  return (
    <div id="brokers-view" className="w-full py-8 md:py-12 bg-[#f7f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-bold text-3xl text-[#181c21] tracking-tight mb-2">
            Integrated Global Brokers
          </h2>
          <p className="text-sm text-[#6A6D78]">
            Execute trades directly from MarketView Supercharts through verified tier-1 brokers with low commissions and DMA execution.
          </p>
        </div>

        {/* Broker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brokerList.map((broker) => (
            <div
              key={broker.id}
              className="bg-white rounded-2xl p-6 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              {broker.popular && (
                <span className="absolute -top-3 right-6 bg-[#0049db] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0049db] text-white font-bold text-base flex items-center justify-center shadow-xs">
                    {broker.logoText}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#181c21]">{broker.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6A6D78]">
                      <div className="flex text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                      <span className="font-bold text-[#181c21]">{broker.rating}</span>
                      <span>({broker.reviewsCount.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 py-4 border-y border-[#E0E3EB] text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6A6D78]">Min Deposit:</span>
                    <span className="font-semibold text-[#181c21] font-mono">{broker.minDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A6D78]">Leverage:</span>
                    <span className="font-semibold text-[#181c21] font-mono">{broker.leverage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6A6D78]">Regulation:</span>
                    <span className="font-semibold text-[#181c21]">{broker.regulation}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-1.5 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A6D78] block mb-2">
                    Key Features
                  </span>
                  {broker.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#434656]">
                      <Check className="w-3.5 h-3.5 text-[#089981] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-[#f1f4fb] hover:bg-[#0049db] hover:text-white text-[#0049db] font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#E0E3EB]">
                <span>Connect Account</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
