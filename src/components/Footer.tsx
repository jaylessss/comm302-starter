import React from 'react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full bg-[#F8F9FD] border-t border-[#E0E3EB] mt-12">
      <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 py-12">
        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div>
            <h4 className="text-sm font-bold text-[#131722] mb-3">Products</h4>
            <ul className="space-y-2 text-xs text-[#787B86]">
              <li>
                <button
                  onClick={() => onSelectTab('supercharts')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Supercharts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('supercharts')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Pine Script™
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('screeners')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Stock Screener
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('screeners')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Crypto Screener
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('screeners')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Forex Screener
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#131722] mb-3">Screeners & Heatmaps</h4>
            <ul className="space-y-2 text-xs text-[#787B86]">
              <li>
                <button
                  onClick={() => onSelectTab('screeners')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Stock Heatmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('screeners')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Crypto Heatmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('screeners')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  ETF Heatmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('calendar')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Earnings Calendar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('calendar')}
                  className="hover:text-[#131722] transition-colors cursor-pointer text-left"
                >
                  Economic Calendar
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#131722] mb-3">Community</h4>
            <ul className="space-y-2 text-xs text-[#787B86]">
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Ideas</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Scripts</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Streams</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">House Rules</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Moderators</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#131722] mb-3">Brokers</h4>
            <ul className="space-y-2 text-xs text-[#787B86]">
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Broker Awards</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Integrated Partners</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Partner Program</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Trading Integration</span>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-sm font-bold text-[#131722] mb-3">More</h4>
            <ul className="space-y-2 text-xs text-[#787B86]">
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">About Us</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Features</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Pricing</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Blog & News</span>
              </li>
              <li>
                <span className="hover:text-[#131722] transition-colors cursor-pointer">Desktop App</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="bg-[#F0F3FA] rounded-2xl p-4 mb-8 text-[#787B86] text-xs leading-relaxed border border-[#E0E3EB]/50">
          <span className="text-[11px] font-bold text-[#131722] uppercase tracking-wider block mb-1">
            Market Data Disclaimer
          </span>
          Select market data provided by ICE Data Services, BATS, and national exchanges. Quotes and charts are delayed unless specified. Real-time data packages require verified exchange subscriptions. Information is provided for educational and analytical purposes and does not constitute investment advice.
        </div>

        {/* Bottom Legal Band */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E0E3EB] text-xs text-[#787B86]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#131722]">TradingView, Inc.</span>
            <span>© 2024. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="hover:text-[#131722] transition-colors cursor-pointer">Terms of Use</span>
            <span className="hover:text-[#131722] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#131722] transition-colors cursor-pointer">Cookies Policy</span>
            <span className="hover:text-[#131722] transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
