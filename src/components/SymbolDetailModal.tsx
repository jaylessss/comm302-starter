import React, { useState, useMemo } from 'react';
import { X, Bookmark, Share2, CandlestickChart, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { AssetQuote } from '../types/market';
import { generateCandleSeries } from '../data/mockData';

interface SymbolDetailModalProps {
  quote: AssetQuote | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSuperchart: (symbol: string) => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  quote,
  isOpen,
  onClose,
  onOpenSuperchart,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');

  // Generate simulated chart series based on timeframe
  const chartPoints = useMemo(() => {
    if (!quote) return [];
    const base = quote.price;
    const count = activeTimeframe === '1D' ? 30 : activeTimeframe === '5D' ? 45 : 60;
    const vol = activeTimeframe === '1D' ? 0.008 : activeTimeframe === '1Y' ? 0.04 : 0.02;
    const candles = generateCandleSeries(base, count, vol);
    return candles.map((c) => c.close);
  }, [quote, activeTimeframe]);

  if (!isOpen || !quote) return null;

  const isPositive = quote.changePercent >= 0;
  const minVal = Math.min(...chartPoints);
  const maxVal = Math.max(...chartPoints);
  const range = maxVal - minVal || 1;

  // Generate SVG path for interactive curve
  const width = 600;
  const height = 180;
  const paddingY = 20;

  const pointsString = chartPoints
    .map((val, idx) => {
      const x = (idx / (chartPoints.length - 1)) * width;
      const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const areaString = `0,${height} ${pointsString} ${width},${height}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#131722]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E0E3EB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F0F3FA] border border-[#E0E3EB] flex items-center justify-center font-bold text-sm text-[#131722]">
              {quote.badge || quote.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722] tracking-tight">{quote.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-[#F0F3FA] text-[#787B86] font-medium border border-[#E0E3EB]">
                  {quote.exchange || 'EXCHANGE'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#F8F9FD] text-[#2962ff] font-semibold">
                  {quote.category.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-[#787B86]">{quote.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onToggleWatchlist(quote.symbol)}
              className={`p-2 rounded-xl border transition-colors ${
                isWatchlisted
                  ? 'bg-[#2962ff]/10 border-[#2962ff] text-[#2962ff]'
                  : 'bg-white border-[#E0E3EB] text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-[#2962ff]' : ''}`} />
            </button>

            <button
              onClick={() => onOpenSuperchart(quote.symbol)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2962ff] text-white text-xs font-bold hover:bg-[#0049db] shadow-sm transition-all"
            >
              <CandlestickChart className="w-4 h-4" />
              <span className="hidden sm:inline">Open Superchart</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Price Delta Highlights */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#131722] tracking-tight">
                {quote.price > 1000
                  ? quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : quote.price.toFixed(quote.category === 'forex' ? 4 : 2)}
                <span className="text-base font-normal text-[#787B86] ml-2">USD</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-sm font-bold px-2 py-0.5 rounded ${
                    isPositive ? 'bg-[#E8F5F2] text-[#089981]' : 'bg-[#FDECEE] text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {quote.change.toFixed(2)} ({isPositive ? '+' : ''}
                  {quote.changePercent.toFixed(2)}%)
                </span>
                <span className="text-xs text-[#787B86]">Today's Market Return</span>
              </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center bg-[#F0F3FA] p-1 rounded-full border border-[#E0E3EB]">
              {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeTimeframe === tf
                      ? 'bg-white text-[#131722] shadow-2xs font-bold'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="w-full bg-[#F8F9FD] rounded-xl p-3 border border-[#E0E3EB] relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-44 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? '#089981' : '#F23645'}
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? '#089981' : '#F23645'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>
              <polygon points={areaString} fill="url(#detailGradient)" />
              <polyline
                fill="none"
                stroke={isPositive ? '#089981' : '#F23645'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />
            </svg>
            <div className="flex justify-between text-[11px] text-[#787B86] mt-1 font-mono">
              <span>Low: ${minVal.toFixed(2)}</span>
              <span>High: ${maxVal.toFixed(2)}</span>
            </div>
          </div>

          {/* Key Fundamentals & Statistics Grid */}
          <div>
            <h3 className="text-sm font-bold text-[#131722] uppercase tracking-wider mb-3">
              Key Fundamentals & Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#F0F3FA] rounded-xl">
                <span className="text-xs text-[#787B86] block">Market Cap</span>
                <span className="text-sm font-bold font-mono text-[#131722] mt-0.5 block">
                  {quote.marketCap || '$2.14 T'}
                </span>
              </div>
              <div className="p-3 bg-[#F0F3FA] rounded-xl">
                <span className="text-xs text-[#787B86] block">Volume</span>
                <span className="text-sm font-bold font-mono text-[#131722] mt-0.5 block">
                  {quote.volume || '68.4 M'}
                </span>
              </div>
              <div className="p-3 bg-[#F0F3FA] rounded-xl">
                <span className="text-xs text-[#787B86] block">P/E Ratio</span>
                <span className="text-sm font-bold font-mono text-[#131722] mt-0.5 block">
                  {quote.pe ? `${quote.pe}x` : '32.4x'}
                </span>
              </div>
              <div className="p-3 bg-[#F0F3FA] rounded-xl">
                <span className="text-xs text-[#787B86] block">Sector</span>
                <span className="text-sm font-bold text-[#131722] mt-0.5 block truncate">
                  {quote.sector || 'Global Capital'}
                </span>
              </div>
            </div>
          </div>

          {/* Range Gauges (Day & 52-Week) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8F9FD] p-4 rounded-xl border border-[#E0E3EB]">
            <div>
              <div className="flex justify-between text-xs text-[#787B86] mb-1">
                <span>Day's Range</span>
                <span className="font-mono text-[#131722] font-semibold">
                  ${(quote.open ? quote.open * 0.99 : quote.price * 0.985).toFixed(2)} — $
                  {(quote.open ? quote.open * 1.01 : quote.price * 1.015).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-[#E0E3EB] h-2 rounded-full overflow-hidden">
                <div className="bg-[#2962ff] h-full rounded-full w-[65%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#787B86] mb-1">
                <span>52-Week Range</span>
                <span className="font-mono text-[#131722] font-semibold">
                  ${(quote.low52w || quote.price * 0.65).toFixed(2)} — $
                  {(quote.high52w || quote.price * 1.15).toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-[#E0E3EB] h-2 rounded-full overflow-hidden">
                <div className="bg-[#089981] h-full rounded-full w-[82%]" />
              </div>
            </div>
          </div>

          {/* Analyst Consensus Gauge */}
          <div className="flex items-center justify-between p-4 bg-[#F0F3FA] rounded-xl">
            <div>
              <span className="text-xs text-[#787B86] uppercase font-semibold">Analyst Consensus</span>
              <div className="text-lg font-bold text-[#089981] flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#089981]" />
                Strong Buy (84% Buy Rating)
              </div>
              <span className="text-xs text-[#787B86]">Based on 42 institutional wall-street analyst price targets</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#787B86] block">Average Price Target</span>
              <span className="text-base font-bold font-mono text-[#131722]">
                ${(quote.price * 1.18).toFixed(2)} (+18.0%)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8F9FD] border-t border-[#E0E3EB] flex items-center justify-between">
          <span className="text-xs text-[#787B86]">Real-time quotes provided by ICE, Nasdaq, and NYSE</span>
          <button
            onClick={() => onOpenSuperchart(quote.symbol)}
            className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#2962ff] hover:bg-[#0049db] transition-colors flex items-center gap-1.5"
          >
            <span>Launch Full Supercharts Terminal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
