export interface AssetQuote {
  symbol: string;
  name: string;
  category: 'index' | 'stock' | 'crypto' | 'future' | 'forex' | 'bond';
  exchange?: string;
  price: number;
  change: number; // point change
  changePercent: number; // percentage
  volume?: string;
  marketCap?: string;
  badge?: string;
  badgeBg?: string;
  sparkline: number[];
  high52w?: number;
  low52w?: number;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  pe?: number;
  dividendYield?: string;
  sector?: string;
}

export interface MacroIndicator {
  country: string;
  code: string;
  flag: string;
  gdp: string;
  growthYoY: number;
  interestRate: number;
  inflationRate: number;
  unemployment: number;
}

export interface EarningsEntry {
  symbol: string;
  name: string;
  period: string;
  estimateEps: number | null;
  reportedEps: number | null;
  surprisePercent?: number;
  releaseTime: 'Before Open' | 'After Close' | 'During Market';
  currency: string;
  revenueEst?: string;
  revenueActual?: string;
}

export interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  marketCapVal: number; // in billions for scaling
  marketCapText: string;
  price: number;
  changePercent: number;
}
