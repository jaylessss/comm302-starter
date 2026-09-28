import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Maximize2,
  Share2,
  Sliders,
  TrendingUp,
  TrendingDown,
  Camera,
  Layers,
  ChevronDown,
  Plus,
  Crosshair,
  Minus,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { AssetQuote, CandleData } from '../types/market';
import { generateCandleSeries, MEGA_TECH_STOCKS, MAJOR_INDICES, CRYPTO_ASSETS } from '../data/mockData';

interface SuperchartsScreenProps {
  initialSymbol?: string;
  onBackToMarkets: () => void;
}

export const SuperchartsScreen: React.FC<SuperchartsScreenProps> = ({
  initialSymbol = 'NVDA',
  onBackToMarkets,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W'>('1D');
  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');
  const [activeDrawingTool, setActiveDrawingTool] = useState<string>('crosshair');
  const [showRsi, setShowRsi] = useState<boolean>(true);
  const [showEma, setShowEma] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  // Paper trading state
  const [paperBalance, setPaperBalance] = useState<number>(100000);
  const [orderQuantity, setOrderQuantity] = useState<number>(10);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Available instruments list
  const symbolsList = useMemo(() => {
    return [
      ...MEGA_TECH_STOCKS,
      ...MAJOR_INDICES,
      ...CRYPTO_ASSETS,
    ];
  }, []);

  const currentQuote = useMemo(() => {
    return symbolsList.find((s) => s.symbol === selectedSymbol) || symbolsList[0];
  }, [symbolsList, selectedSymbol]);

  // Generate candle series
  const candles = useMemo(() => {
    return generateCandleSeries(currentQuote.price, 48, 0.018);
  }, [currentQuote, timeframe]);

  // Update hovered candle to latest by default
  useEffect(() => {
    if (candles.length > 0) {
      setHoveredCandle(candles[candles.length - 1]);
    }
  }, [candles]);

  // Chart min and max calculation
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  // Execute paper trade
  const handleTrade = (type: 'BUY' | 'SELL') => {
    const totalCost = currentQuote.price * orderQuantity;
    if (type === 'BUY') {
      if (paperBalance < totalCost) {
        setOrderSuccessMsg('Insufficient paper trading balance!');
        setTimeout(() => setOrderSuccessMsg(null), 3000);
        return;
      }
      setPaperBalance((prev) => prev - totalCost);
      setOrderSuccessMsg(`Bought ${orderQuantity} ${currentQuote.symbol} @ $${currentQuote.price.toFixed(2)}`);
    } else {
      setPaperBalance((prev) => prev + totalCost);
      setOrderSuccessMsg(`Sold ${orderQuantity} ${currentQuote.symbol} @ $${currentQuote.price.toFixed(2)}`);
    }
    setTimeout(() => setOrderSuccessMsg(null), 3000);
  };

  const isPositive = currentQuote.changePercent >= 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#FFFFFF] text-[#131722] overflow-hidden select-none">
      {/* Top Supercharts Command Bar */}
      <div className="h-12 border-b border-[#E0E3EB] bg-[#FFFFFF] px-3 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
          {/* Back button */}
          <button
            onClick={onBackToMarkets}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#F0F3FA] text-[#787B86] hover:text-[#131722] hover:bg-[#E0E3EB] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span className="hidden md:inline">Markets</span>
          </button>

          {/* Symbol Selector Dropdown */}
          <div className="relative group">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-[#F0F3FA] hover:bg-[#E0E3EB] text-[#131722] font-bold text-sm px-3 py-1.5 rounded-lg appearance-none pr-8 cursor-pointer outline-none transition-colors border border-transparent hover:border-[#E0E3EB]"
            >
              {symbolsList.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} • {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#787B86] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Current Live Ticker Readout */}
          <div className="flex items-baseline gap-2 font-mono text-xs pl-1">
            <span className="text-sm font-bold text-[#131722]">${currentQuote.price.toFixed(2)}</span>
            <span
              className={`font-semibold ${
                isPositive ? 'text-[#089981]' : 'text-[#F23645]'
              }`}
            >
              {isPositive ? '+' : ''}
              {currentQuote.changePercent.toFixed(2)}%
            </span>
          </div>

          <div className="h-4 w-px bg-[#E0E3EB] mx-1 hidden sm:block" />

          {/* Timeframe selector */}
          <div className="flex items-center gap-0.5 bg-[#F0F3FA] p-0.5 rounded-lg">
            {(['1m', '5m', '15m', '1h', '4h', '1D', '1W'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                  timeframe === tf
                    ? 'bg-white text-[#2962ff] shadow-2xs font-bold'
                    : 'text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-[#E0E3EB] mx-1 hidden md:block" />

          {/* Chart Type Selector */}
          <div className="hidden md:flex items-center gap-0.5 bg-[#F0F3FA] p-0.5 rounded-lg text-xs font-medium text-[#787B86]">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2 py-1 rounded transition-all ${
                chartType === 'candles' ? 'bg-white text-[#131722] font-bold shadow-2xs' : 'hover:text-[#131722]'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 rounded transition-all ${
                chartType === 'line' ? 'bg-white text-[#131722] font-bold shadow-2xs' : 'hover:text-[#131722]'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 rounded transition-all ${
                chartType === 'area' ? 'bg-white text-[#131722] font-bold shadow-2xs' : 'hover:text-[#131722]'
              }`}
            >
              Area
            </button>
          </div>

          <div className="h-4 w-px bg-[#E0E3EB] mx-1 hidden lg:block" />

          {/* Indicators Toggle */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setShowEma(!showEma)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                showEma
                  ? 'bg-[#2962ff]/10 text-[#2962ff] border-[#2962ff]/40'
                  : 'bg-[#F0F3FA] text-[#787B86] border-transparent hover:text-[#131722]'
              }`}
            >
              EMA 20/50
            </button>
            <button
              onClick={() => setShowRsi(!showRsi)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                showRsi
                  ? 'bg-[#2962ff]/10 text-[#2962ff] border-[#2962ff]/40'
                  : 'bg-[#F0F3FA] text-[#787B86] border-transparent hover:text-[#131722]'
              }`}
            >
              RSI (14)
            </button>
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center text-xs font-mono text-[#787B86] bg-[#F0F3FA] px-2.5 py-1 rounded-lg">
            <span>Paper Balance: </span>
            <span className="font-bold text-[#131722] ml-1">${paperBalance.toLocaleString()}</span>
          </div>

          <button
            onClick={() => alert('Snapshot captured to clipboard!')}
            className="p-1.5 text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] rounded-lg transition-colors"
            title="Take chart screenshot"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Vertical Drawing Toolbar */}
        <div className="w-12 border-r border-[#E0E3EB] bg-[#FFFFFF] flex flex-col items-center py-2 gap-1 shrink-0">
          {[
            { id: 'crosshair', icon: 'filter_center_focus', label: 'Crosshair' },
            { id: 'trendline', icon: 'diagonal_line', label: 'Trend Line' },
            { id: 'horizontal', icon: 'horizontal_rule', label: 'Horizontal Ray' },
            { id: 'fibonacci', icon: 'grid_goldenratio', label: 'Fib Retracement' },
            { id: 'text', icon: 'title', label: 'Text Note' },
            { id: 'ruler', icon: 'straighten', label: 'Measure Tool' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveDrawingTool(tool.id)}
              title={tool.label}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                activeDrawingTool === tool.id
                  ? 'bg-[#2962ff] text-white shadow-2xs'
                  : 'text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tool.icon}</span>
            </button>
          ))}

          <div className="w-6 h-px bg-[#E0E3EB] my-1" />

          <button
            onClick={() => setActiveDrawingTool('crosshair')}
            title="Clear Drawings"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#787B86] hover:text-[#F23645] hover:bg-[#FDECEE] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>

        {/* Central Charting Area */}
        <div className="flex-1 flex flex-col bg-[#FFFFFF] relative overflow-hidden">
          {/* Dynamic OHLC Bar Ribbon */}
          <div className="h-8 border-b border-[#F0F3FA] px-4 flex items-center gap-4 text-xs font-mono text-[#787B86] bg-[#FFFFFF]">
            <span className="font-bold text-[#131722]">{currentQuote.symbol}</span>
            <span className="text-[#787B86]">{timeframe}</span>
            {hoveredCandle && (
              <div className="flex items-center gap-3">
                <span>
                  O <strong className="text-[#131722]">{hoveredCandle.open.toFixed(2)}</strong>
                </span>
                <span>
                  H <strong className="text-[#131722]">{hoveredCandle.high.toFixed(2)}</strong>
                </span>
                <span>
                  L <strong className="text-[#131722]">{hoveredCandle.low.toFixed(2)}</strong>
                </span>
                <span>
                  C{' '}
                  <strong
                    className={
                      hoveredCandle.close >= hoveredCandle.open ? 'text-[#089981]' : 'text-[#F23645]'
                    }
                  >
                    {hoveredCandle.close.toFixed(2)}
                  </strong>
                </span>
                <span className="hidden sm:inline">
                  Vol <strong className="text-[#131722]">{(hoveredCandle.volume / 1000).toFixed(1)}K</strong>
                </span>
                <span className="hidden md:inline text-[11px] text-[#787B86]">({hoveredCandle.time})</span>
              </div>
            )}
          </div>

          {/* Interactive Chart Canvas View */}
          <div className="flex-1 relative w-full h-full flex flex-col bg-white">
            {/* Main Price Canvas */}
            <div className="flex-1 relative w-full">
              <svg
                className="w-full h-full cursor-crosshair overflow-hidden"
                viewBox="0 0 1000 500"
                preserveAspectRatio="none"
              >
                {/* Horizontal Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
                  <line
                    key={ratio}
                    x1="0"
                    y1={ratio * 400}
                    x2="920"
                    y2={ratio * 400}
                    stroke="#F0F3FA"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* EMA Line Simulation */}
                {showEma && (
                  <path
                    d={candles
                      .map((c, i) => {
                        const x = (i / (candles.length - 1)) * 900 + 10;
                        const avg = (c.open + c.close) / 2;
                        const y = 380 - ((avg - minPrice) / priceRange) * 350;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="1.8"
                    opacity="0.8"
                  />
                )}

                {/* Candles / Line / Area Render */}
                {chartType === 'candles' ? (
                  candles.map((candle, idx) => {
                    const candleWidth = 900 / candles.length;
                    const x = idx * candleWidth + candleWidth * 0.15 + 10;
                    const isGreen = candle.close >= candle.open;
                    const color = isGreen ? '#089981' : '#F23645';

                    const highY = 380 - ((candle.high - minPrice) / priceRange) * 350;
                    const lowY = 380 - ((candle.low - minPrice) / priceRange) * 350;
                    const openY = 380 - ((candle.open - minPrice) / priceRange) * 350;
                    const closeY = 380 - ((candle.close - minPrice) / priceRange) * 350;

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
                    const wickX = x + candleWidth * 0.35;

                    return (
                      <g
                        key={idx}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        onMouseEnter={() => setHoveredCandle(candle)}
                      >
                        {/* Upper & Lower Wick */}
                        <line
                          x1={wickX}
                          y1={highY}
                          x2={wickX}
                          y2={lowY}
                          stroke={color}
                          strokeWidth="1.5"
                        />
                        {/* Candle Body */}
                        <rect
                          x={x}
                          y={bodyTop}
                          width={candleWidth * 0.7}
                          height={bodyHeight}
                          fill={color}
                          rx="1"
                        />
                      </g>
                    );
                  })
                ) : chartType === 'line' ? (
                  <path
                    d={candles
                      .map((c, i) => {
                        const x = (i / (candles.length - 1)) * 900 + 10;
                        const y = 380 - ((c.close - minPrice) / priceRange) * 350;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                  />
                ) : (
                  <>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 10 380 ${candles
                        .map((c, i) => {
                          const x = (i / (candles.length - 1)) * 900 + 10;
                          const y = 380 - ((c.close - minPrice) / priceRange) * 350;
                          return `L ${x} ${y}`;
                        })
                        .join(' ')} L 910 380 Z`}
                      fill="url(#areaGrad)"
                    />
                    <path
                      d={candles
                        .map((c, i) => {
                          const x = (i / (candles.length - 1)) * 900 + 10;
                          const y = 380 - ((c.close - minPrice) / priceRange) * 350;
                          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth="2.2"
                    />
                  </>
                )}

                {/* Sub-Panel: Volume Bars */}
                {candles.map((candle, idx) => {
                  const candleWidth = 900 / candles.length;
                  const x = idx * candleWidth + candleWidth * 0.15 + 10;
                  const volHeight = (candle.volume / maxVolume) * 70;
                  const isGreen = candle.close >= candle.open;
                  return (
                    <rect
                      key={`vol-${idx}`}
                      x={x}
                      y={480 - volHeight}
                      width={candleWidth * 0.7}
                      height={volHeight}
                      fill={isGreen ? '#089981' : '#F23645'}
                      opacity="0.35"
                    />
                  );
                })}

                {/* Right Axis Price Ladder */}
                <line x1="920" y1="0" x2="920" y2="500" stroke="#E0E3EB" strokeWidth="1" />
                {[0, 0.25, 0.5, 0.75, 1].map((step) => {
                  const val = minPrice + (1 - step) * priceRange;
                  const y = step * 360 + 20;
                  return (
                    <text
                      key={step}
                      x="930"
                      y={y}
                      fill="#787B86"
                      fontSize="11"
                      fontFamily="monospace"
                      dominantBaseline="middle"
                    >
                      ${val.toFixed(2)}
                    </text>
                  );
                })}

                {/* Current Active Price Marker */}
                <g transform={`translate(920, ${380 - ((currentQuote.price - minPrice) / priceRange) * 350})`}>
                  <rect
                    x="0"
                    y="-10"
                    width="78"
                    height="20"
                    fill={isPositive ? '#089981' : '#F23645'}
                    rx="3"
                  />
                  <text
                    x="5"
                    y="4"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ${currentQuote.price.toFixed(2)}
                  </text>
                </g>
              </svg>
            </div>

            {/* Sub Indicator: RSI Oscillator Panel */}
            {showRsi && (
              <div className="h-28 border-t border-[#E0E3EB] bg-[#F8F9FD] px-3 py-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#787B86]">
                  <span className="font-bold text-[#131722]">RSI (14, Close)</span>
                  <span className="font-bold text-[#2962ff]">58.42</span>
                </div>
                <div className="h-16 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 900 60" preserveAspectRatio="none">
                    <line x1="0" y1="18" x2="900" y2="18" stroke="#F23645" strokeDasharray="3 3" opacity="0.5" />
                    <line x1="0" y1="42" x2="900" y2="42" stroke="#089981" strokeDasharray="3 3" opacity="0.5" />
                    <path
                      d="M 0 35 Q 150 15, 300 28 T 600 45 T 900 25"
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Sidebar: Depth of Market & Quick Trade Execution */}
        <div className="w-72 sm:w-80 border-l border-[#E0E3EB] bg-[#FFFFFF] flex flex-col overflow-y-auto shrink-0">
          {/* Quick Buy & Sell Execution Panel */}
          <div className="p-4 border-b border-[#E0E3EB] bg-[#F8F9FD]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#131722] uppercase tracking-wider">
                Instant Order Ticket
              </span>
              <span className="text-[10px] bg-[#E8F5F2] text-[#089981] px-2 py-0.5 rounded-full font-bold">
                Paper Trading
              </span>
            </div>

            {orderSuccessMsg && (
              <div className="mb-3 p-2 bg-[#131722] text-white text-xs font-semibold rounded-lg text-center animate-in fade-in">
                {orderSuccessMsg}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#787B86] block mb-1">Shares / Units</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-[#E0E3EB] rounded-lg px-3 py-1.5 text-sm font-mono font-bold outline-none focus:border-[#2962ff]"
                  />
                  <button
                    onClick={() => setOrderQuantity((q) => q + 10)}
                    className="px-2.5 py-1.5 bg-white border border-[#E0E3EB] rounded-lg text-xs font-semibold hover:bg-[#F0F3FA]"
                  >
                    +10
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleTrade('BUY')}
                  className="py-2.5 bg-[#089981] hover:bg-[#078873] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase opacity-90">Market Buy</span>
                  <span className="font-mono text-sm">${(currentQuote.price * 1.0005).toFixed(2)}</span>
                </button>
                <button
                  onClick={() => handleTrade('SELL')}
                  className="py-2.5 bg-[#F23645] hover:bg-[#dc2837] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex flex-col items-center"
                >
                  <span className="text-[10px] uppercase opacity-90">Market Sell</span>
                  <span className="font-mono text-sm">${(currentQuote.price * 0.9995).toFixed(2)}</span>
                </button>
              </div>

              <div className="text-[11px] text-[#787B86] flex justify-between pt-1">
                <span>Estimated Value:</span>
                <span className="font-mono font-bold text-[#131722]">
                  ${(currentQuote.price * orderQuantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Level 2 Depth of Market / Order Book */}
          <div className="p-4 border-b border-[#E0E3EB]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#131722] uppercase tracking-wider">
                Order Book (L2 Depth)
              </span>
              <span className="text-[10px] text-[#787B86]">Spread: 0.02</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              {/* Asks (Sells) */}
              {[3, 2, 1].map((level) => {
                const p = currentQuote.price + level * 0.05;
                const size = Math.floor(150 + level * 80);
                return (
                  <div key={`ask-${level}`} className="flex justify-between items-center text-[#F23645]">
                    <span>${p.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#787B86]">{size}</span>
                      <div className="w-12 bg-[#FDECEE] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#F23645] h-full"
                          style={{ width: `${(size / 400) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Current Spread Bar */}
              <div className="py-1 text-center font-bold text-[#131722] bg-[#F0F3FA] rounded my-1">
                ${currentQuote.price.toFixed(2)}
              </div>

              {/* Bids (Buys) */}
              {[1, 2, 3].map((level) => {
                const p = currentQuote.price - level * 0.05;
                const size = Math.floor(180 + level * 90);
                return (
                  <div key={`bid-${level}`} className="flex justify-between items-center text-[#089981]">
                    <span>${p.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#787B86]">{size}</span>
                      <div className="w-12 bg-[#E8F5F2] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#089981] h-full"
                          style={{ width: `${(size / 400) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fast Switch Watchlist */}
          <div className="p-4 flex-1">
            <span className="text-xs font-bold text-[#131722] uppercase tracking-wider block mb-2">
              Quick Instrument Switch
            </span>
            <div className="space-y-1.5">
              {symbolsList.slice(0, 8).map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => setSelectedSymbol(item.symbol)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    item.symbol === selectedSymbol
                      ? 'bg-[#2962ff]/10 text-[#2962ff] font-bold'
                      : 'hover:bg-[#F0F3FA] text-[#131722]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{item.symbol}</span>
                    <span className="text-[10px] text-[#787B86] truncate max-w-[80px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div>${item.price.toFixed(2)}</div>
                    <div
                      className={`text-[10px] ${
                        item.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {item.changePercent >= 0 ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
