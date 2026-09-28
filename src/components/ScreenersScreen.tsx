import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { HeatmapItem } from '../types/market';
import { HEATMAP_DATA } from '../data/mockData';

interface ScreenersScreenProps {
  onSelectSymbol: (symbol: string) => void;
  onOpenSuperchart: (symbol: string) => void;
}

export const ScreenersScreen: React.FC<ScreenersScreenProps> = ({
  onSelectSymbol,
  onOpenSuperchart,
}) => {
  const [viewMode, setViewMode] = useState<'heatmap' | 'table'>('heatmap');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'marketCapVal' | 'changePercent' | 'price'>('marketCapVal');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sectors = ['All', 'Technology', 'Financials', 'Healthcare', 'Communication', 'Consumer Cyclical', 'Energy'];

  const filteredData = useMemo(() => {
    return HEATMAP_DATA.filter((item) => {
      const matchSector = selectedSector === 'All' || item.sector === selectedSector;
      const matchSearch =
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSector && matchSearch;
    }).sort((a, b) => {
      const mult = sortDirection === 'asc' ? 1 : -1;
      return (a[sortField] - b[sortField]) * mult;
    });
  }, [selectedSector, searchQuery, sortField, sortDirection]);

  // Sector groups for heatmap view
  const sectorGroups = useMemo(() => {
    const map = new Map<string, HeatmapItem[]>();
    filteredData.forEach((item) => {
      if (!map.has(item.sector)) {
        map.set(item.sector, []);
      }
      map.get(item.sector)!.push(item);
    });
    return Array.from(map.entries());
  }, [filteredData]);

  // Color generator based on return
  const getBoxColor = (chg: number) => {
    if (chg >= 4.0) return 'bg-[#089981] text-white';
    if (chg >= 2.0) return 'bg-[#0aa88f] text-white';
    if (chg > 0) return 'bg-[#26a69a] text-white';
    if (chg === 0) return 'bg-[#787B86] text-white';
    if (chg > -2.0) return 'bg-[#ef5350] text-white';
    return 'bg-[#F23645] text-white';
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#131722] tracking-tight">
            Screeners & Market Heatmaps
          </h1>
          <p className="text-sm text-[#787B86] mt-0.5">
            Visualize capital flows, momentum shifts, and sector performance across major global equities.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F0F3FA] p-1 rounded-full border border-[#E0E3EB]">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-white text-[#131722] shadow-2xs font-bold'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              Heatmap View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#131722] shadow-2xs font-bold'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              Screener Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F8F9FD] p-3 rounded-2xl border border-[#E0E3EB]">
        {/* Sector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSector(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                selectedSector === s
                  ? 'bg-[#131722] text-white shadow-2xs'
                  : 'bg-white text-[#787B86] hover:bg-[#F0F3FA] hover:text-[#131722] border border-[#E0E3EB]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search & Sort Input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-[#787B86] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticker or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white border border-[#E0E3EB] text-xs text-[#131722] outline-none focus:border-[#2962ff]"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'heatmap' ? (
        <div className="space-y-6">
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-[#787B86]">
            <span>Box size corresponds to market capitalization</span>
            <div className="flex items-center gap-1 font-mono">
              <span>-3.0%</span>
              <div className="flex h-3 w-32 rounded overflow-hidden">
                <span className="flex-1 bg-[#F23645]" />
                <span className="flex-1 bg-[#ef5350]" />
                <span className="flex-1 bg-[#787B86]" />
                <span className="flex-1 bg-[#26a69a]" />
                <span className="flex-1 bg-[#089981]" />
              </div>
              <span>+3.0%</span>
            </div>
          </div>

          {/* Sector Groups Treemap Container */}
          <div className="space-y-4">
            {sectorGroups.map(([sectorName, items]) => (
              <div key={sectorName} className="bg-white rounded-2xl p-4 border border-[#E0E3EB] shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#131722] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2962ff]" />
                    {sectorName}
                  </h3>
                  <span className="text-xs text-[#787B86]">{items.length} Leaders</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {items.map((item) => {
                    const colorCls = getBoxColor(item.changePercent);
                    const isPositive = item.changePercent >= 0;
                    return (
                      <div
                        key={item.symbol}
                        onClick={() => onSelectSymbol(item.symbol)}
                        className={`${colorCls} p-3 rounded-xl cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all flex flex-col justify-between min-h-[90px]`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm tracking-tight">{item.symbol}</span>
                          <span className="text-[10px] font-mono opacity-90">{item.marketCapText}</span>
                        </div>

                        <div>
                          <div className="text-xs opacity-90 truncate">{item.name}</div>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="text-xs font-mono font-bold">${item.price.toFixed(2)}</span>
                            <span className="text-xs font-bold font-mono">
                              {isPositive ? '+' : ''}
                              {item.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Screener Table View */
        <div className="bg-white rounded-2xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FD] border-b border-[#E0E3EB] text-[#787B86] font-semibold">
                <tr>
                  <th className="py-3 px-4">Symbol & Name</th>
                  <th className="py-3 px-4">Sector</th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                    onClick={() => {
                      setSortField('price');
                      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                    }}
                  >
                    Price
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                    onClick={() => {
                      setSortField('changePercent');
                      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                    }}
                  >
                    24h Change
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                    onClick={() => {
                      setSortField('marketCapVal');
                      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                    }}
                  >
                    Market Cap
                  </th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3FA]">
                {filteredData.map((item) => {
                  const isPositive = item.changePercent >= 0;
                  return (
                    <tr
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      className="hover:bg-[#F8F9FD] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[#787B86] truncate max-w-[140px] sm:max-w-xs">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#787B86]">{item.sector}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#131722]">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            isPositive
                              ? 'bg-[#E8F5F2] text-[#089981]'
                              : 'bg-[#FDECEE] text-[#F23645]'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#131722]">
                        {item.marketCapText}
                      </td>
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenSuperchart(item.symbol)}
                          className="px-2.5 py-1 rounded-lg bg-[#F0F3FA] text-[#2962ff] font-bold text-xs hover:bg-[#2962ff] hover:text-white transition-colors"
                        >
                          Chart
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
