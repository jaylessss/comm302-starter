import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, TrendingUp, Sparkles, UserCheck } from 'lucide-react';

interface CommunityScreenProps {
  onSelectSymbol: (symbol: string) => void;
  onOpenSuperchart: (symbol: string) => void;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  onSelectSymbol,
  onOpenSuperchart,
}) => {
  const [filter, setFilter] = useState<'Trending' | 'Editors Pick' | 'Educational'>('Trending');

  const ideas = [
    {
      id: '1',
      title: 'NVDA: Wave 5 Extension Heading Towards $150 Resistance',
      author: 'QuantCapital_Pro',
      authorBadge: 'Top Author',
      symbol: 'NVDA',
      bias: 'Long',
      likes: 1240,
      comments: 184,
      time: '3 hours ago',
      content:
        'NVIDIA continues to show immense relative strength post-earnings. Daily RSI remains above 60 with consolidating volume. Target $148 - $152 zone with stop below 20-day EMA.',
    },
    {
      id: '2',
      title: 'Bitcoin: Clean Breakout Retest of $90,000 Support',
      author: 'CryptoMacroEdge',
      authorBadge: 'Pine Wizard',
      symbol: 'BTC',
      bias: 'Long',
      likes: 2890,
      comments: 412,
      time: '5 hours ago',
      content:
        'BTC has confirmed support at the prior ATH level. Funding rates remain moderate while open interest expands. Next psychological resistance sits at $100,000.',
    },
    {
      id: '3',
      title: 'S&P 500: Weekly Divergence Signaling Caution Near 5,900',
      author: 'MacroVision_Analyst',
      authorBadge: 'Market Veteran',
      symbol: 'S&P 500',
      bias: 'Neutral',
      likes: 830,
      comments: 92,
      time: '8 hours ago',
      content:
        'Breadth metrics have narrowed over the past two sessions while 10Y sovereign yields tick higher. Watch 5,820 as key pivot point for swing risk.',
    },
    {
      id: '4',
      title: 'Gold Futures: Geopolitical Hedge In Clear Bullish Channel',
      author: 'CommoditiesTrader_EU',
      authorBadge: 'Pro',
      symbol: 'Gold Futures',
      bias: 'Long',
      likes: 950,
      comments: 110,
      time: '12 hours ago',
      content:
        'Gold has maintained structural higher lows on COMEX. Central bank accumulation remains persistent into quarter-end.',
    },
  ];

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#131722] tracking-tight">
            Trading Community & Ideas
          </h1>
          <p className="text-sm text-[#787B86] mt-0.5">
            Discover trading setups, chart analyses, open-source Pine Scripts, and market commentary from verified analysts.
          </p>
        </div>

        <div className="flex items-center bg-[#F0F3FA] p-1 rounded-full border border-[#E0E3EB]">
          {(['Trending', 'Editors Pick', 'Educational'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-white text-[#131722] shadow-2xs font-bold'
                  : 'text-[#787B86] hover:text-[#131722]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-2xl p-5 border border-[#E0E3EB] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Author & Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#131722] text-white flex items-center justify-center font-bold text-xs">
                    {idea.author.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#131722]">{idea.author}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#E8F5F2] text-[#089981]">
                        {idea.authorBadge}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#787B86]">{idea.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    onClick={() => onSelectSymbol(idea.symbol)}
                    className="text-xs font-bold text-[#2962ff] bg-[#2962ff]/10 px-2 py-0.5 rounded cursor-pointer hover:bg-[#2962ff]/20"
                  >
                    {idea.symbol}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      idea.bias === 'Long'
                        ? 'bg-[#E8F5F2] text-[#089981]'
                        : 'bg-[#F0F3FA] text-[#787B86]'
                    }`}
                  >
                    {idea.bias}
                  </span>
                </div>
              </div>

              {/* Title & Content */}
              <h3 className="text-base font-bold text-[#131722] hover:text-[#2962ff] cursor-pointer transition-colors mb-2">
                {idea.title}
              </h3>
              <p className="text-xs text-[#787B86] leading-relaxed line-clamp-3 mb-4">
                {idea.content}
              </p>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F3FA] text-xs text-[#787B86]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 hover:text-[#F23645] cursor-pointer">
                  <Heart className="w-3.5 h-3.5" />
                  {idea.likes}
                </span>
                <span className="flex items-center gap-1 hover:text-[#2962ff] cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {idea.comments}
                </span>
              </div>

              <button
                onClick={() => onOpenSuperchart(idea.symbol)}
                className="text-xs font-bold text-[#2962ff] hover:underline"
              >
                Analyze on Chart →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
