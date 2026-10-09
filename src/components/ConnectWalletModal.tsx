import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Check, Wallet } from 'lucide-react';
import { SolanaIcon, BnbIcon, BaseIcon } from './Icons';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletName: string) => void;
}

export function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const wallets = [
    {
      id: 'phantom',
      name: 'Phantom',
      recommended: true,
      badge: 'Solana Pick',
      description: 'The premier wallet for Solana & multi-chain',
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-xl">
          👻
        </div>
      )
    },
    {
      id: 'solflare',
      name: 'Solflare',
      badge: 'Solana Native',
      description: 'Non-custodial wallet built for Solana DeFi',
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-xl">
          🔥
        </div>
      )
    },
    {
      id: 'backpack',
      name: 'Backpack',
      badge: 'xNFT',
      description: 'Next-gen crypto wallet & decentralized exchange',
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-xl">
          🎒
        </div>
      )
    },
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Universal browser extension & mobile wallet',
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-xl">
          🦊
        </div>
      )
    },
    {
      id: 'binance',
      name: 'Binance Web3 Wallet',
      description: 'Integrated MPC wallet with multi-chain swap',
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center p-2">
          <BnbIcon className="w-6 h-6" />
        </div>
      )
    },
    {
      id: 'okx',
      name: 'OKX Wallet',
      description: 'Leading multi-chain decentralized Web3 portal',
      icon: (
        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl">
          ⬛
        </div>
      )
    }
  ];

  const handleWalletSelect = (walletName: string) => {
    setConnectingWallet(walletName);
    setTimeout(() => {
      onConnect(walletName);
      setConnectingWallet(null);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0f1411] border border-[#202b24] rounded-3xl p-6 sm:p-7 font-sans text-slate-100 shadow-2xl shadow-emerald-950/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1b251f]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-[#8df0b5] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Connect Web3 Wallet</h3>
              <p className="text-[11px] text-slate-400">Solana & Multi-Chain Ecosystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 my-3 leading-relaxed">
          Select your Web3 wallet provider to launch tokens, trade coins, and claim 1% creator royalties on Retro.
        </p>

        {/* Wallets List */}
        <div className="space-y-2 my-4 max-h-[380px] overflow-y-auto pr-1">
          {wallets.map((w) => (
            <button
              key={w.id}
              onClick={() => handleWalletSelect(w.name)}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#141b17] hover:bg-[#1a231e] border border-[#1e2821] hover:border-[#8df0b5]/50 transition-all text-left cursor-pointer group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                {w.icon}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#8df0b5] transition-colors">
                      {w.name}
                    </span>
                    {w.badge && (
                      <span className="bg-emerald-500/15 border border-emerald-500/30 text-[#8df0b5] text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                        {w.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[210px]">
                    {w.description}
                  </p>
                </div>
              </div>

              <div className="text-slate-500 group-hover:text-[#8df0b5] transition-colors">
                {connectingWallet === w.name ? (
                  <div className="w-4 h-4 border-2 border-[#8df0b5] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Security badge note */}
        <div className="pt-3 border-t border-[#1b251f] flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8df0b5]" />
          <span>Non-custodial & secure direct client connection</span>
        </div>
      </div>
    </div>
  );
}
