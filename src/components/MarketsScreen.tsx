import React, { useState } from 'react';
import { AssetQuote, MacroIndicator, EarningsEntry } from '../types/market';
import {
  MAJOR_INDICES,
  WORLD_INDICES,
  MEGA_TECH_STOCKS,
  COMMUNITY_TRENDS,
  HIGHEST_VOLUME_STOCKS,
  MOST_VOLATILE_STOCKS,
  EARNINGS_CALENDAR,
  CRYPTO_ASSETS,
  CRYPTO_TVL_RANKING,
  CRYPTO_EXTREMES,
  FUTURES_COMMODITIES,
  FOREX_CURRENCIES,
  US_TREASURY_YIELDS,
  MAJOR_SOVEREIGNS_10Y,
  MACRO_INDICATORS,
} from '../data/mockData';

interface MarketsScreenProps {
  onSelectSymbol: (symbol: string) => void;
  onOpenSuperchart: (symbol: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const MarketsScreen: React.FC<MarketsScreenProps> = ({
  onSelectSymbol,
  onOpenSuperchart,
  onNavigateTab,
}) => {
  const [activeSegment, setActiveSegment] = useState<string>('US stocks');
  const [regionMenuOpen, setRegionMenuOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('Americas & Global');
  const [cryptoSubFilter, setCryptoSubFilter] = useState<'Market Cap' | 'TVL' | 'DeFi'>('Market Cap');

  const segments = [
    { label: 'US stocks', id: 'indices' },
    { label: 'World stocks', id: 'world-indices' },
    { label: 'Crypto', id: 'crypto' },
    { label: 'Futures', id: 'futures' },
    { label: 'Forex', id: 'forex' },
    { label: 'Government bonds', id: 'bonds' },
    { label: 'Corporate bonds', id: 'bonds' },
    { label: 'ETFs', id: 'indices' },
    { label: 'Economy', id: 'economy' },
  ];

  const scrollToSection = (id: string, label: string) => {
    setActiveSegment(label);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF]">
      {/* Macro Market Header & Category Anchor Ribbon */}
      <section className="w-full bg-[#FFFFFF] pt-6 pb-4 border-b-0">
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          {/* Page Hero Title with TV Chevron Dropdown Affordance */}
          <div className="relative mb-6">
            <div
              onClick={() => setRegionMenuOpen(!regionMenuOpen)}
              className="inline-flex items-center gap-2 cursor-pointer group select-none"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#131722] tracking-tight group-hover:text-[#2962ff] transition-colors">
                Markets, everywhere
              </h1>
              <span className="material-symbols-outlined text-[36px] text-[#131722] group-hover:text-[#2962ff] group-hover:translate-y-0.5 transition-all">
                expand_more
              </span>
            </div>

            {/* Region Dropdown Filter */}
            {regionMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E0E3EB] py-2 z-30 text-left">
                <div className="px-4 py-2 border-b border-[#F0F3FA] text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
                  Select Market Region
                </div>
                {[
                  'Americas & Global',
                  'United States (NYSE, NASDAQ)',
                  'Europe (LSE, DAX, Euronext)',
                  'Asia-Pacific (Tokyo, Hong Kong)',
                  'Emerging & Frontier Markets',
                ].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      setSelectedRegion(reg);
                      setRegionMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-xs font-semibold hover:bg-[#F0F3FA] flex items-center justify-between ${
                      selectedRegion === reg ? 'text-[#2962ff] bg-[#F8F9FD]' : 'text-[#131722]'
                    }`}
                  >
                    <span>{reg}</span>
                    {selectedRegion === reg && <span className="w-2 h-2 rounded-full bg-[#2962ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Segment Pills Navigation Bar */}
          <div className="w-full overflow-x-auto no-scrollbar py-1 flex items-center justify-start md:justify-center gap-2">
            {segments.map((seg) => (
              <button
                key={seg.label}
                onClick={() => scrollToSection(seg.id, seg.label)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeSegment === seg.label
                    ? 'bg-[#131722] text-white shadow-sm'
                    : 'bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] hover:bg-[#e5e8f4]'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Financial Modules Container */}
      <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 flex flex-col gap-8">
        {/* SECTION 1: INDICES */}
        <section className="flex flex-col gap-3" id="indices">
          {/* Section Title Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('supercharts')}
              className="inline-flex items-center gap-1 text-xl md:text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors group cursor-pointer"
            >
              Indices
              <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#787B86]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
              US Markets Open (Delayed 15m)
            </div>
          </div>

          {/* US Major Highlight Ticker Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
            {MAJOR_INDICES.map((idx) => {
              const isPositive = idx.changePercent >= 0;
              return (
                <div
                  key={idx.symbol}
                  onClick={() => onSelectSymbol(idx.symbol)}
                  className="bg-[#F0F3FA] hover:bg-[#ebedfa] transition-colors rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold"
                        style={{ backgroundColor: idx.badgeBg }}
                      >
                        {idx.badge}
                      </span>
                      <span className="text-xs font-bold text-[#131722]">{idx.symbol}</span>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        isPositive ? 'bg-[#E8F5F2] text-[#089981]' : 'bg-[#FDECEE] text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : '−'}
                      {Math.abs(idx.changePercent).toFixed(2)}%
                    </span>
                  </div>

                  {/* Sparkline chart */}
                  <div className="my-2 h-8 flex items-center">
                    <svg
                      className={`w-full h-7 ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}
                      fill="none"
                      viewBox="0 0 140 30"
                    >
                      <path
                        d={
                          isPositive
                            ? 'M2 24 L24 20 L48 25 L72 14 L96 17 L120 7 L138 3'
                            : 'M2 6 L30 8 L60 16 L88 12 L112 22 L138 25'
                        }
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                      {isPositive && (
                        <>
                          <defs>
                            <linearGradient id={`g-${idx.badge}`} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M2 24 L24 20 L48 25 L72 14 L96 17 L120 7 L138 3 V 30 H 2 Z"
                            fill={`url(#g-${idx.badge})`}
                          />
                        </>
                      )}
                    </svg>
                  </div>

                  <div className="flex items-baseline justify-between font-mono text-xs text-[#131722]">
                    <span className="font-bold">
                      {idx.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : '−'}
                      {Math.abs(idx.change).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* World Indices Horizontal Snapshot Band */}
          <div className="bg-[#F8F9FD] rounded-2xl p-3.5 border border-[#E0E3EB]/60" id="world-indices">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#131722]">World indices</span>
              <button
                onClick={() => onNavigateTab('supercharts')}
                className="text-xs font-semibold text-[#2962ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                See all major indices
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {WORLD_INDICES.map((w) => (
                <div
                  key={w.symbol}
                  onClick={() => onSelectSymbol(w.symbol)}
                  className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E0E3EB]/50 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#131722]">{w.symbol}</span>
                      <span className="text-[10px] text-[#787B86] truncate">{w.name}</span>
                    </div>
                    <span className="font-mono text-xs text-[#131722] font-semibold">{w.price}</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                      w.isPositive ? 'bg-[#E8F5F2] text-[#089981]' : 'bg-[#FDECEE] text-[#F23645]'
                    }`}
                  >
                    {w.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: US STOCKS & MARKET MOVERS */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('screeners')}
              className="inline-flex items-center gap-1 text-xl md:text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors group cursor-pointer"
            >
              US stocks
              <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>

          {/* Mega Tech Leadership Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {MEGA_TECH_STOCKS.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => onSelectSymbol(stock.symbol)}
                  className="bg-[#F0F3FA] p-3.5 rounded-2xl hover:bg-[#ebedfa] transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#131722]">{stock.symbol}</span>
                    <span
                      className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                        isPositive ? 'bg-[#E8F5F2] text-[#089981]' : 'bg-[#FDECEE] text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : '−'}
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-xs text-[#787B86] mt-1 truncate">{stock.name}</span>
                  <div className="font-mono text-sm font-bold text-[#131722] mt-2">
                    ${stock.price.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Community Trends Carousel/Pill Row */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
              Community trends
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {COMMUNITY_TRENDS.map((trend) => (
                <div
                  key={trend.symbol}
                  onClick={() => onSelectSymbol(trend.symbol)}
                  className="px-3.5 py-1.5 rounded-full bg-[#F8F9FD] border border-[#E0E3EB]/50 hover:bg-[#F0F3FA] cursor-pointer transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <span className="text-xs font-bold text-[#131722]">{trend.symbol}</span>
                  <span className="text-xs text-[#787B86]">{trend.name}</span>
                  <span
                    className={`text-[11px] font-semibold ${
                      trend.isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {trend.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Dive 3-Column Movers Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-1">
            {/* Widget 1: Highest Volume Stocks */}
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#131722] flex items-center gap-1">
                    Highest volume stocks
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
                  <span className="text-[11px] text-[#787B86]">Vol / Chg</span>
                </div>
                <div className="space-y-1">
                  {HIGHEST_VOLUME_STOCKS.map((s) => (
                    <div
                      key={s.symbol}
                      onClick={() => onSelectSymbol(s.symbol)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#131722]">{s.symbol}</div>
                        <div className="text-[11px] text-[#787B86]">{s.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-[#131722]">{s.vol}</div>
                        <div
                          className={`text-[11px] font-semibold ${
                            s.isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {s.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('screeners')}
                className="mt-3 pt-2 text-center text-xs font-semibold text-[#2962ff] hover:underline"
              >
                See all most actively traded stocks
              </button>
            </div>

            {/* Widget 2: Most Volatile Stocks */}
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#131722] flex items-center gap-1">
                    Most volatile stocks
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
                  <span className="text-[11px] text-[#787B86]">Volatility</span>
                </div>
                <div className="space-y-1">
                  {MOST_VOLATILE_STOCKS.map((s) => (
                    <div
                      key={s.symbol}
                      onClick={() => onSelectSymbol(s.symbol)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#131722]">{s.symbol}</div>
                        <div className="text-[11px] text-[#787B86]">{s.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-[#131722]">{s.vol}</div>
                        <div
                          className={`text-[11px] font-semibold ${
                            s.isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {s.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('screeners')}
                className="mt-3 pt-2 text-center text-xs font-semibold text-[#2962ff] hover:underline"
              >
                See all stocks with biggest changes
              </button>
            </div>

            {/* Widget 3: Earnings Calendar */}
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#131722] flex items-center gap-1">
                    Earnings calendar
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
                  <span className="text-[11px] bg-[#2962ff]/10 text-[#2962ff] px-2 py-0.5 rounded font-bold">
                    Today
                  </span>
                </div>
                <div className="space-y-1">
                  {EARNINGS_CALENDAR.map((e) => (
                    <div
                      key={e.symbol}
                      onClick={() => onSelectSymbol(e.symbol)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#131722]">{e.symbol}</div>
                        <div className="text-[11px] text-[#787B86]">{e.name}</div>
                      </div>
                      <div className="text-right text-[11px]">
                        {e.reportedEps !== null ? (
                          <>
                            <div className="text-[#787B86]">
                              Est: <span className="font-mono text-[#131722]">{e.estimateEps} USD</span>
                            </div>
                            <div
                              className={`font-semibold ${
                                e.reportedEps >= (e.estimateEps || 0)
                                  ? 'text-[#089981]'
                                  : 'text-[#F23645]'
                              }`}
                            >
                              {e.reportedEps >= (e.estimateEps || 0) ? 'Beat: ' : 'Miss: '}
                              {e.reportedEps} USD
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-[#787B86]">
                              Est: <span className="font-mono text-[#131722]">—</span>
                            </div>
                            <div className="text-[#787B86] font-medium">{e.releaseTime}</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="mt-3 pt-2 text-center text-xs font-semibold text-[#2962ff] hover:underline"
              >
                View full earnings schedule
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: CRYPTOCURRENCIES */}
        <section className="flex flex-col gap-3" id="crypto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('supercharts')}
              className="inline-flex items-center gap-1 text-xl md:text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors group cursor-pointer"
            >
              Crypto
              <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
            <div className="flex items-center gap-1">
              {(['Market Cap', 'TVL', 'DeFi'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCryptoSubFilter(tab)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    cryptoSubFilter === tab
                      ? 'bg-[#131722] text-white'
                      : 'bg-[#F0F3FA] text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Top Crypto Assets 4-Card Hero Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CRYPTO_ASSETS.map((crypto) => {
              const isPositive = crypto.changePercent >= 0;
              return (
                <div
                  key={crypto.symbol}
                  onClick={() => onSelectSymbol(crypto.symbol)}
                  className="bg-[#F0F3FA] p-4 rounded-2xl hover:bg-[#ebedfa] transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: crypto.badgeBg }}
                        >
                          {crypto.badge}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#131722]">{crypto.name}</div>
                          <div className="text-[10px] text-[#787B86]">
                            {crypto.symbol}/USD
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                          isPositive ? 'bg-[#E8F5F2] text-[#089981]' : 'bg-[#FDECEE] text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : '−'}
                        {Math.abs(crypto.changePercent).toFixed(2)}%
                      </span>
                    </div>

                    <div className="font-mono text-xl font-bold text-[#131722] mt-3">
                      ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-[#787B86] mt-0.5">Cap: {crypto.marketCap}</div>
                  </div>

                  <div className="mt-3 h-7">
                    <svg
                      className={`w-full h-full ${isPositive ? 'text-[#089981]' : 'text-[#F23645]'}`}
                      fill="none"
                      viewBox="0 0 100 25"
                    >
                      <path
                        d={
                          isPositive
                            ? 'M0 20 L20 18 L40 10 L60 12 L80 4 L100 2'
                            : 'M0 5 L30 8 L55 18 L80 15 L100 22'
                        }
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TVL Ranking & Gainers/Losers Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* TVL Ranking */}
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#131722] flex items-center gap-1">
                  TVL ranking
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </span>
                <span className="text-[11px] text-[#787B86]">Locked Value</span>
              </div>
              <div className="space-y-1">
                {CRYPTO_TVL_RANKING.map((tvl) => (
                  <div
                    key={tvl.symbol}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-[#787B86] font-mono w-4">{tvl.rank}</span>
                      <div>
                        <span className="text-xs font-bold text-[#131722]">{tvl.symbol}</span>
                        <span className="text-[#787B86] font-mono text-[11px] ml-2">{tvl.ticker}</span>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#131722]">{tvl.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Extremes */}
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#131722]">Daily extremes</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-[#089981] font-bold bg-[#E8F5F2] px-2 py-0.5 rounded">
                    Top Gainers
                  </span>
                  <span className="text-[#F23645] font-bold bg-[#FDECEE] px-2 py-0.5 rounded">
                    Top Losers
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Gainers */}
                <div className="space-y-1">
                  {CRYPTO_EXTREMES.gainers.map((g) => (
                    <div
                      key={g.symbol}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-[#131722]">{g.symbol}</span>
                      <span className="font-mono text-xs text-[#089981] font-bold">{g.change}</span>
                    </div>
                  ))}
                </div>
                {/* Losers */}
                <div className="space-y-1">
                  {CRYPTO_EXTREMES.losers.map((l) => (
                    <div
                      key={l.symbol}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-[#131722]">{l.symbol}</span>
                      <span className="font-mono text-xs text-[#F23645] font-bold">{l.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: FUTURES, COMMODITIES & FOREX DUAL COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Futures & Commodities */}
          <section className="flex flex-col gap-3" id="futures">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xl md:text-2xl font-bold text-[#131722]">
                Futures & Commodities
                <span className="material-symbols-outlined text-[24px]">chevron_right</span>
              </span>
            </div>
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 flex flex-col gap-2">
              {FUTURES_COMMODITIES.map((f) => {
                const isPositive = f.changePercent >= 0;
                return (
                  <div
                    key={f.symbol}
                    onClick={() => onSelectSymbol(f.symbol)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E0E3EB]/50 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: f.badgeBg }}
                      >
                        {f.badge}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#131722]">{f.symbol}</div>
                        <div className="text-[10px] text-[#787B86]">{f.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#131722]">
                        ${f.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-[11px] font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : '−'}
                        {Math.abs(f.changePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Forex & Currencies */}
          <section className="flex flex-col gap-3" id="forex">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xl md:text-2xl font-bold text-[#131722]">
                Forex & Currencies
                <span className="material-symbols-outlined text-[24px]">chevron_right</span>
              </span>
            </div>
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 flex flex-col gap-2">
              {FOREX_CURRENCIES.map((fx) => {
                const isPositive = fx.changePercent >= 0;
                return (
                  <div
                    key={fx.symbol}
                    onClick={() => onSelectSymbol(fx.symbol)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E0E3EB]/50 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-[11px]"
                        style={{ backgroundColor: fx.badgeBg }}
                      >
                        {fx.badge}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#131722]">{fx.symbol}</div>
                        <div className="text-[10px] text-[#787B86]">{fx.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs font-bold text-[#131722]">
                        {fx.price.toFixed(fx.price > 100 ? 2 : 4)}
                      </div>
                      <div
                        className={`text-[11px] font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : '−'}
                        {Math.abs(fx.changePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* SECTION 5: GOVERNMENT & CORPORATE BONDS */}
        <section className="flex flex-col gap-3" id="bonds">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xl md:text-2xl font-bold text-[#131722]">
              Bonds & Rates
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </span>
            <button
              onClick={() => onNavigateTab('supercharts')}
              className="text-xs font-semibold text-[#2962ff] hover:underline"
            >
              Customize yield curves
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* US Treasury Yields with Dynamic Curve */}
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#131722]">US Treasury Yields</h3>
                  <span className="text-[11px] text-[#787B86]">Yield / Change</span>
                </div>
                <div className="space-y-1">
                  {US_TREASURY_YIELDS.map((b) => (
                    <div
                      key={b.symbol}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#131722]">{b.symbol}</span>
                        <span className="text-[11px] text-[#787B86]">{b.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[#131722]">{b.yield}</span>
                        <span className="text-[11px] text-[#F23645] ml-2 font-mono">{b.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-1">
                <svg className="w-full h-10 text-[#2962ff]" fill="none" viewBox="0 0 300 40">
                  <path
                    d="M5 32 C 60 22, 140 12, 295 5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                  <circle cx="5" cy="32" fill="currentColor" r="3" />
                  <circle cx="70" cy="22" fill="currentColor" r="3" />
                  <circle cx="160" cy="12" fill="currentColor" r="3" />
                  <circle cx="295" cy="5" fill="currentColor" r="3" />
                </svg>
              </div>
            </div>

            {/* Global Sovereign 10Y Yields */}
            <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#131722]">Major 10Y Sovereigns</h3>
                  <span className="text-[11px] text-[#787B86]">Yield / Change</span>
                </div>
                <div className="space-y-1">
                  {MAJOR_SOVEREIGNS_10Y.map((s) => (
                    <div
                      key={s.symbol}
                      className="flex items-center justify-between p-1.5 rounded hover:bg-[#F0F3FA] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#131722]">{s.symbol}</span>
                        <span className="text-[11px] text-[#787B86]">{s.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-[#131722]">{s.yield}</span>
                        <span className="text-[11px] text-[#F23645] ml-2 font-mono">{s.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="mt-4 pt-1 text-center text-xs font-semibold text-[#2962ff] hover:underline"
              >
                Compare international bond curves
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 6: ETFS & ECONOMIC MATRIX HEATMAP */}
        <section className="flex flex-col gap-3" id="economy">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('calendar')}
              className="inline-flex items-center gap-1 text-xl md:text-2xl font-bold text-[#131722] hover:text-[#2962ff] transition-colors group cursor-pointer"
            >
              World economy & Macro indicators
              <span className="material-symbols-outlined text-[24px] group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </button>
          </div>

          {/* Macro Indicators Heatmap Grid Table */}
          <div className="bg-[#F8F9FD] rounded-2xl p-4 border border-[#E0E3EB]/60 overflow-x-auto">
            <div className="min-w-[720px]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#787B86] border-b border-[#E0E3EB]/50">
                    <th className="pb-2.5 font-semibold">Country</th>
                    <th className="pb-2.5 text-right font-semibold">GDP (USD)</th>
                    <th className="pb-2.5 text-right font-semibold">Growth YoY</th>
                    <th className="pb-2.5 text-right font-semibold">Interest Rate</th>
                    <th className="pb-2.5 text-right font-semibold">Inflation Rate</th>
                    <th className="pb-2.5 text-right font-semibold">Unemployment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E3EB]/30">
                  {MACRO_INDICATORS.map((m) => {
                    const isGrowthPositive = m.growthYoY >= 0;
                    return (
                      <tr key={m.code} className="hover:bg-[#F0F3FA] transition-colors">
                        <td className="py-2.5 font-bold text-[#131722] flex items-center gap-2">
                          <span className="text-base">{m.flag}</span>
                          <span>{m.country}</span>
                        </td>
                        <td className="py-2.5 text-right font-mono text-[#131722]">{m.gdp}</td>
                        <td
                          className={`py-2.5 text-right font-mono font-semibold ${
                            isGrowthPositive ? 'text-[#089981]' : 'text-[#F23645]'
                          }`}
                        >
                          {isGrowthPositive ? '+' : '−'}
                          {Math.abs(m.growthYoY).toFixed(1)}%
                        </td>
                        <td className="py-2.5 text-right font-mono text-[#131722]">
                          {m.interestRate.toFixed(2)}%
                        </td>
                        <td
                          className={`py-2.5 text-right font-mono font-semibold ${
                            m.inflationRate > 2.0 ? 'text-[#F23645]' : 'text-[#089981]'
                          }`}
                        >
                          {m.inflationRate.toFixed(2)}%
                        </td>
                        <td className="py-2.5 text-right font-mono text-[#787B86]">
                          {m.unemployment.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Visual Interactive Footnote Ribbon: Real-time Data Badging */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#F0F3FA] border border-[#E0E3EB]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#2962ff] text-[26px]">verified</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#131722]">Institutional Grade Streaming</span>
              <span className="text-[11px] text-[#787B86]">
                Low-latency ticks powered by ICE, NASDAQ and national direct book feeds.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('screeners')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#131722] hover:bg-[#ebedfa] border border-[#E0E3EB] transition-colors cursor-pointer"
            >
              Configure Layout
            </button>
            <button
              onClick={() => onNavigateTab('supercharts')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#2962ff] text-white hover:bg-[#0049db] shadow-xs transition-all cursor-pointer"
            >
              Launch Supercharts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
