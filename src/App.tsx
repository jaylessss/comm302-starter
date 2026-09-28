/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { MarketsScreen } from './components/MarketsScreen';
import { SuperchartsScreen } from './components/SuperchartsScreen';
import { ScreenersScreen } from './components/ScreenersScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { SearchModal } from './components/SearchModal';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { AssetQuote } from './types/market';
import {
  MAJOR_INDICES,
  MEGA_TECH_STOCKS,
  CRYPTO_ASSETS,
  FUTURES_COMMODITIES,
  FOREX_CURRENCIES,
  HIGHEST_VOLUME_STOCKS,
  MOST_VOLATILE_STOCKS,
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('markets');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [activeDetailSymbol, setActiveDetailSymbol] = useState<string | null>(null);
  const [superchartSymbol, setSuperchartSymbol] = useState<string>('NVDA');
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>([
    'NVDA',
    'BTC',
    'AAPL',
    'S&P 500',
    'Gold Futures',
  ]);
  const [liveStreaming, setLiveStreaming] = useState<boolean>(true);

  // Live quotes dynamic state
  const [quotes, setQuotes] = useState<AssetQuote[]>([
    ...MAJOR_INDICES,
    ...MEGA_TECH_STOCKS,
    ...CRYPTO_ASSETS,
    ...FUTURES_COMMODITIES,
    ...FOREX_CURRENCIES,
  ]);

  // Subtle real-time tick updates when liveStreaming is active
  useEffect(() => {
    if (!liveStreaming) return;

    const interval = setInterval(() => {
      setQuotes((prevQuotes) =>
        prevQuotes.map((q) => {
          // Update ~2 random symbols each tick
          if (Math.random() > 0.45) return q;
          const fluctuation = (Math.random() - 0.49) * 0.003;
          const newPrice = Math.max(0.01, q.price * (1 + fluctuation));
          const delta = newPrice - (q.open || q.price);
          const newPct = (delta / (q.open || q.price)) * 100;

          return {
            ...q,
            price: Number(newPrice.toFixed(q.category === 'forex' ? 4 : 2)),
            change: Number(delta.toFixed(2)),
            changePercent: Number(newPct.toFixed(2)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [liveStreaming]);

  // Handle open symbol detail
  const handleSelectSymbol = (symbol: string) => {
    setActiveDetailSymbol(symbol);
  };

  // Handle launch Supercharts
  const handleOpenSuperchart = (symbol: string) => {
    setSuperchartSymbol(symbol);
    setCurrentTab('supercharts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Watchlist toggle
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Find active quote
  const activeQuote = useMemo(() => {
    if (!activeDetailSymbol) return null;
    const found = quotes.find((q) => q.symbol === activeDetailSymbol);
    if (found) return found;

    // Check secondary lists
    const volMatch = HIGHEST_VOLUME_STOCKS.find((s) => s.symbol === activeDetailSymbol);
    if (volMatch) {
      return {
        symbol: volMatch.symbol,
        name: volMatch.name,
        category: 'stock' as const,
        price: volMatch.price,
        change: 3.4,
        changePercent: parseFloat(volMatch.change.replace('%', '').replace('+', '')),
        volume: volMatch.vol,
        sparkline: [volMatch.price * 0.98, volMatch.price],
      };
    }

    const volatileMatch = MOST_VOLATILE_STOCKS.find((s) => s.symbol === activeDetailSymbol);
    if (volatileMatch) {
      return {
        symbol: volatileMatch.symbol,
        name: volatileMatch.name,
        category: 'stock' as const,
        price: volatileMatch.price,
        change: 1.2,
        changePercent: parseFloat(volatileMatch.change.replace('%', '').replace('+', '')),
        volume: volatileMatch.vol,
        sparkline: [volatileMatch.price * 0.9, volatileMatch.price],
      };
    }

    // Fallback stub
    return {
      symbol: activeDetailSymbol,
      name: `${activeDetailSymbol} Global Asset`,
      category: 'stock' as const,
      price: 150.0,
      change: 1.5,
      changePercent: 1.0,
      sparkline: [148, 150],
    };
  }, [activeDetailSymbol, quotes]);

  return (
    <div className="min-h-screen bg-white text-[#131722] flex flex-col font-sans antialiased">
      {/* Top Main Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        watchlistCount={watchlistSymbols.length}
        liveStreaming={liveStreaming}
        onToggleStreaming={() => setLiveStreaming(!liveStreaming)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full pt-16">
        {currentTab === 'markets' && (
          <MarketsScreen
            onSelectSymbol={handleSelectSymbol}
            onOpenSuperchart={handleOpenSuperchart}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'supercharts' && (
          <SuperchartsScreen
            initialSymbol={superchartSymbol}
            onBackToMarkets={() => {
              setCurrentTab('markets');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'screeners' && (
          <ScreenersScreen
            onSelectSymbol={handleSelectSymbol}
            onOpenSuperchart={handleOpenSuperchart}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarScreen onSelectSymbol={handleSelectSymbol} />
        )}

        {currentTab === 'community' && (
          <CommunityScreen
            onSelectSymbol={handleSelectSymbol}
            onOpenSuperchart={handleOpenSuperchart}
          />
        )}
      </main>

      {/* Global Footer (Visible on non-Supercharts screens to give full canvas space) */}
      {currentTab !== 'supercharts' && (
        <Footer
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Quick Search Palette Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSymbol={handleSelectSymbol}
        onOpenSuperchart={handleOpenSuperchart}
      />

      {/* Asset / Symbol Detail Drawer / Modal */}
      <SymbolDetailModal
        quote={activeQuote}
        isOpen={!!activeDetailSymbol}
        onClose={() => setActiveDetailSymbol(null)}
        onOpenSuperchart={(sym) => {
          setActiveDetailSymbol(null);
          handleOpenSuperchart(sym);
        }}
        isWatchlisted={watchlistSymbols.includes(activeDetailSymbol || '')}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Personal Watchlist Slideout */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        quotes={quotes}
        onSelectSymbol={handleSelectSymbol}
        onOpenSuperchart={(sym) => {
          setIsWatchlistOpen(false);
          handleOpenSuperchart(sym);
        }}
        onRemoveFromWatchlist={(sym) => {
          setWatchlistSymbols((prev) => prev.filter((s) => s !== sym));
        }}
      />

      {/* Pro Trial / Account Registration Dialog */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
