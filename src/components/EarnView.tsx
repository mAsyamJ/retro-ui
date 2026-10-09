import React, { useState } from 'react';
import {
  Coins,
  Link2,
  Rocket,
  Copy,
  Check,
  ExternalLink,
  Building,
  CreditCard,
  Wallet,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { Token, WalletState } from '../types/token';

interface EarnViewProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onLaunchClick: () => void;
  onSelectToken?: (token: Token) => void;
  tokens?: Token[];
}

export function EarnView({
  wallet,
  onOpenWalletModal,
  onLaunchClick,
}: EarnViewProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [referralActive, setReferralActive] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [showCashOutBankModal, setShowCashOutBankModal] = useState(false);
  const [showSendWalletModal, setShowSendWalletModal] = useState(false);
  const [cashOutSuccess, setCashOutSuccess] = useState<string | null>(null);

  // Balances
  const [creatorFeesClaimable, setCreatorFeesClaimable] = useState(0.00);
  const [referralClaimable, setReferralClaimable] = useState(0.00);
  const [deployerClaimable, setDeployerClaimable] = useState(0.00);
  const [claimedAllTime, setClaimedAllTime] = useState(0.00);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  const totalAvailableToClaim = creatorFeesClaimable + referralClaimable + deployerClaimable;
  const shortAddress = wallet.address ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}` : '3hKz...6nPw';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address || '3hKz7yQ98wrtP0LmC49mK7XwK8f92jN34m');
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleClaimAll = () => {
    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }
    if (totalAvailableToClaim <= 0) {
      setClaimToast("No unclaimed balance available right now.");
      setTimeout(() => setClaimToast(null), 3000);
      return;
    }
    setClaimedAllTime((prev) => prev + totalAvailableToClaim);
    setCreatorFeesClaimable(0);
    setReferralClaimable(0);
    setDeployerClaimable(0);
    setClaimToast(`Claimed $${totalAvailableToClaim.toFixed(2)} to your wallet!`);
    setTimeout(() => setClaimToast(null), 4000);
  };

  const handleActivateReferral = () => {
    const refLink = `https://bags.fm/$${wallet.address ? wallet.address.slice(0, 6) : 'spotty'}`;
    navigator.clipboard.writeText(refLink);
    setReferralActive(true);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-2">
      {/* Header (Exact text from Image 1) */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Earn
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-medium">
          Everything you've earned on Bags, in one place.
        </p>
      </div>

      {/* Top Banner Card: "Available to claim" (Matches Image 1) */}
      <div className="bg-[#121614] border border-[#1d2420] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Available to claim
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              ${totalAvailableToClaim.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              0 SOL across creator fees, referrals and deployer revenue
            </p>
          </div>

          <button
            onClick={handleClaimAll}
            className="self-start sm:self-center px-8 py-3.5 bg-[#4c7c5d] hover:bg-[#5a936e] active:scale-98 text-white font-bold text-sm rounded-full transition-all cursor-pointer shadow-lg"
          >
            Claim all
          </button>
        </div>

        {/* 3 Sub-Metrics Row inside Top Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1a221d]">
          {/* Creator fees */}
          <div className="bg-[#181e1b] rounded-2xl p-4 flex items-center gap-3 border border-[#202924]">
            <div className="w-9 h-9 rounded-xl bg-[#212a24] flex items-center justify-center text-slate-400 shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Creator fees</span>
              <span className="text-sm font-bold text-white font-mono">
                ${creatorFeesClaimable.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Referral earnings */}
          <div className="bg-[#181e1b] rounded-2xl p-4 flex items-center gap-3 border border-[#202924]">
            <div className="w-9 h-9 rounded-xl bg-[#212a24] flex items-center justify-center text-slate-400 shrink-0">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Referral earnings</span>
              <span className="text-sm font-bold text-white font-mono">
                ${referralClaimable.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Deployer revenue */}
          <div className="bg-[#181e1b] rounded-2xl p-4 flex items-center gap-3 border border-[#202924]">
            <div className="w-9 h-9 rounded-xl bg-[#212a24] flex items-center justify-center text-slate-400 shrink-0">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Deployer revenue</span>
              <span className="text-sm font-bold text-white font-mono">
                ${deployerClaimable.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Main Pillar Cards (Exact match to Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Creator fees */}
        <div className="bg-[#121614] border border-[#1d2420] rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header with Address */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1b231e] flex items-center justify-center text-slate-300">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white">Creator fees</span>
              </div>

              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
                title="Copy address"
              >
                <span>{shortAddress}</span>
                {copiedAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Big Amount */}
            <div>
              <div className="text-3xl font-extrabold text-white font-mono">
                ${creatorFeesClaimable.toFixed(2)}
              </div>
              <span className="text-xs text-slate-400 block font-medium mt-0.5">
                Available to claim
              </span>
              <span className="text-[11px] text-slate-500 font-mono block">
                0 SOL
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed">
              Nothing to claim right now — fees show up here as your coins trade.
            </p>

            {/* Claimed all-time row */}
            <div className="bg-[#181e1b] rounded-2xl p-3 flex items-center justify-between text-xs border border-[#202924]">
              <span className="text-slate-400 font-medium">Claimed all-time</span>
              <span className="font-bold text-white font-mono">${claimedAllTime.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleClaimAll}
            className="w-full py-3 bg-[#4c7c5d] hover:bg-[#5a936e] active:scale-98 text-white font-bold text-xs rounded-full transition-all cursor-pointer"
          >
            Claim all
          </button>
        </div>

        {/* Card 2: Referral earnings */}
        <div className="bg-[#121614] border border-[#1d2420] rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1b231e] flex items-center justify-center text-slate-300">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-white">Referral earnings</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Earn 50% of protocol fees when someone launches a coin with your link.
            </p>

            {referralActive && (
              <div className="p-3 bg-[#18231d] border border-[#273a2f] rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between text-[#8df0b5] font-bold">
                  <span>Referral Link Active</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] text-slate-400 font-mono block truncate">
                  bags.fm/${wallet.address ? wallet.address.slice(0, 6) : 'spotty'}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleActivateReferral}
            className="w-full py-3 bg-[#8df0b5] hover:bg-[#74ea9e] active:scale-98 text-black font-extrabold text-xs rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(141,240,181,0.25)] flex items-center justify-center gap-1.5"
          >
            {referralCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Link Copied!</span>
              </>
            ) : (
              <span>Activate referral link</span>
            )}
          </button>
        </div>

        {/* Card 3: Deployer earnings */}
        <div className="bg-[#121614] border border-[#1d2420] rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header with Address */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1b231e] flex items-center justify-center text-slate-300">
                  <Rocket className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white">Deployer earnings</span>
              </div>

              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
                title="Copy address"
              >
                <span>{shortAddress}</span>
                {copiedAddress ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            {/* Big Amount */}
            <div>
              <div className="text-3xl font-extrabold text-white font-mono">
                ${deployerClaimable.toFixed(2)}
              </div>
              <span className="text-xs text-slate-400 block font-medium mt-0.5">
                Available to claim
              </span>
              <span className="text-[11px] text-slate-500 font-mono block">
                0 SOL
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed">
              No deployer earnings to claim yet. Fees show up here as your coins trade.
            </p>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Deployers earn 0.20% from every trade (even if you share 100% of creator fees).
            </p>
          </div>

          <button
            onClick={handleClaimAll}
            className="w-full py-3 bg-[#4c7c5d] hover:bg-[#5a936e] active:scale-98 text-white font-bold text-xs rounded-full transition-all cursor-pointer"
          >
            Claim all
          </button>
        </div>
      </div>

      {/* Cash out Section (Exact match to Image 2) */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Cash out
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Move what you've earned to a bank account or a wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Bank or card */}
          <div className="bg-[#121614] border border-[#1d2420] rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1b231e] flex items-center justify-center text-slate-300">
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-white">Bank or card</span>
                </div>

                {/* MoonPay purple dot icon */}
                <div className="w-3.5 h-3.5 rounded-full bg-[#7c3aed] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Send money to your bank account or debit card with MoonPay. Settles in 1–3 business days, depending on your bank.
              </p>
            </div>

            <button
              onClick={() => setShowCashOutBankModal(true)}
              className="w-full py-3.5 bg-white hover:bg-slate-200 active:scale-98 text-black font-extrabold text-xs rounded-full transition-all cursor-pointer shadow-md"
            >
              Cash out to bank
            </button>
          </div>

          {/* Card 2: Wallet address */}
          <div className="bg-[#121614] border border-[#1d2420] rounded-3xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1b231e] flex items-center justify-center text-slate-300">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white">Wallet address</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Send money to a wallet address on Coinbase, Binance, Solana, or Robinhood. Payment settles instantly.
              </p>
            </div>

            <button
              onClick={() => setShowSendWalletModal(true)}
              className="w-full py-3.5 bg-white hover:bg-slate-200 active:scale-98 text-black font-extrabold text-xs rounded-full transition-all cursor-pointer shadow-md"
            >
              Send to a wallet
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section (Exact match to Image 2) */}
      <footer className="pt-12 pb-8 border-t border-[#171d1a] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-sans">
        <div>
          <span>© 2026 Retro Protocol, Inc.</span>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <a href="#about" onClick={(e) => { e.preventDefault(); alert("Retro: Decentralized meme & community launchpad with guaranteed creator fees."); }} className="hover:text-white transition-colors">About</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact: support@retro.trade"); }} className="hover:text-white transition-colors">Contact</a>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Service: By trading or deploying on Retro, you accept non-custodial smart contract terms."); }} className="hover:text-white transition-colors">Terms</a>
          <a href="#docs" onClick={(e) => { e.preventDefault(); alert("Docs: Comprehensive smart contract specifications and fee routing."); }} className="hover:text-white transition-colors">Docs</a>
          <a href="#discord" onClick={(e) => { e.preventDefault(); alert("Discord: Join over 100K active community members."); }} className="hover:text-white transition-colors">Discord</a>
          <a href="#support" onClick={(e) => { e.preventDefault(); alert("Support: Live 24/7 community support."); }} className="hover:text-white transition-colors">Support</a>
        </div>

        {/* App Store Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#121614] border border-[#222c26] rounded-xl px-3 py-1.5 cursor-pointer hover:border-slate-500 transition-colors">
            <span className="text-lg"></span>
            <div className="text-left leading-none">
              <span className="text-[8px] text-slate-400 block">Download on the</span>
              <span className="text-[11px] font-bold text-white block">App Store</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#121614] border border-[#222c26] rounded-xl px-3 py-1.5 cursor-pointer hover:border-slate-500 transition-colors">
            <span className="text-sm">▶</span>
            <div className="text-left leading-none">
              <span className="text-[8px] text-slate-400 block">GET IT ON</span>
              <span className="text-[11px] font-bold text-white block">Google Play</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Claim Toast */}
      {claimToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16211b] border border-[#8df0b5] rounded-2xl p-4 shadow-2xl text-xs font-bold text-white flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#8df0b5]" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* Cash out to bank modal */}
      {showCashOutBankModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121614] border border-[#202924] rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Cash out to Bank (MoonPay)</h3>
              <button onClick={() => setShowCashOutBankModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              MoonPay off-ramp connects securely to your local bank account. Settles in 1–3 business days.
            </p>
            <div className="p-3 bg-[#181f1b] rounded-xl border border-[#232d26] text-xs font-mono">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Available to withdraw:</span>
                <span className="text-white font-bold">${totalAvailableToClaim.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Estimated fiat:</span>
                <span className="text-[#8df0b5] font-bold">${totalAvailableToClaim.toFixed(2)} USD</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowCashOutBankModal(false);
                setClaimToast("MoonPay off-ramp session initiated. Check your email for confirmation.");
                setTimeout(() => setClaimToast(null), 4000);
              }}
              className="w-full py-3 bg-white hover:bg-slate-200 text-black font-bold text-xs rounded-full cursor-pointer"
            >
              Proceed with MoonPay
            </button>
          </div>
        </div>
      )}

      {/* Send to wallet modal */}
      {showSendWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121614] border border-[#202924] rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Send to External Wallet</h3>
              <button onClick={() => setShowSendWalletModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Transfer instantly to Coinbase, Binance, Solana, or Robinhood wallet.
            </p>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Destination Address</label>
              <input
                type="text"
                placeholder="Enter Solana or EVM address..."
                className="w-full bg-[#181f1b] border border-[#232d26] rounded-xl p-3 text-xs text-white outline-none font-mono"
              />
            </div>
            <button
              onClick={() => {
                setShowSendWalletModal(false);
                setClaimToast("Funds dispatched to external address!");
                setTimeout(() => setClaimToast(null), 4000);
              }}
              className="w-full py-3 bg-[#8df0b5] hover:bg-[#74ea9e] text-black font-bold text-xs rounded-full cursor-pointer"
            >
              Confirm Transfer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
