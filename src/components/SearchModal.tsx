import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowUpRight, CandlestickChart } from 'lucide-react';
import { AssetQuote } from '../types/market';
import {
  MAJOR_INDICES,
  MEGA_TECH_STOCKS,
  CRYPTO_ASSETS,
  FUTURES_COMMODITIES,
  FOREX_CURRENCIES,
  HIGHEST_VOLUME_STOCKS,
  MOST_VOLATILE_STOCKS,
} from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (symbol: string) => void;
  onOpenSuperchart: (symbol: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
  onOpenSuperchart,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Stocks' | 'Crypto' | 'Forex' | 'Indices' | 'Futures'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Aggregate pool of all symbols
  const allSymbols = useMemo(() => {
    const list: {
      symbol: string;
      name: string;
      category: 'Stocks' | 'Crypto' | 'Forex' | 'Indices' | 'Futures';
      price: number;
      changePercent: number;
      exchange: string;
    }[] = [];

    MAJOR_INDICES.forEach((i) =>
      list.push({
        symbol: i.symbol,
        name: i.name,
        category: 'Indices',
        price: i.price,
        changePercent: i.changePercent,
        exchange: i.exchange || 'INDEX',
      })
    );

    MEGA_TECH_STOCKS.forEach((s) =>
      list.push({
        symbol: s.symbol,
        name: s.name,
        category: 'Stocks',
        price: s.price,
        changePercent: s.changePercent,
        exchange: s.exchange || 'NASDAQ',
      })
    );

    HIGHEST_VOLUME_STOCKS.forEach((s) => {
      if (!list.find((item) => item.symbol === s.symbol)) {
        list.push({
          symbol: s.symbol,
          name: s.name,
          category: 'Stocks',
          price: s.price,
          changePercent: parseFloat(s.change.replace('%', '').replace('+', '').replace('−', '-')),
          exchange: 'NASDAQ',
        });
      }
    });

    MOST_VOLATILE_STOCKS.forEach((s) => {
      if (!list.find((item) => item.symbol === s.symbol)) {
        list.push({
          symbol: s.symbol,
          name: s.name,
          category: 'Stocks',
          price: s.price,
          changePercent: parseFloat(s.change.replace('%', '').replace('+', '').replace('−', '-')),
          exchange: 'NYSE',
        });
      }
    });

    CRYPTO_ASSETS.forEach((c) =>
      list.push({
        symbol: c.symbol,
        name: c.name,
        category: 'Crypto',
        price: c.price,
        changePercent: c.changePercent,
        exchange: 'BINANCE',
      })
    );

    FUTURES_COMMODITIES.forEach((f) =>
      list.push({
        symbol: f.symbol,
        name: f.name,
        category: 'Futures',
        price: f.price,
        changePercent: f.changePercent,
        exchange: 'COMEX/NYMEX',
      })
    );

    FOREX_CURRENCIES.forEach((fx) =>
      list.push({
        symbol: fx.symbol,
        name: fx.name,
        category: 'Forex',
        price: fx.price,
        changePercent: fx.changePercent,
        exchange: 'FX_IDC',
      })
    );

    return list;
  }, []);

  const filtered = useMemo(() => {
    return allSymbols.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;
      const matchesQuery =
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.exchange.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [allSymbols, query, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#131722]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E0E3EB] gap-3 bg-white">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, crypto, forex, futures..."
            className="flex-1 bg-transparent text-[15px] text-[#131722] placeholder-[#787B86] outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-[#F0F3FA] text-[#787B86] hover:text-[#131722]"
          >
            ESC
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F8F9FD] border-b border-[#E0E3EB] overflow-x-auto no-scrollbar">
          {(['All', 'Stocks', 'Crypto', 'Forex', 'Indices', 'Futures'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#131722] text-white shadow-2xs'
                  : 'bg-white text-[#787B86] hover:bg-[#F0F3FA] hover:text-[#131722] border border-[#E0E3EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#F0F3FA] flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#787B86]">
              <Search className="w-10 h-10 mx-auto text-[#E0E3EB] mb-2" />
              <p className="text-sm font-medium text-[#131722]">No symbols matched "{query}"</p>
              <p className="text-xs text-[#787B86] mt-1">Try searching for AAPL, BTC, S&P 500, Gold, or EUR/USD</p>
            </div>
          ) : (
            filtered.map((item) => {
              const isPositive = item.changePercent >= 0;
              return (
                <div
                  key={`${item.category}-${item.symbol}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0F3FA] transition-colors group cursor-pointer"
                  onClick={() => {
                    onSelectSymbol(item.symbol);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#F8F9FD] border border-[#E0E3EB] flex items-center justify-center font-bold text-xs text-[#131722] shrink-0 group-hover:border-[#2962ff] transition-colors">
                      {item.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722] tracking-tight">{item.symbol}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white border border-[#E0E3EB] text-[#787B86]">
                          {item.exchange}
                        </span>
                        <span className="text-[10px] text-[#787B86] hidden sm:inline">{item.category}</span>
                      </div>
                      <p className="text-xs text-[#787B86] truncate max-w-xs">{item.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-[#131722]">
                        {item.price > 1000
                          ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : item.price.toFixed(item.category === 'Forex' ? 4 : 2)}
                      </div>
                      <div
                        className={`text-[11px] font-semibold inline-flex items-center gap-0.5 ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSuperchart(item.symbol);
                        onClose();
                      }}
                      className="p-1.5 rounded-lg bg-white border border-[#E0E3EB] text-[#787B86] hover:text-[#2962ff] hover:border-[#2962ff] hover:bg-[#F8F9FD] transition-colors"
                      title="Open in Supercharts"
                    >
                      <CandlestickChart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Hotkeys */}
        <div className="px-4 py-2.5 bg-[#F8F9FD] border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#787B86]">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-semibold text-[#131722] bg-white px-1.5 py-0.5 rounded border border-[#E0E3EB]">↵</kbd> to view details</span>
            <span>Click <kbd className="font-semibold text-[#2962ff] bg-white px-1.5 py-0.5 rounded border border-[#E0E3EB]">Chart</kbd> for Supercharts</span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
};
