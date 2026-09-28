import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131722]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E0E3EB] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2962ff] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">query_stats</span>
            </div>
            <span className="font-bold text-lg text-[#131722]">TradingView Pro</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F0F3FA] text-[#787B86] hover:text-[#131722]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F5F2] text-[#089981] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#131722]">Welcome to TradingView!</h3>
              <p className="text-xs text-[#787B86]">
                Your free paper trading terminal and real-time streaming feed are now activated.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-extrabold text-[#131722] tracking-tight">
                  Supercharge your trading setup
                </h3>
                <p className="text-xs text-[#787B86] mt-1">
                  Institutional data feeds, custom pine script indicators, unlimited layouts, and multi-asset paper trading.
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#131722]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#089981] shrink-0" />
                  <span>Real-time direct order book quotes (NYSE, NASDAQ, CME, CBOE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#089981] shrink-0" />
                  <span>$100,000 simulated paper trading account with zero risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#089981] shrink-0" />
                  <span>Customizable multi-screen Supercharts with Pine Script v5</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#131722] mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@hedgefund.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E0E3EB] bg-[#F8F9FD] text-sm text-[#131722] outline-none focus:border-[#2962ff] focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#2962FF] to-[#5A32FA] hover:opacity-95 shadow-md shadow-[#2962FF]/20 transition-all cursor-pointer"
                >
                  Start Free 30-Day Pro Trial
                </button>
              </form>

              <div className="text-[11px] text-[#787B86] text-center">
                By continuing, you agree to TradingView's Terms of Use and Privacy Policy.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
