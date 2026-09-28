import React, { useState, useEffect } from 'react';
import { Search, Globe, Bookmark, TrendingUp, Sparkles, X, User } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  onOpenAuth: () => void;
  watchlistCount: number;
  liveStreaming: boolean;
  onToggleStreaming: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenWatchlist,
  onOpenAuth,
  watchlistCount,
  liveStreaming,
  onToggleStreaming,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const languages = ['EN', 'ES', 'DE', 'FR', 'JA', 'ZH'];

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E0E3EB] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 w-full px-4 md:px-6 max-w-[1320px] mx-auto flex items-center justify-between gap-3">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0">
          {/* TradingView Logo */}
          <button
            onClick={() => onSelectTab('markets')}
            className="flex items-center gap-2 shrink-0 select-none group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#2962ff] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm shadow-[#2962ff]/30">
              <span className="material-symbols-outlined text-white text-[20px]">query_stats</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[18px] tracking-tight text-[#131722] leading-none group-hover:text-[#2962ff] transition-colors">
                TradingView
              </span>
              <span className="text-[10px] text-[#787B86] font-medium tracking-wider uppercase mt-0.5">Markets</span>
            </div>
          </button>

          {/* Quick Search Trigger */}
          <div
            onClick={onOpenSearch}
            className="hidden md:flex items-center bg-[#F0F3FA] rounded-full px-3.5 py-1.5 text-[#787B86] w-52 lg:w-72 cursor-pointer hover:bg-[#e5e8f4] hover:text-[#131722] transition-colors border border-transparent hover:border-[#E0E3EB]"
          >
            <span className="material-symbols-outlined text-[18px] mr-2 text-[#787B86]">search</span>
            <span className="text-[13px] flex-1 truncate font-normal">Search symbols (Ctrl+K)</span>
            <kbd className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded shadow-2xs text-[#787B86] border border-[#E0E3EB]">
              ⌘K
            </kbd>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('supercharts')}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-full transition-colors flex items-center gap-1.5 ${
                currentTab === 'supercharts'
                  ? 'text-[#131722] bg-[#F0F3FA] font-bold shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-[#2962ff]">candlestick_chart</span>
              Supercharts
            </button>

            <button
              onClick={() => onSelectTab('markets')}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-full transition-colors ${
                currentTab === 'markets'
                  ? 'text-[#131722] bg-[#F0F3FA] font-bold shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              Markets
            </button>

            <button
              onClick={() => onSelectTab('screeners')}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-full transition-colors ${
                currentTab === 'screeners'
                  ? 'text-[#131722] bg-[#F0F3FA] font-bold shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              Screeners & Heatmaps
            </button>

            <button
              onClick={() => onSelectTab('calendar')}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-full transition-colors ${
                currentTab === 'calendar'
                  ? 'text-[#131722] bg-[#F0F3FA] font-bold shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              Calendar
            </button>

            <button
              onClick={() => onSelectTab('community')}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded-full transition-colors ${
                currentTab === 'community'
                  ? 'text-[#131722] bg-[#F0F3FA] font-bold shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              Community
            </button>
          </nav>
        </div>

        {/* Right Section: Streaming Toggle, Watchlist, Lang & Account */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Live Streaming indicator toggle */}
          <button
            onClick={onToggleStreaming}
            title={liveStreaming ? 'Live ticks active (Click to pause)' : 'Paused (Click to enable live ticks)'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              liveStreaming
                ? 'bg-[#E8F5F2] border-[#089981]/30 text-[#089981]'
                : 'bg-[#F0F3FA] border-[#E0E3EB] text-[#787B86]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                liveStreaming ? 'bg-[#089981] animate-pulse' : 'bg-[#787B86]'
              }`}
            />
            <span>{liveStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[12px] font-semibold text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors relative"
            title="Open Watchlist"
          >
            <Bookmark className="w-4 h-4 text-[#2962ff]" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#2962ff] text-white text-[10px] flex items-center justify-center font-bold">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-semibold text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] transition-colors"
              type="button"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-lg border border-[#E0E3EB] py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setCurrentLang(l);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#F0F3FA] flex items-center justify-between ${
                      currentLang === l ? 'text-[#2962ff] font-bold bg-[#F8F9FD]' : 'text-[#131722]'
                    }`}
                  >
                    <span>{l}</span>
                    {currentLang === l && <span className="w-1.5 h-1.5 rounded-full bg-[#2962ff]"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-1.5 rounded-full text-[#787B86] hover:bg-[#F0F3FA] hover:text-[#131722]"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Get Started CTA */}
          <button
            onClick={onOpenAuth}
            className="px-3.5 sm:px-4 py-1.5 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-[#2962FF] to-[#5A32FA] hover:opacity-95 shadow-[0_1px_8px_rgba(41,98,255,0.25)] transition-all cursor-pointer whitespace-nowrap"
            type="button"
          >
            Get started
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-[#131722] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            title="Account & Settings"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
