import React, { useState } from 'react';
import {
  X,
  Plus,
  Upload,
  Coins,
  Shield,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Token, WalletState } from '../types/token';
import { SolanaIcon, BaseIcon, EthereumIcon, BnbIcon } from './Icons';

interface LaunchTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onTokenLaunched: (token: Token) => void;
}

export function LaunchTokenModal({
  isOpen,
  onClose,
  wallet,
  onOpenWalletModal,
  onTokenLaunched,
}: LaunchTokenModalProps) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80');
  const [selectedChain, setSelectedChain] = useState<'solana' | 'base' | 'ethereum' | 'bsc'>('solana');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [initialBuyBnb, setInitialBuyBnb] = useState('0.1');
  const [isDeploying, setIsDeploying] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdToken, setCreatedToken] = useState<Token | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }
    if (!name.trim() || !symbol.trim()) return;

    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);

      const formattedSymbol = symbol.startsWith('$') ? symbol : `$${symbol.toUpperCase()}`;
      const randomContract = `${selectedChain === 'solana' ? '7' : '0x'}${Array.from({ length: 34 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const newToken: Token = {
        id: `token-${Date.now()}`,
        name: name.trim(),
        symbol: formattedSymbol,
        icon: iconUrl,
        verified: true,
        price: 0.000045,
        payToken: selectedChain === 'solana' ? 'SOL' : selectedChain === 'bsc' ? 'BNB' : 'ETH',
        payTokenIcon: selectedChain === 'solana' ? 'sol' : selectedChain === 'bsc' ? 'bnb' : 'eth',
        mcap: 45000,
        ath: 45000,
        age: 'Just now',
        txns: 1,
        vol24h: 580,
        traders: 1,
        change5m: 0,
        change1h: 0,
        change4h: 0,
        change24h: 0,
        category: 'new',
        chain: selectedChain,
        buyTax: 0,
        sellTax: 1,
        holders: 1,
        liquidity: 12500,
        contractAddress: randomContract,
        description: description.trim() || 'Community-launched coin on Retro with 1% creator fee standard.',
        twitter: twitter.trim() || undefined,
        telegram: telegram.trim() || undefined,
        creator: {
          handle: wallet.address ? `@${wallet.address.slice(0, 6)}` : '@RetroCreator',
          avatar: iconUrl,
          verified: true,
          earningsUsd: 0,
        },
        sparkline: [20, 25, 30, 45, 50, 60, 75, 80, 90, 100],
        createdAt: 'Just now',
      };

      setCreatedToken(newToken);
      onTokenLaunched(newToken);
      setStep('success');
    }, 1200);
  };

  const handleReset = () => {
    setName('');
    setSymbol('');
    setDescription('');
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0e1310] border border-[#1f2a24] rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#18221c] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            {/* Modal Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[#8df0b5] border border-emerald-500/30 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1% Creator Fee Standard</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Launch a new coin</h2>
              <p className="text-xs text-slate-400 mt-1">
                Zero upfront liquidity needed. Automated bonding curve & instant trading pool.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Token Name & Symbol */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Coin Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RetroPay"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141b17] border border-[#233129] focus:border-[#8df0b5] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Symbol *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RETRO"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-[#141b17] border border-[#233129] focus:border-[#8df0b5] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none uppercase font-mono"
                  />
                </div>
              </div>

              {/* Chain Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Deployment Chain
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'solana' as const, name: 'Solana', icon: SolanaIcon },
                    { id: 'base' as const, name: 'Base', icon: BaseIcon },
                    { id: 'bsc' as const, name: 'BSC', icon: BnbIcon },
                    { id: 'ethereum' as const, name: 'Ethereum', icon: EthereumIcon },
                  ].map((chain) => {
                    const Icon = chain.icon;
                    const isSelected = selectedChain === chain.id;

                    return (
                      <button
                        type="button"
                        key={chain.id}
                        onClick={() => setSelectedChain(chain.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1b2620] border-[#8df0b5] text-white'
                            : 'bg-[#141b17] border-[#233129] text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-[11px] font-semibold">{chain.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Image Preview / Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Token Icon Image URL
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={iconUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-[#233129] shrink-0"
                  />
                  <input
                    type="url"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-[#141b17] border border-[#233129] focus:border-[#8df0b5] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell the community what makes this coin special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#141b17] border border-[#233129] focus:border-[#8df0b5] rounded-xl px-3.5 py-2 text-xs text-white outline-none resize-none"
                />
              </div>

              {/* Creator Royalty Info Callout */}
              <div className="p-3 bg-[#131c17] rounded-xl border border-[#233129] flex items-center justify-between text-xs">
                <span className="text-slate-300">Creator Fee Guaranteed</span>
                <span className="font-bold text-[#8df0b5] font-mono">1.0% on every swap</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isDeploying}
                className="w-full py-3.5 bg-[#8df0b5] hover:bg-[#74ea9e] active:scale-98 disabled:opacity-50 text-black font-extrabold text-sm rounded-full transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isDeploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>LAUNCHING ON {selectedChain.toUpperCase()}...</span>
                  </>
                ) : !wallet.isConnected ? (
                  <span>CONNECT WALLET TO LAUNCH</span>
                ) : (
                  <span>CREATE & LAUNCH COIN</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-[#8df0b5] flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-xl font-bold text-white">Coin Successfully Launched!</h3>
            <p className="text-xs text-slate-400">
              Your token {createdToken?.symbol} is now live and tradeable on Retro. All creator fees will accrue to your wallet.
            </p>

            {createdToken && (
              <div className="p-3 bg-[#131c17] rounded-xl border border-[#233129] text-left text-xs font-mono">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Contract:</span>
                  <span className="text-white truncate max-w-[200px]">{createdToken.contractAddress}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Chain:</span>
                  <span className="text-[#8df0b5] uppercase">{createdToken.chain}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 bg-[#8df0b5] text-black font-bold text-xs rounded-full cursor-pointer hover:bg-[#74ea9e]"
            >
              Done & View Coin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
