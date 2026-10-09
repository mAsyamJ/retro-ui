import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Users,
  Droplets,
  Zap,
  Globe,
  Send,
  Share2,
  Bell,
  Trash2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Token, WalletState, PriceAlert } from '../types/token';
import { BnbIcon, NvidiaIcon, AppleIcon, TeslaIcon, GoogleIcon } from './Icons';
import { TokenPriceChart, Timeframe } from './TokenPriceChart';

interface TokenDetailModalProps {
  token: Token | null;
  onClose: () => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onBuySuccess: (token: Token, amountBnb: number) => void;
  onSellSuccess?: (token: Token, tokenAmount: number, bnbReceived: number) => void;
  priceAlerts?: PriceAlert[];
  onAddPriceAlert?: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => void;
  onDeletePriceAlert?: (alertId: string) => void;
  onSimulateTriggerAlert?: (alertId: string) => void;
}

export function TokenDetailModal({
  token,
  onClose,
  wallet,
  onOpenWalletModal,
  onBuySuccess,
  onSellSuccess,
  priceAlerts = [],
  onAddPriceAlert,
  onDeletePriceAlert,
  onSimulateTriggerAlert,
}: TokenDetailModalProps) {
  const [rightPanelMode, setRightPanelMode] = useState<'trade' | 'alert'>('trade');
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('0.1');
  const [slippage, setSlippage] = useState('1.0');
  const [copied, setCopied] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccessMsg, setSwapSuccessMsg] = useState<string | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<Timeframe>('24h');

  // Price Alert Form State
  const [alertDirection, setAlertDirection] = useState<'above' | 'below'>('above');
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>(() => {
    return token ? (token.price * 1.1).toFixed(token.price < 0.001 ? 6 : 4) : '';
  });
  const [alertNote, setAlertNote] = useState('');
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string | null>(null);

  if (!token) return null;

  const currentTokenAlerts = priceAlerts.filter((a) => a.tokenId === token.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(token.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bnbPrice = 580; // approximate BNB USD
  const parsedAmount = parseFloat(tradeAmount) || 0;
  const tokensReceived = activeTab === 'buy'
    ? (parsedAmount * bnbPrice) / token.price
    : parsedAmount * (token.price / bnbPrice);

  const handleExecuteTrade = () => {
    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }
    if (parsedAmount <= 0) return;

    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      if (activeTab === 'buy') {
        onBuySuccess(token, parsedAmount);
        setSwapSuccessMsg(`Bought ${tokensReceived.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${token.symbol}!`);
      } else {
        if (onSellSuccess) {
          onSellSuccess(token, parsedAmount, tokensReceived);
        }
        setSwapSuccessMsg(`Sold ${parsedAmount.toLocaleString()} ${token.symbol} for ${(tokensReceived).toFixed(4)} BNB!`);
      }
      setTimeout(() => setSwapSuccessMsg(null), 3500);
    }, 900);
  };

  const handleSetAlertPercentage = (pct: number) => {
    const factor = 1 + (pct / 100);
    const newPrice = token.price * factor;
    setAlertTargetPrice(newPrice.toFixed(token.price < 0.001 ? 6 : 4));
    setAlertDirection(pct >= 0 ? 'above' : 'below');
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(alertTargetPrice);
    if (!target || target <= 0) {
      alert("Please enter a valid target price.");
      return;
    }

    if (onAddPriceAlert) {
      onAddPriceAlert({
        tokenId: token.id,
        tokenSymbol: token.symbol,
        tokenName: token.name,
        tokenIcon: token.icon,
        currentPriceAtCreation: token.price,
        targetPrice: target,
        direction: alertDirection,
        note: alertNote.trim() || undefined,
      });

      setAlertSuccessMsg(`Alert set for ${token.symbol} ${alertDirection === 'above' ? '≥' : '≤'} $${target}`);
      setAlertNote('');
      setTimeout(() => setAlertSuccessMsg(null), 3500);
    }
  };

  const targetNum = parseFloat(alertTargetPrice) || 0;
  const targetDistancePct = token.price > 0 ? ((targetNum - token.price) / token.price) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f1411] border border-[#233128] rounded-3xl font-sans text-slate-100 shadow-2xl shadow-emerald-950/40 my-6 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1c2620]">
          <div className="flex items-center gap-3">
            <img
              src={token.icon}
              alt={token.symbol}
              className="w-11 h-11 rounded-2xl border border-[#233128] object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg text-white font-extrabold">{token.symbol}</h2>
                <span className="text-xs text-slate-400 font-medium">{token.name}</span>
                {token.verified && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-[#34d399] text-[10px] flex items-center justify-center font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                <span>{token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-6)}</span>
                <button
                  onClick={handleCopy}
                  className="hover:text-white cursor-pointer"
                  title="Copy CA"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-[#1a231d] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Price, Chart & Metrics */}
          <div className="lg:col-span-7 space-y-4">
            {/* Price Banner */}
            <div className="flex items-baseline justify-between bg-[#0a0e0c] p-4 border border-[#1e2823]">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-0.5">CURRENT PRICE</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    ${token.price < 0.001 ? token.price.toFixed(6) : token.price.toFixed(4)}
                  </span>
                  <span className={`text-xs font-bold ${token.change24h >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                    {token.change24h >= 0 ? `+${token.change24h.toFixed(2)}%` : `${token.change24h.toFixed(2)}%`}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block mb-0.5">24H VOLUME</span>
                <span className="text-sm font-bold text-slate-200">
                  ${(token.vol24h / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>

            {/* Recharts Interactive Historical Price Performance Chart */}
            <TokenPriceChart
              token={token}
              selectedTimeframe={chartTimeframe}
              onTimeframeChange={setChartTimeframe}
            />

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0a0e0c] border border-[#1e2823] p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block">MARKET CAP</span>
                <span className="text-xs font-bold text-white">
                  ${(token.mcap / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="bg-[#0a0e0c] border border-[#1e2823] p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block">24H VOLUME</span>
                <span className="text-xs font-bold text-white">
                  ${(token.vol24h / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="bg-[#0a0e0c] border border-[#1e2823] p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block">LIQUIDITY</span>
                <span className="text-xs font-bold text-white">
                  ${(token.liquidity / 1000).toFixed(1)}K
                </span>
              </div>
              <div className="bg-[#0a0e0c] border border-[#1e2823] p-2.5">
                <span className="text-[10px] text-slate-500 uppercase block">HOLDERS</span>
                <span className="text-xs font-bold text-white">{token.holders.toLocaleString()}</span>
              </div>
            </div>

            {/* Bonding Curve Progress */}
            {token.bondingProgress && (
              <div className="bg-[#0a0e0c] border border-[#1e2823] p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#ccff00]" />
                    <span>Bonding Curve to DEX Graduation</span>
                  </span>
                  <span className="text-[#ccff00] font-bold">{token.bondingProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#16201b] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#ccff00] h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, token.bondingProgress)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  When 100% is reached, 12,000 BNB liquidity is deposited into PancakeSwap V3 and LP burned.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Instant Swap Terminal or Price Alert Panel */}
          <div className="lg:col-span-5 bg-[#0a0e0c] border border-[#1e2823] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              {/* Right Panel Main Mode Switcher: Trade vs Price Alert */}
              <div className="grid grid-cols-2 gap-2 mb-4 pb-3 border-b border-[#18221d]">
                <button
                  type="button"
                  onClick={() => setRightPanelMode('trade')}
                  className={`py-2 text-xs font-bold uppercase cursor-pointer rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                    rightPanelMode === 'trade'
                      ? 'border-[#8df0b5] bg-[#8df0b5]/15 text-[#8df0b5]'
                      : 'border-[#1e2823] text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>DEX SWAP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelMode('alert')}
                  className={`py-2 text-xs font-bold uppercase cursor-pointer rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                    rightPanelMode === 'alert'
                      ? 'border-[#8df0b5] bg-[#8df0b5]/15 text-[#8df0b5]'
                      : 'border-[#1e2823] text-slate-400 hover:text-white'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>PRICE ALERT {currentTokenAlerts.length > 0 && `(${currentTokenAlerts.length})`}</span>
                </button>
              </div>

              {/* MODE 1: TRADE / SWAP */}
              {rightPanelMode === 'trade' ? (
                <div>
                  {/* Swap Buy / Sell Tab Switcher */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => setActiveTab('buy')}
                      className={`py-2 text-xs font-bold uppercase cursor-pointer rounded-xl border ${
                        activeTab === 'buy'
                          ? 'border-[#8df0b5] bg-[#8df0b5]/15 text-[#8df0b5]'
                          : 'border-[#1e2823] text-slate-400 hover:text-white'
                      }`}
                    >
                      BUY {token.symbol}
                    </button>
                    <button
                      onClick={() => setActiveTab('sell')}
                      className={`py-2 text-xs font-bold uppercase cursor-pointer rounded-xl border ${
                        activeTab === 'sell'
                          ? 'border-[#f87171] bg-rose-500/15 text-[#f87171]'
                          : 'border-[#1e2823] text-slate-400 hover:text-white'
                      }`}
                    >
                      SELL {token.symbol}
                    </button>
                  </div>

                  {/* Pay Input */}
                  <div className="bg-[#121715] border border-[#1e2823] p-3 mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>YOU PAY</span>
                      <span>Balance: {wallet.isConnected ? `${wallet.balanceBNB.toFixed(2)} BNB` : '0 BNB'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0.001"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="w-full bg-transparent text-lg text-white font-bold outline-none"
                      />
                      <div className="flex items-center gap-1.5 bg-[#0a0e0c] border border-[#1e2823] px-2 py-1 shrink-0 text-xs font-bold">
                        <BnbIcon className="w-3.5 h-3.5" />
                        <span>BNB</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 mb-4 text-xs">
                    {['0.1', '0.5', '1.0', '2.0'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setTradeAmount(preset)}
                        className="py-1 bg-[#121715] hover:bg-[#1a231f] border border-[#1e2823] hover:border-[#ccff00] text-slate-300 text-[11px] cursor-pointer"
                      >
                        {preset} BNB
                      </button>
                    ))}
                  </div>

                  {/* Receive Output */}
                  <div className="bg-[#121715] border border-[#1e2823] p-3 mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>YOU RECEIVE (EST.)</span>
                      <span>Tax: {token.buyTax}%</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg text-[#ccff00] font-bold truncate">
                        {tokensReceived.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                      </span>
                      <div className="flex items-center gap-1.5 bg-[#0a0e0c] border border-[#1e2823] px-2 py-1 shrink-0 text-xs font-bold text-white">
                        <span>{token.symbol}</span>
                      </div>
                    </div>
                  </div>

                  {/* Slippage Settings */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
                    <span>Slippage Tolerance</span>
                    <div className="flex items-center gap-1">
                      {['0.5', '1.0', '2.5'].map((slip) => (
                        <button
                          key={slip}
                          onClick={() => setSlippage(slip)}
                          className={`px-1.5 py-0.5 text-[10px] border cursor-pointer ${
                            slippage === slip ? 'border-[#ccff00] text-[#ccff00]' : 'border-slate-800 text-slate-500'
                          }`}
                        >
                          {slip}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Alert */}
                  {swapSuccessMsg && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs mb-4 flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{swapSuccessMsg}</span>
                    </div>
                  )}

                  {/* Execute Button */}
                  <button
                    onClick={handleExecuteTrade}
                    disabled={isSwapping}
                    className="w-full py-3.5 bg-[#8df0b5] hover:bg-[#74ea9e] disabled:opacity-50 text-black font-extrabold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSwapping ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>SWAPPING ONCHAIN...</span>
                      </>
                    ) : (
                      <span>
                        {!wallet.isConnected
                          ? 'CONNECT WALLET TO TRADE'
                          : activeTab === 'buy'
                          ? `BUY ${token.symbol} WITH ${tradeAmount} BNB`
                          : `SELL ${token.symbol}`}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                /* MODE 2: SET PRICE ALERT */
                <div className="space-y-4">
                  <form onSubmit={handleCreateAlert} className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="uppercase">CURRENT PRICE:</span>
                      <span className="text-white font-bold">${token.price < 0.001 ? token.price.toFixed(6) : token.price.toFixed(4)}</span>
                    </div>

                    {/* Condition Selector: Above vs Below */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAlertDirection('above')}
                        className={`py-2 px-2 text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                          alertDirection === 'above'
                            ? 'border-[#4ade80] bg-emerald-500/15 text-[#4ade80]'
                            : 'border-[#1e2823] text-slate-400 hover:text-white'
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>RISES ABOVE (≥)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAlertDirection('below')}
                        className={`py-2 px-2 text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                          alertDirection === 'below'
                            ? 'border-[#f87171] bg-rose-500/15 text-[#f87171]'
                            : 'border-[#1e2823] text-slate-400 hover:text-white'
                        }`}
                      >
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>DROPS BELOW (≤)</span>
                      </button>
                    </div>

                    {/* Quick Percentage Presets */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase">QUICK TARGET PRESETS:</span>
                      <div className="grid grid-cols-5 gap-1 text-[10px]">
                        {alertDirection === 'above' ? (
                          <>
                            <button type="button" onClick={() => handleSetAlertPercentage(5)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-emerald-400 cursor-pointer">+5%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(10)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-emerald-400 cursor-pointer">+10%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(25)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-emerald-400 cursor-pointer">+25%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(50)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-emerald-400 cursor-pointer">+50%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(100)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-[#ccff00] cursor-pointer">2X</button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => handleSetAlertPercentage(-5)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-rose-400 cursor-pointer">-5%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(-10)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-rose-400 cursor-pointer">-10%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(-25)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-rose-400 cursor-pointer">-25%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(-50)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-rose-400 cursor-pointer">-50%</button>
                            <button type="button" onClick={() => handleSetAlertPercentage(-75)} className="py-1 bg-[#121715] hover:bg-[#19221d] border border-[#1e2823] text-rose-400 cursor-pointer">-75%</button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Target Price Input */}
                    <div className="bg-[#121715] border border-[#1e2823] p-2.5">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>TARGET PRICE (USD)</span>
                        <span className={`text-[10px] font-bold ${targetDistancePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {targetDistancePct >= 0 ? `+${targetDistancePct.toFixed(1)}%` : `${targetDistancePct.toFixed(1)}%`} from current
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 text-sm">$</span>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={alertTargetPrice}
                          onChange={(e) => setAlertTargetPrice(e.target.value)}
                          className="w-full bg-transparent text-base text-white font-bold outline-none"
                        />
                      </div>
                    </div>

                    {/* Optional Note */}
                    <div>
                      <input
                        type="text"
                        placeholder="Optional note (e.g. Take Profit / Accumulate Dip)"
                        value={alertNote}
                        onChange={(e) => setAlertNote(e.target.value)}
                        className="w-full bg-[#121715] border border-[#1e2823] focus:border-[#ccff00] text-xs text-white p-2 outline-none placeholder:text-slate-600"
                      />
                    </div>

                    {/* Feedback Alert */}
                    {alertSuccessMsg && (
                      <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{alertSuccessMsg}</span>
                      </div>
                    )}

                    {/* Submit Alert Button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#8df0b5] hover:bg-[#74ea9e] text-black font-extrabold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Bell className="w-4 h-4" />
                      <span>ACTIVATE PRICE ALERT</span>
                    </button>
                  </form>

                  {/* List of active alerts for this token */}
                  <div className="pt-3 border-t border-[#18221d]">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="uppercase text-[10px]">ACTIVE ALERTS FOR {token.symbol}:</span>
                      <span className="text-[#8df0b5] font-bold text-[11px]">{currentTokenAlerts.length}</span>
                    </div>

                    {currentTokenAlerts.length === 0 ? (
                      <div className="p-3 bg-[#121715] border border-[#1e2823] text-center text-xs text-slate-500">
                        No alerts set for {token.symbol} yet.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {currentTokenAlerts.map((alt) => (
                          <div
                            key={alt.id}
                            className="bg-[#121715] border border-[#1e2823] p-2 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold ${alt.direction === 'above' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {alt.direction === 'above' ? '≥' : '≤'} ${alt.targetPrice < 0.001 ? alt.targetPrice.toFixed(6) : alt.targetPrice.toFixed(4)}
                                </span>
                                <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                                  alt.status === 'triggered'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                    : 'bg-emerald-500/10 text-[#ccff00] border border-emerald-500/30'
                                }`}>
                                  {alt.status}
                                </span>
                              </div>
                              {alt.note && (
                                <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{alt.note}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {onSimulateTriggerAlert && alt.status === 'active' && (
                                <button
                                  type="button"
                                  onClick={() => onSimulateTriggerAlert(alt.id)}
                                  className="text-[10px] text-slate-400 hover:text-[#ccff00] px-1.5 py-0.5 border border-[#1e2823] hover:border-[#ccff00] transition-colors cursor-pointer"
                                  title="Test alert trigger notification"
                                >
                                  Test
                                </button>
                              )}
                              {onDeletePriceAlert && (
                                <button
                                  type="button"
                                  onClick={() => onDeletePriceAlert(alt.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                  title="Delete alert"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
