import React, { useState, useEffect } from 'react';
import {
  ArrowRightLeft,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Zap,
  Check,
  ShieldCheck,
  Search,
  Activity,
  Flame,
  Clock,
  Sparkles,
  Settings,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Info,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Share2,
  Lock,
  Percent
} from 'lucide-react';
import { Token, WalletState } from '../types/token';
import { TokenPriceChart, Timeframe } from './TokenPriceChart';
import { SolanaIcon, BaseIcon, EthereumIcon, BnbIcon } from './Icons';

interface TradeViewProps {
  tokens: Token[];
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onBuySuccess: (token: Token, amount: number) => void;
  onSellSuccess?: (token: Token, amount: number, bnbReceived: number) => void;
  selectedToken?: Token;
  onSelectToken?: (token: Token) => void;
}

export function TradeView({
  tokens,
  wallet,
  onOpenWalletModal,
  onBuySuccess,
  onSellSuccess,
  selectedToken: externalSelectedToken,
  onSelectToken,
}: TradeViewProps) {
  const [selectedToken, setSelectedToken] = useState<Token>(() => {
    return externalSelectedToken || tokens[0] || ({} as Token);
  });

  // Sync when externalSelectedToken changes
  useEffect(() => {
    if (externalSelectedToken) {
      setSelectedToken(externalSelectedToken);
    }
  }, [externalSelectedToken]);

  // Terminal state
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'Market' | 'Limit' | 'DCA'>('Market');
  const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('0.5');
  const [chartTimeframe, setChartTimeframe] = useState<Timeframe>('24h');
  const [isSwapping, setIsSwapping] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
  const [tokenSearch, setTokenSearch] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [priorityFee, setPriorityFee] = useState<'Normal' | 'Turbo' | 'Ultra'>('Turbo');
  const [antiMev, setAntiMev] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showDegenGuide, setShowDegenGuide] = useState(false);

  // Position & P&L State for this token
  const [myHoldings, setMyHoldings] = useState<{ [tokenId: string]: { tokens: number; avgBuyPrice: number } }>({
    'retro-protocol': { tokens: 42000, avgBuyPrice: 0.0910 },
    'ppw-token': { tokens: 150000, avgBuyPrice: 0.00032 },
    'vault-token': { tokens: 28000, avgBuyPrice: 0.0019 },
    'retropay-token': { tokens: 1000000, avgBuyPrice: 0.00045 },
  });

  // Live DEX Trades Stream
  const [recentTrades, setRecentTrades] = useState([
    { id: 'tx-1', type: 'buy', amountTokens: 52400, valueUsd: 748.20, price: 0.0142, maker: '7kM9...3bA1', time: '4s ago' },
    { id: 'tx-2', type: 'buy', amountTokens: 18500, valueUsd: 264.18, price: 0.0142, maker: '3xF2...c980', time: '18s ago' },
    { id: 'tx-3', type: 'sell', amountTokens: 12000, valueUsd: 171.36, price: 0.0141, maker: '9pQ1...44a7', time: '45s ago' },
    { id: 'tx-4', type: 'buy', amountTokens: 110000, valueUsd: 1568.60, price: 0.0143, maker: '4yZ8...ef02', time: '1m ago' },
    { id: 'tx-5', type: 'sell', amountTokens: 25000, valueUsd: 357.00, price: 0.0142, maker: '2wX5...110e', time: '2m ago' },
  ]);

  // Pricing calculations
  // Default base currency is SOL (or BNB if bsc)
  const isBsc = selectedToken.chain === 'bsc';
  const nativeCurrency = isBsc ? 'BNB' : 'SOL';
  const nativeUsdPrice = isBsc ? 580 : 172; // Approximate USD price

  const parsedAmount = parseFloat(payAmount) || 0;
  const currentTokenPrice = selectedToken.price || 0.001;

  // In BUY mode: payAmount is native currency (SOL/BNB), estimated tokens out
  // In SELL mode: payAmount is token amount or percentage of holding
  const tokensEstimated = tradeMode === 'buy'
    ? (parsedAmount * nativeUsdPrice) / currentTokenPrice
    : parsedAmount * (currentTokenPrice / nativeUsdPrice);

  const estimatedUsdValue = tradeMode === 'buy'
    ? parsedAmount * nativeUsdPrice
    : parsedAmount * currentTokenPrice;

  const userPosition = myHoldings[selectedToken.id] || { tokens: 0, avgBuyPrice: 0 };
  const positionValueUsd = userPosition.tokens * currentTokenPrice;
  const positionCostUsd = userPosition.tokens * (userPosition.avgBuyPrice || currentTokenPrice);
  const positionPnlUsd = positionValueUsd - positionCostUsd;
  const positionPnlPct = positionCostUsd > 0 ? (positionPnlUsd / positionCostUsd) * 100 : 0;

  const filteredTokens = tokens.filter(
    (t) =>
      t.name.toLowerCase().includes(tokenSearch.toLowerCase()) ||
      t.symbol.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  const handleCopyCA = () => {
    navigator.clipboard.writeText(selectedToken.contractAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleSwap = () => {
    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }
    if (parsedAmount <= 0) return;

    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      const isBuy = tradeMode === 'buy';

      if (isBuy) {
        onBuySuccess(selectedToken, parsedAmount);
        // update local holdings
        setMyHoldings((prev) => {
          const cur = prev[selectedToken.id] || { tokens: 0, avgBuyPrice: currentTokenPrice };
          const newTokens = cur.tokens + tokensEstimated;
          const newAvg = cur.tokens > 0 ? (cur.tokens * cur.avgBuyPrice + parsedAmount * nativeUsdPrice) / newTokens : currentTokenPrice;
          return {
            ...prev,
            [selectedToken.id]: { tokens: Math.round(newTokens), avgBuyPrice: newAvg },
          };
        });
        setSuccessMsg(`🚀 Swapped ${parsedAmount} ${nativeCurrency} for ${Math.round(tokensEstimated).toLocaleString()} ${selectedToken.symbol}!`);
      } else {
        if (onSellSuccess) {
          onSellSuccess(selectedToken, parsedAmount, tokensEstimated);
        }
        setMyHoldings((prev) => {
          const cur = prev[selectedToken.id] || { tokens: 0, avgBuyPrice: currentTokenPrice };
          return {
            ...prev,
            [selectedToken.id]: { tokens: Math.max(0, cur.tokens - parsedAmount), avgBuyPrice: cur.avgBuyPrice },
          };
        });
        setSuccessMsg(`💰 Sold ${parsedAmount.toLocaleString()} ${selectedToken.symbol} for ${tokensEstimated.toFixed(4)} ${nativeCurrency}!`);
      }

      // Add to live trades tape
      setRecentTrades((prev) => [
        {
          id: `tx-${Date.now()}`,
          type: isBuy ? 'buy' : 'sell',
          amountTokens: isBuy ? Math.round(tokensEstimated) : Math.round(parsedAmount),
          valueUsd: estimatedUsdValue,
          price: currentTokenPrice,
          maker: wallet.address ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}` : 'You',
          time: 'Just now',
        },
        ...prev.slice(0, 5),
      ]);

      setTimeout(() => setSuccessMsg(null), 4000);
    }, 750);
  };

  const setPresetAmount = (val: number | string) => {
    if (val === 'MAX') {
      if (tradeMode === 'buy') {
        setPayAmount(wallet.balanceBNB ? Math.max(0, wallet.balanceBNB - 0.01).toFixed(3) : '2.5');
      } else {
        setPayAmount(userPosition.tokens.toString());
      }
    } else if (val === 'HALF') {
      if (tradeMode === 'buy') {
        setPayAmount(wallet.balanceBNB ? (wallet.balanceBNB / 2).toFixed(3) : '1.0');
      } else {
        setPayAmount(Math.round(userPosition.tokens / 2).toString());
      }
    } else {
      setPayAmount(val.toString());
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-5 pb-16">
      {/* 1. Header Bar: Selected Token Details, Switcher & Quick Stats */}
      <div className="bg-[#0b0f0d] border border-[#17201a] rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Token Identity & Token Selector Button */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="relative">
              <button
                onClick={() => setIsTokenSelectorOpen(!isTokenSelectorOpen)}
                className="flex items-center gap-3 bg-[#111713] hover:bg-[#18221c] border border-[#1f2b23] rounded-xl px-3.5 py-2 cursor-pointer transition-colors group"
              >
                <div className="relative">
                  <img
                    src={selectedToken.icon}
                    alt={selectedToken.symbol}
                    className="w-9 h-9 rounded-full object-cover border border-[#2b3d32]"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-[#233529]">
                    {selectedToken.chain === 'bsc' ? <BnbIcon className="w-3 h-3" /> : <SolanaIcon className="w-3 h-3" />}
                  </span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-base group-hover:text-[#8df0b5] transition-colors">
                      {selectedToken.symbol}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono block truncate max-w-[120px]">
                    {selectedToken.name}
                  </span>
                </div>
              </button>

              {/* Token Selector Dropdown */}
              {isTokenSelectorOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-[#101612] border border-[#223227] rounded-2xl shadow-2xl p-3 z-50">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search coins by name or symbol..."
                      value={tokenSearch}
                      onChange={(e) => setTokenSearch(e.target.value)}
                      className="w-full bg-[#0a0d0b] border border-[#1b271f] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#8df0b5]"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1 font-mono">
                    {filteredTokens.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedToken(t);
                          if (onSelectToken) onSelectToken(t);
                          setIsTokenSelectorOpen(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors ${
                          t.id === selectedToken.id ? 'bg-[#1b261f] text-white' : 'hover:bg-[#141b16] text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={t.icon} alt={t.symbol} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <span className="text-xs font-bold text-white block">{t.symbol}</span>
                            <span className="text-[10px] text-slate-500">{t.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold block">${t.price < 0.001 ? t.price.toFixed(6) : t.price.toFixed(4)}</span>
                          <span className={`text-[10px] ${t.change24h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                            {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contract Address Pill with 1-Click Copy */}
            <button
              onClick={handleCopyCA}
              className="flex items-center gap-1.5 bg-[#101512] hover:bg-[#18201b] border border-[#1d2720] text-slate-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
              title="Copy Contract Address"
            >
              <span>{selectedToken.contractAddress.slice(0, 4)}...{selectedToken.contractAddress.slice(-4)}</span>
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Degen Guide Toggle Button */}
            <button
              onClick={() => setShowDegenGuide(!showDegenGuide)}
              className="flex items-center gap-1 bg-[#14231b] text-[#8df0b5] border border-[#234230] px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-[#1a2f24] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Degen Tips</span>
            </button>
          </div>

          {/* Right: Key Live Stats Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Price</span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white">
                  ${selectedToken.price < 0.0001
                    ? selectedToken.price.toFixed(6)
                    : selectedToken.price < 0.1
                    ? selectedToken.price.toFixed(4)
                    : selectedToken.price.toFixed(2)}
                </span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    selectedToken.change24h >= 0
                      ? 'bg-[#22c55e]/15 text-[#22c55e]'
                      : 'bg-[#ef4444]/15 text-[#ef4444]'
                  }`}
                >
                  {selectedToken.change24h >= 0 ? '+' : ''}{selectedToken.change24h.toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Market Cap</span>
              <span className="text-sm font-bold text-slate-200">
                ${selectedToken.mcap >= 1000000
                  ? `${(selectedToken.mcap / 1000000).toFixed(2)}M`
                  : `${(selectedToken.mcap / 1000).toFixed(1)}K`}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">24h Vol</span>
              <span className="text-sm font-bold text-slate-200">
                ${selectedToken.vol24h >= 1000000
                  ? `${(selectedToken.vol24h / 1000000).toFixed(2)}M`
                  : `${(selectedToken.vol24h / 1000).toFixed(1)}K`}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Liquidity</span>
              <span className="text-sm font-bold text-slate-200">
                ${(selectedToken.liquidity / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>

        {/* Degen Safety & Audit Badges */}
        <div className="mt-3.5 pt-3 border-t border-[#141b16] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-[#22c55e]">
              <Check className="w-3.5 h-3.5" /> Mint Revoked
            </span>
            <span className="flex items-center gap-1 text-[#22c55e]">
              <Check className="w-3.5 h-3.5" /> Freeze Disabled
            </span>
            <span className="flex items-center gap-1 text-[#f59e0b]">
              <Flame className="w-3.5 h-3.5" /> LP 100% Burnt
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" /> Top 10: 14.2%
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Percent className="w-3.5 h-3.5 text-[#8df0b5]" /> Tax: {selectedToken.buyTax}%/{selectedToken.sellTax}%
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <a
              href={`https://solscan.io/token/${selectedToken.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 text-[11px] transition-colors"
            >
              Explorer <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Beginner Degen Explanatory Callout */}
        {showDegenGuide && (
          <div className="mt-3 bg-[#111914] border border-[#233528] rounded-xl p-3 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-[#8df0b5] font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Degen Quick Tips for Beginners
              </span>
              <button onClick={() => setShowDegenGuide(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              • <strong>Instant Presets:</strong> Tap 0.1, 0.5, or 1 {nativeCurrency} to buy high-momentum pumps within milliseconds.<br />
              • <strong>Slippage Tolerance:</strong> 0.5% - 1% is standard. For volatile launches, use 2% or Turbo Priority to avoid failed txs.<br />
              • <strong>Anti-MEV Shield:</strong> Routes your order privately to protect against sandwich bots and frontrunners.
            </p>
          </div>
        )}
      </div>

      {/* 2. Main Grid: Chart & Orderflow (Left 7 cols) + Order Terminal Card (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Price Chart & Recent Trades Stream */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Chart Container */}
          <div className="bg-[#0b0f0d] border border-[#17201a] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8df0b5]" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Interactive DEX Price Chart
                </h4>
              </div>
              <span className="text-xs text-slate-500 font-mono">Real-time Recharts stream</span>
            </div>

            <TokenPriceChart
              token={selectedToken}
              selectedTimeframe={chartTimeframe}
              onTimeframeChange={setChartTimeframe}
            />
          </div>

          {/* User Position & P&L Card */}
          <div className="bg-[#0b0f0d] border border-[#17201a] rounded-2xl p-4 sm:p-5 font-mono">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#22c55e]" /> My Position & P&L
              </h4>
              <span className="text-xs text-slate-500">Live Bag Tracker</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#101512] border border-[#1c2620] rounded-xl p-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Holding</span>
                <span className="text-sm font-bold text-white">
                  {userPosition.tokens.toLocaleString()} {selectedToken.symbol}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Position Value</span>
                <span className="text-sm font-bold text-white">
                  ${positionValueUsd.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Avg Buy</span>
                <span className="text-sm font-bold text-slate-300">
                  ${userPosition.avgBuyPrice < 0.001 ? userPosition.avgBuyPrice.toFixed(6) : userPosition.avgBuyPrice.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Unrealized P&L</span>
                <span className={`text-sm font-extrabold ${positionPnlUsd >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {positionPnlUsd >= 0 ? '+' : ''}${positionPnlUsd.toFixed(2)} ({positionPnlPct >= 0 ? '+' : ''}{positionPnlPct.toFixed(1)}%)
                </span>
              </div>
            </div>

            {userPosition.tokens > 0 && (
              <div className="mt-3 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => {
                    setTradeMode('sell');
                    setPayAmount(Math.round(userPosition.tokens / 2).toString());
                  }}
                  className="px-3 py-1 bg-[#1a231d] hover:bg-[#25322a] text-[#f59e0b] border border-[#2d3e33] rounded-lg cursor-pointer transition-colors font-bold"
                >
                  ⚡ Sell 50%
                </button>
                <button
                  onClick={() => {
                    setTradeMode('sell');
                    setPayAmount(userPosition.tokens.toString());
                  }}
                  className="px-3 py-1 bg-[#2a1717] hover:bg-[#3d1e1e] text-[#ef4444] border border-[#4d2525] rounded-lg cursor-pointer transition-colors font-bold"
                >
                  ⚡ Exit 100%
                </button>
              </div>
            )}
          </div>

          {/* Hot Callouts & Live DEX Trades Stream */}
          <div className="bg-[#0b0f0d] border border-[#17201a] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Live DEX Trade Tape
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Latest swaps</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {recentTrades.map((trade) => {
                const isBuy = trade.type === 'buy';
                return (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#101512] hover:bg-[#151c17] border border-[#18211b] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          isBuy ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}
                      >
                        {isBuy ? 'BUY' : 'SELL'}
                      </span>
                      <span className="text-slate-300 font-medium">
                        {trade.amountTokens.toLocaleString()} {selectedToken.symbol}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        (${trade.valueUsd.toFixed(2)})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span>{trade.maker}</span>
                      <span className="text-slate-500">{trade.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Degen Trading Terminal Card (Exact match to requested UI) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-[#0d120f] border border-[#1f2b23] rounded-2xl p-4 sm:p-5 shadow-2xl sticky top-20">
            {/* Top Row: BUY (Bright Green) / SELL (Dark Gray) Tab & Settings Gear */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex-1 grid grid-cols-2 gap-1.5 bg-[#090d0b] p-1 rounded-xl border border-[#19241d]">
                <button
                  onClick={() => setTradeMode('buy')}
                  className={`py-2 text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                    tradeMode === 'buy'
                      ? 'bg-[#22c55e] text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeMode('sell')}
                  className={`py-2 text-sm font-extrabold rounded-lg transition-all cursor-pointer ${
                    tradeMode === 'sell'
                      ? 'bg-[#ef4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Settings Gear Button */}
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isSettingsOpen
                    ? 'bg-[#1b261f] border-[#2f4236] text-[#8df0b5]'
                    : 'bg-[#111713] border-[#1d2720] text-slate-400 hover:text-white'
                }`}
                title="Trading slippage & MEV settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Inline Slippage & MEV Settings Drawer */}
            {isSettingsOpen && (
              <div className="mb-4 bg-[#111713] border border-[#243329] rounded-xl p-3 text-xs space-y-3 font-mono animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Slippage Tolerance</span>
                  <div className="flex items-center gap-1">
                    {['0.1', '0.5', '1.0', '2.0'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSlippage(s)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                          slippage === s ? 'bg-[#22c55e] text-black' : 'bg-[#19221c] text-slate-400 hover:text-white'
                        }`}
                      >
                        {s}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">Priority Fee</span>
                  <div className="flex items-center gap-1">
                    {(['Normal', 'Turbo', 'Ultra'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriorityFee(p)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                          priorityFee === p ? 'bg-[#8df0b5] text-black' : 'bg-[#19221c] text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#1b271f]">
                  <span className="text-slate-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" /> Anti-MEV Guard
                  </span>
                  <button
                    onClick={() => setAntiMev(!antiMev)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      antiMev ? 'bg-[#22c55e]' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${antiMev ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Order Type Dropdown (Market / Limit / DCA) */}
            <div className="relative mb-3">
              <button
                onClick={() => setIsOrderTypeOpen(!isOrderTypeOpen)}
                className="w-full flex items-center justify-between bg-[#111713] hover:bg-[#161f1a] border border-[#1e2a22] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-300 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 uppercase text-[10px]">Order Type:</span>
                  <span className="text-white">{orderType}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isOrderTypeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#121914] border border-[#223327] rounded-xl shadow-xl p-1 z-30 font-mono text-xs">
                  {(['Market', 'Limit', 'DCA'] as const).map((ot) => (
                    <button
                      key={ot}
                      onClick={() => {
                        setOrderType(ot);
                        setIsOrderTypeOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        orderType === ot ? 'bg-[#1d2921] text-[#8df0b5] font-bold' : 'text-slate-300 hover:bg-[#16201a]'
                      }`}
                    >
                      {ot} Order {ot === 'Market' && '⚡ (Instant Fill)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AMOUNT Input Box with Crypto Currency Logo */}
            <div className="bg-[#090d0b] border border-[#1b251e] focus-within:border-[#22c55e] rounded-xl p-3.5 mb-3 transition-colors">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span className="uppercase text-[10px] font-bold tracking-wider text-slate-500">
                  {tradeMode === 'buy' ? 'AMOUNT TO PAY' : 'AMOUNT TO SELL'}
                </span>
                <div className="flex items-center gap-2">
                  <span>
                    Bal: {tradeMode === 'buy' ? `${wallet.balanceBNB || 0} ${nativeCurrency}` : `${userPosition.tokens.toLocaleString()} ${selectedToken.symbol}`}
                  </span>
                  <button
                    onClick={() => setPresetAmount('HALF')}
                    className="text-[#8df0b5] hover:underline cursor-pointer font-bold text-[11px]"
                  >
                    HALF
                  </button>
                  <button
                    onClick={() => setPresetAmount('MAX')}
                    className="text-[#8df0b5] hover:underline cursor-pointer font-bold text-[11px]"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-extrabold text-white outline-none font-mono placeholder:text-slate-700"
                />

                {/* Currency Badge inside Amount box */}
                <div className="flex items-center gap-1.5 bg-[#121914] border border-[#212f25] px-2.5 py-1.5 rounded-lg shrink-0">
                  {tradeMode === 'buy' ? (
                    <>
                      {isBsc ? <BnbIcon className="w-4 h-4" /> : <SolanaIcon className="w-4 h-4" />}
                      <span className="text-xs font-bold text-white font-mono">{nativeCurrency}</span>
                    </>
                  ) : (
                    <>
                      <img src={selectedToken.icon} alt={selectedToken.symbol} className="w-4 h-4 rounded-full object-cover" />
                      <span className="text-xs font-bold text-white font-mono">{selectedToken.symbol}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Estimated USD Value */}
              <div className="mt-1 text-[11px] font-mono text-slate-500">
                ≈ ${estimatedUsdValue.toFixed(2)} USD
              </div>
            </div>

            {/* Quick Preset Buttons (Degens live by these buttons!) */}
            <div className="grid grid-cols-5 gap-1.5 mb-3 font-mono">
              {tradeMode === 'buy' ? (
                <>
                  <button
                    onClick={() => setPresetAmount(0.1)}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-300 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    0.1
                  </button>
                  <button
                    onClick={() => setPresetAmount(0.5)}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-300 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    0.5
                  </button>
                  <button
                    onClick={() => setPresetAmount(1.0)}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-300 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    1.0
                  </button>
                  <button
                    onClick={() => setPresetAmount(5.0)}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-300 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    5.0
                  </button>
                  <button
                    onClick={() => setPresetAmount('MAX')}
                    className="py-1.5 bg-[#132018] hover:bg-[#1a2e22] text-[#8df0b5] border border-[#223d2e] rounded-lg text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    MAX
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setPayAmount(Math.round(userPosition.tokens * 0.25).toString())}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-300 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => setPayAmount(Math.round(userPosition.tokens * 0.5).toString())}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-300 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => setPayAmount(Math.round(userPosition.tokens * 0.75).toString())}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-300 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    75%
                  </button>
                  <button
                    onClick={() => setPayAmount(userPosition.tokens.toString())}
                    className="py-1.5 bg-[#251515] hover:bg-[#381a1a] text-[#ef4444] border border-[#442020] rounded-lg text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setPayAmount('0')}
                    className="py-1.5 bg-[#111713] hover:bg-[#1a231d] text-slate-400 hover:text-white border border-[#1b261f] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </>
              )}
            </div>

            {/* Estimated Output Row */}
            <div className="bg-[#101512] border border-[#19221b] rounded-xl p-3 mb-3 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>You will receive (est.):</span>
                <span className="font-bold text-white">
                  {tradeMode === 'buy'
                    ? `${Math.round(tokensEstimated).toLocaleString()} ${selectedToken.symbol}`
                    : `${tokensEstimated.toFixed(4)} ${nativeCurrency}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Price Impact:</span>
                <span className="text-[#22c55e]">~0.04%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Network Routing:</span>
                <span>Retro High-Speed DEX Router</span>
              </div>
            </div>

            {/* Slippage & Priority Badge */}
            <div className="flex items-center justify-between px-1 mb-4 text-[11px] font-mono text-slate-400">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1 hover:text-white cursor-pointer"
              >
                <Zap className="w-3 h-3 text-[#f59e0b]" />
                <span>Slippage: {slippage}%</span>
              </button>
              <span className="text-slate-600">·</span>
              <span className="text-[#8df0b5] flex items-center gap-1">
                <Check className="w-3 h-3" /> {priorityFee} Priority
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-[#38bdf8] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Anti-MEV
              </span>
            </div>

            {/* CTA Button */}
            {!wallet.isConnected ? (
              <button
                onClick={onOpenWalletModal}
                className="w-full py-3.5 bg-[#22c55e] hover:bg-[#1ea34d] text-black font-extrabold rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.35)] transition-all cursor-pointer text-sm"
              >
                Connect Wallet to Trade
              </button>
            ) : (
              <button
                onClick={handleSwap}
                disabled={isSwapping || parsedAmount <= 0}
                className={`w-full py-3.5 font-extrabold rounded-xl transition-all cursor-pointer text-sm flex items-center justify-center gap-2 ${
                  tradeMode === 'buy'
                    ? 'bg-[#22c55e] hover:bg-[#1ea34d] text-black shadow-[0_0_25px_rgba(34,197,94,0.35)] disabled:opacity-50'
                    : 'bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-[0_0_25px_rgba(239,68,68,0.35)] disabled:opacity-50'
                }`}
              >
                {isSwapping ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Executing on DEX...</span>
                  </>
                ) : (
                  <span>
                    {tradeMode === 'buy'
                      ? `Buy ${selectedToken.symbol} (Instant Swap)`
                      : `Sell ${selectedToken.symbol}`}
                  </span>
                )}
              </button>
            )}

            {/* Success Notification Banner */}
            {successMsg && (
              <div className="mt-3 bg-[#132219] border border-[#22c55e] text-[#22c55e] rounded-xl p-2.5 text-xs font-mono font-bold text-center animate-bounce">
                {successMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
