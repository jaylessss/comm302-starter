import React from 'react';
import { X, Trash2, CandlestickChart, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { AssetQuote } from '../types/market';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  quotes: AssetQuote[];
  onSelectSymbol: (symbol: string) => void;
  onOpenSuperchart: (symbol: string) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  quotes,
  onSelectSymbol,
  onOpenSuperchart,
  onRemoveFromWatchlist,
}) => {
  if (!isOpen) return null;

  const watchlistItems = watchlistSymbols
    .map((sym) => quotes.find((q) => q.symbol === sym))
    .filter(Boolean) as AssetQuote[];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#131722]/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#E0E3EB] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff] text-[22px]">bookmark</span>
            <div>
              <h2 className="text-base font-bold text-[#131722]">My Watchlist</h2>
              <span className="text-xs text-[#787B86]">{watchlistItems.length} Saved Assets</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watchlist Items */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#F0F3FA]">
          {watchlistItems.length === 0 ? (
            <div className="py-20 text-center text-[#787B86] px-4">
              <span className="material-symbols-outlined text-4xl text-[#E0E3EB] mb-2 block">bookmark_border</span>
              <p className="font-semibold text-sm text-[#131722]">Your watchlist is empty</p>
              <p className="text-xs text-[#787B86] mt-1">
                Click the bookmark icon on any ticker card or search result to track it here.
              </p>
            </div>
          ) : (
            watchlistItems.map((item) => {
              const isPositive = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectSymbol(item.symbol);
                    onClose();
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-[#F8F9FD] rounded-xl cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F0F3FA] flex items-center justify-center font-bold text-xs text-[#131722]">
                      {item.badge || item.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff]">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] text-[#787B86] font-medium">{item.category}</span>
                      </div>
                      <span className="text-xs text-[#787B86] block truncate max-w-[150px]">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-[#131722]">
                        ${item.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-[11px] font-mono font-bold ${
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
                      className="p-1.5 rounded-lg hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#2962ff]"
                      title="Supercharts"
                    >
                      <CandlestickChart className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(item.symbol);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#FDECEE] text-[#787B86] hover:text-[#F23645]"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F8F9FD] border-t border-[#E0E3EB] text-xs text-[#787B86] text-center">
          Real-time synchronized across all your devices
        </div>
      </div>
    </div>
  );
};
