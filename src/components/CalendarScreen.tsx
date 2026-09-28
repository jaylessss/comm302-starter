import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, AlertCircle, Clock, Globe } from 'lucide-react';
import { EarningsEntry } from '../types/market';
import { EARNINGS_CALENDAR, MACRO_INDICATORS } from '../data/mockData';

interface CalendarScreenProps {
  onSelectSymbol: (symbol: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onSelectSymbol }) => {
  const [activeTab, setActiveTab] = useState<'earnings' | 'economic'>('earnings');
  const [dateFilter, setDateFilter] = useState<'Today' | 'Tomorrow' | 'This Week'>('Today');
  const [outcomeFilter, setOutcomeFilter] = useState<'All' | 'Beat' | 'Miss'>('All');

  const filteredEarnings = EARNINGS_CALENDAR.filter((item) => {
    if (outcomeFilter === 'Beat') {
      return item.reportedEps !== null && item.estimateEps !== null && item.reportedEps > item.estimateEps;
    }
    if (outcomeFilter === 'Miss') {
      return item.reportedEps !== null && item.estimateEps !== null && item.reportedEps < item.estimateEps;
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#131722] tracking-tight">
            Financial & Economic Calendar
          </h1>
          <p className="text-sm text-[#787B86] mt-0.5">
            Track corporate earnings releases, quarterly balance sheets, central bank rates, and macro data releases.
          </p>
        </div>

        {/* Calendar Category Switcher */}
        <div className="flex items-center bg-[#F0F3FA] p-1 rounded-full border border-[#E0E3EB] self-start md:self-auto">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'earnings'
                ? 'bg-white text-[#131722] shadow-2xs font-bold'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Earnings Schedule
          </button>
          <button
            onClick={() => setActiveTab('economic')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'economic'
                ? 'bg-white text-[#131722] shadow-2xs font-bold'
                : 'text-[#787B86] hover:text-[#131722]'
            }`}
          >
            Macro Indicators
          </button>
        </div>
      </div>

      {activeTab === 'earnings' ? (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8F9FD] p-3 rounded-2xl border border-[#E0E3EB]">
            <div className="flex items-center gap-1.5">
              {(['Today', 'Tomorrow', 'This Week'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setDateFilter(period)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    dateFilter === period
                      ? 'bg-[#131722] text-white shadow-2xs'
                      : 'bg-white text-[#787B86] hover:bg-[#F0F3FA] border border-[#E0E3EB]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#787B86] mr-1 font-medium">Outcome:</span>
              {(['All', 'Beat', 'Miss'] as const).map((out) => (
                <button
                  key={out}
                  onClick={() => setOutcomeFilter(out)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    outcomeFilter === out
                      ? 'bg-[#2962ff] text-white'
                      : 'bg-white text-[#787B86] hover:bg-[#F0F3FA] border border-[#E0E3EB]'
                  }`}
                >
                  {out}
                </button>
              ))}
            </div>
          </div>

          {/* Earnings Table */}
          <div className="bg-white rounded-2xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9FD] border-b border-[#E0E3EB] text-[#787B86] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Fiscal Period</th>
                    <th className="py-3 px-4">Release Timing</th>
                    <th className="py-3 px-4 text-right">EPS Est</th>
                    <th className="py-3 px-4 text-right">EPS Actual</th>
                    <th className="py-3 px-4 text-right">Surprise</th>
                    <th className="py-3 px-4 text-right">Revenue Est</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F3FA]">
                  {filteredEarnings.map((item) => {
                    const isBeat =
                      item.reportedEps !== null &&
                      item.estimateEps !== null &&
                      item.reportedEps >= item.estimateEps;
                    return (
                      <tr
                        key={item.symbol}
                        onClick={() => onSelectSymbol(item.symbol)}
                        className="hover:bg-[#F8F9FD] transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                              {item.symbol}
                            </span>
                            <span className="text-[#787B86]">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-[#131722]">{item.period}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0F3FA] text-[#787B86] font-medium text-[11px]">
                            <Clock className="w-3 h-3" />
                            {item.releaseTime}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-[#787B86]">
                          {item.estimateEps !== null ? `${item.estimateEps.toFixed(2)} USD` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          {item.reportedEps !== null ? (
                            <span className={isBeat ? 'text-[#089981]' : 'text-[#F23645]'}>
                              {item.reportedEps.toFixed(2)} USD
                            </span>
                          ) : (
                            <span className="text-[#787B86] font-normal">Pending</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {item.surprisePercent !== undefined ? (
                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold ${
                                item.surprisePercent >= 0
                                  ? 'bg-[#E8F5F2] text-[#089981]'
                                  : 'bg-[#FDECEE] text-[#F23645]'
                              }`}
                            >
                              {item.surprisePercent >= 0 ? '+' : ''}
                              {item.surprisePercent.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-[#787B86]">—</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-[#131722]">
                          {item.revenueEst || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Economic Macro Indicators View */
        <div className="bg-white rounded-2xl border border-[#E0E3EB] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FD] border-b border-[#E0E3EB] text-[#787B86] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Country / Region</th>
                  <th className="py-3.5 px-4 text-right">GDP (USD)</th>
                  <th className="py-3.5 px-4 text-right">Growth YoY</th>
                  <th className="py-3.5 px-4 text-right">Central Bank Rate</th>
                  <th className="py-3.5 px-4 text-right">Inflation Rate</th>
                  <th className="py-3.5 px-4 text-right">Unemployment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3FA]">
                {MACRO_INDICATORS.map((macro) => {
                  const isGrowthPositive = macro.growthYoY >= 0;
                  return (
                    <tr key={macro.code} className="hover:bg-[#F8F9FD] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-sm text-[#131722]">
                        <span className="mr-2 text-base">{macro.flag}</span>
                        {macro.country}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#131722]">{macro.gdp}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold">
                        <span className={isGrowthPositive ? 'text-[#089981]' : 'text-[#F23645]'}>
                          {isGrowthPositive ? '+' : ''}
                          {macro.growthYoY.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#131722]">
                        {macro.interestRate.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#F23645]">
                        {macro.inflationRate.toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[#787B86]">
                        {macro.unemployment.toFixed(1)}%
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
